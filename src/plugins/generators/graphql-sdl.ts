/**
 * GraphQL SDL Generator
 * Generates GraphQL Schema Definition Language from grammar
 */

import type { Generator, PluginOptions } from "../types";
import type {
  Grammar,
  GrammarElement,
  ProductionRule,
  Terminal,
  Sequence,
  OneOf,
  Optional,
  List,
} from "../../grammar";

export interface GraphQLSDLOptions extends PluginOptions {
  /**
   * Include comments/descriptions
   */
  includeDescriptions?: boolean;

  /**
   * Format output with indentation
   */
  format?: boolean;

  /**
   * Indentation size
   */
  indentSize?: number;
}

/**
 * Generation context for tracking where we are in the grammar
 */
interface GenerationContext {
  ruleName?: string;
  fieldCount?: number;
  insideFieldsDefinition?: boolean;
  insideDescription?: boolean;
  insideDefaultValue?: boolean;
  insideEnumValue?: boolean;
  insideInputValueDefinition?: boolean;
  insideDirectiveConst?: boolean;
}

/**
 * GraphQL SDL generator plugin
 */
export const graphqlSDLGenerator: Generator<string> = {
  metadata: {
    name: "graphql-sdl",
    version: "1.0.0",
    description: "Generates GraphQL Schema Definition Language from grammar",
  },

  validateOptions(options: unknown): options is GraphQLSDLOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (
      opts.includeDescriptions !== undefined &&
      typeof opts.includeDescriptions !== "boolean"
    ) {
      return false;
    }
    if (opts.format !== undefined && typeof opts.format !== "boolean") {
      return false;
    }
    if (
      opts.indentSize !== undefined &&
      (typeof opts.indentSize !== "number" || opts.indentSize < 0)
    ) {
      return false;
    }
    return true;
  },

  getOutputFormat(): string {
    return "graphql";
  },

  generate(grammar: Grammar, options?: GraphQLSDLOptions): string {
    const opts: GraphQLSDLOptions = {
      includeDescriptions: true,
      format: true,
      indentSize: 2,
      ...options,
    };

    const indent = opts.format ? " ".repeat(opts.indentSize ?? 2) : "";
    const lines: string[] = [];
    const referencedTypes = new Set<string>();
    const referencedInputTypes = new Set<string>();
    const referencedDirectives = new Set<string>();
    const generatedTypeDefinitions = new Set<string>();

    // Special handling for SchemaDefinition - parse it specifically
    if (grammar.rules.SchemaDefinition) {
      const schemaDef = generateSchemaDefinition(
        grammar,
        grammar.rules.SchemaDefinition,
        indent,
        opts,
        referencedTypes
      );
      if (schemaDef) {
        lines.push(schemaDef);
        if (opts.format) {
          lines.push("");
        }
      }
    } else {
      // Start from root rule and generate recursively
      // RECOMMENDATION 4: Only generate what's in Document, not all type definitions
      const rootRule = grammar.rules[grammar.root];
      if (rootRule) {
        const generated = generateFromRule(
          grammar,
          rootRule,
          indent,
          opts,
          0,
          generatedTypeDefinitions,
          undefined,
          { fieldCount: 0 },
          referencedTypes,
          referencedInputTypes,
          referencedDirectives
        );
        if (generated) {
          lines.push(generated);
        }
      }
    }

    // Generate input type definitions for referenced input types that don't exist
    for (const typeName of referencedInputTypes) {
      if (!grammar.rules[`${typeName}TypeDefinition`] && !grammar.rules[`${typeName}InputTypeDefinition`] && !grammar.rules[typeName]) {
        // Generate a minimal input type definition
        const typeDef = opts.format
          ? `input ${typeName} {\n${indent}_: Boolean\n}`
          : `input ${typeName} { _: Boolean }`;
        lines.push(typeDef);
        if (opts.format) {
          lines.push("");
        }
      }
    }

    // Generate type definitions for referenced types that don't exist
    for (const typeName of referencedTypes) {
      if (!grammar.rules[`${typeName}TypeDefinition`] && !grammar.rules[typeName] && !referencedInputTypes.has(typeName)) {
        // Generate a minimal type definition
        const typeDef = opts.format
          ? `type ${typeName} {\n${indent}_: Boolean\n}`
          : `type ${typeName} { _: Boolean }`;
        lines.push(typeDef);
        if (opts.format) {
          lines.push("");
        }
      }
    }

    // Generate directive definitions for referenced directives that don't exist
    for (const directiveName of referencedDirectives) {
      // Generate a minimal directive definition that can be used on OBJECT type
      const directiveDef = opts.format
        ? `directive @${directiveName} on OBJECT`
        : `directive @${directiveName} on OBJECT`;
      lines.push(directiveDef);
      if (opts.format) {
        lines.push("");
      }
    }

    // GraphQL requires at least a Query type. If we have type definitions but no Query,
    // add a minimal Query type to make the schema valid
    // Check the full output string for Query type (handles multi-line strings)
    const fullOutput = lines.join(opts.format ? "\n" : " ");
    const hasQueryType = fullOutput.includes("type Query");
    
    // Always add Query type if we have any type definitions and no Query type exists
    if (!hasQueryType && lines.length > 0) {
      // Check if we have any type definitions (not just schema definition)
      const hasTypeDefinitions = fullOutput.includes("type ") || 
                                  fullOutput.includes("scalar ") ||
                                  fullOutput.includes("interface ") ||
                                  fullOutput.includes("union ") ||
                                  fullOutput.includes("enum ") ||
                                  fullOutput.includes("input ");
      
      if (hasTypeDefinitions) {
        const queryType = opts.format
          ? `type Query {\n${indent}_: Boolean\n}`
          : `type Query { _: Boolean }`;
        lines.push(queryType);
        if (opts.format) {
          lines.push("");
        }
      }
    }

    // RECOMMENDATION 4: Remove the loop that generates all type definitions
    // Only generate what's actually in the Document structure

    return lines.join(opts.format ? "\n" : " ");
  },
};

/**
 * Generate SDL from a production rule
 */
function generateFromRule(
  grammar: Grammar,
  rule: ProductionRule,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number,
  generatedTypeDefinitions?: Set<string>,
  contextRuleName?: string,
  context?: GenerationContext,
  referencedTypes?: Set<string>,
  referencedInputTypes?: Set<string>,
  referencedDirectives?: Set<string>
): string {
  // Track type definitions as they're generated
  if (generatedTypeDefinitions && rule.name.endsWith("TypeDefinition")) {
    generatedTypeDefinitions.add(rule.name);
  }
  
  // Update context with rule name
  const effectiveContext: GenerationContext = {
    ...context,
    ruleName: rule.name.endsWith("TypeDefinition") ? rule.name : contextRuleName,
    insideFieldsDefinition: rule.name === "FieldsDefinition",
    insideDescription: rule.name === "Description",
    insideDefaultValue: rule.name === "DefaultValue",
    insideEnumValue: rule.name === "EnumValue",
    insideInputValueDefinition: rule.name === "InputValueDefinition",
    insideDirectiveConst: rule.name === "DirectiveConst",
  };
  
  return generateFromElement(
    grammar,
    rule.definition,
    indent,
    options,
    depth,
    effectiveContext.ruleName,
    generatedTypeDefinitions,
    effectiveContext,
    referencedTypes,
    referencedInputTypes,
    referencedDirectives
  );
}

/**
 * Generate SDL from a grammar element
 */
function generateFromElement(
  grammar: Grammar,
  element: GrammarElement,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number,
  contextRuleName?: string,
  generatedTypeDefinitions?: Set<string>,
  context?: GenerationContext,
  referencedTypes?: Set<string>,
  referencedInputTypes?: Set<string>,
  referencedDirectives?: Set<string>
): string {
  switch (element.kind) {
    case "Terminal":
      return generateTerminal(element, grammar, contextRuleName, context, referencedTypes, referencedInputTypes, referencedDirectives);

    case "NonTerminal":
      return generateNonTerminal(
        grammar,
        element.name,
        indent,
        options,
        depth,
        contextRuleName,
        generatedTypeDefinitions,
        context,
        referencedTypes,
        referencedInputTypes,
        referencedDirectives
      );

    case "Sequence":
      return generateSequence(
        grammar,
        element,
        indent,
        options,
        depth,
        contextRuleName,
        generatedTypeDefinitions,
        context,
        referencedTypes,
        referencedInputTypes,
        referencedDirectives
      );

    case "OneOf":
      return generateOneOf(
        grammar,
        element,
        indent,
        options,
        depth,
        contextRuleName,
        generatedTypeDefinitions,
        context,
        referencedTypes,
        referencedInputTypes,
        referencedDirectives
      );

    case "Optional":
      // RECOMMENDATION 1: Skip Description when includeDescriptions is false
      return generateOptional(
        grammar,
        element,
        indent,
        options,
        depth,
        contextRuleName,
        generatedTypeDefinitions,
        context,
        referencedTypes,
        referencedInputTypes,
        referencedDirectives
      );

    case "List":
      return generateList(
        grammar,
        element,
        indent,
        options,
        depth,
        contextRuleName,
        generatedTypeDefinitions,
        context,
        referencedTypes,
        referencedInputTypes,
        referencedDirectives
      );

    default:
      return "";
  }
}

/**
 * Generate from an Optional element
 * RECOMMENDATION 1: Skip Description when includeDescriptions is false
 */
function generateOptional(
  grammar: Grammar,
  optional: Optional,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number,
  contextRuleName?: string,
  generatedTypeDefinitions?: Set<string>,
  context?: GenerationContext,
  referencedTypes?: Set<string>,
  referencedInputTypes?: Set<string>,
  referencedDirectives?: Set<string>
): string {
  // Check if this Optional contains a Description
  if (optional.element.kind === "NonTerminal" && optional.element.name === "Description") {
    // Skip Description if includeDescriptions is false
    if (!options.includeDescriptions) {
      return "";
    }
  }
  
  // Also check if the element resolves to Description
  if (optional.element.kind === "NonTerminal") {
    const rule = grammar.rules[optional.element.name];
    if (rule && rule.name === "Description" && !options.includeDescriptions) {
      return "";
    }
  }
  
  // Generate the optional element
  return generateFromElement(
    grammar,
    optional.element,
    indent,
    options,
    depth,
    contextRuleName,
    generatedTypeDefinitions,
    context,
    referencedTypes,
    referencedInputTypes,
    referencedDirectives
  );
}

/**
 * Generate from a Terminal
 * RECOMMENDATION 2 & 5: Context-aware name and value generation
 */
function generateTerminal(
  terminal: Terminal,
  _grammar: Grammar,
  contextRuleName?: string,
  context?: GenerationContext,
  referencedTypes?: Set<string>,
  referencedInputTypes?: Set<string>,
  referencedDirectives?: Set<string>
): string {
  // If terminal has a name that's a keyword, use it directly
  const keyword = terminal.name.toLowerCase();
  const graphQLKeywords = [
    "schema",
    "type",
    "interface",
    "union",
    "enum",
    "input",
    "scalar",
    "query",
    "mutation",
    "subscription",
    "implements",
    "extend",
    "directive",
    "on",
    "repeatable",
    "fragment",
    "null",
  ];

  if (graphQLKeywords.includes(keyword)) {
    return keyword;
  }

  // If it's a punctuator, return the name directly (e.g., "{", "}", ":", etc.)
  if (terminal.name.length === 1 || terminal.name === "..." || terminal.name === "@") {
    return terminal.name;
  }

  // RECOMMENDATION 5: Context-aware terminal value generation
  if (terminal.name === "StringValue") {
    // Generate quoted string value
    if (context?.insideDescription) {
      return `"Description text"`;
    }
    return `"StringValue"`;
  }

  if (terminal.name === "IntValue") {
    return "123";
  }

  if (terminal.name === "FloatValue") {
    return "123.45";
  }

  if (terminal.name === "BooleanValue") {
    return "true";
  }

  if (terminal.name === "NullValue") {
    return "null";
  }

  if (terminal.name === "EnumValue") {
    // Enum values are uppercase, no quotes
    if (context?.insideEnumValue) {
      return "ENUM_VALUE";
    }
    return "ENUM_VALUE";
  }

  // RECOMMENDATION 2: Context-aware Name generation
  if (terminal.name === "Name") {
    // DirectiveConst context - generate directive name
    if (context?.insideDirectiveConst || contextRuleName === "DirectiveConst") {
      const directiveName = "directiveName";
      // Track referenced directive so we can generate it if missing
      if (referencedDirectives) {
        referencedDirectives.add(directiveName);
      }
      return directiveName;
    }
    
    // EnumValue context - generate enum value name (uppercase)
    if (context?.insideEnumValue || contextRuleName === "EnumValue") {
      return "ENUM_VALUE";
    }
    
    // NamedType/Type context - generate type name
    // Check if we're in InputValueDefinition context FIRST (for argument types)
    if ((context?.ruleName === "NamedType" || context?.ruleName === "Type" || contextRuleName === "Type" || contextRuleName === "NamedType") && 
        context?.insideInputValueDefinition) {
      // Generate Input Type for arguments
      const typeName = "ArgumentType";
      // Track referenced input type so we can generate it if missing
      if (referencedInputTypes) {
        referencedInputTypes.add(typeName);
      }
      return typeName;
    }
    
    // NamedType/Type context - generate type name (for field return types)
    if (context?.ruleName === "NamedType" || context?.ruleName === "Type" || contextRuleName === "Type" || contextRuleName === "NamedType") {
      const typeName = "FieldType";
      // Track referenced type so we can generate it if missing
      if (referencedTypes) {
        referencedTypes.add(typeName);
      }
      return typeName;
    }
    
    // InputValueDefinition context - generate argument name (not type)
    // Only generate argument name if we're directly in InputValueDefinition context (not Type/NamedType)
    if (contextRuleName === "InputValueDefinition" && context?.ruleName !== "Type" && context?.ruleName !== "NamedType") {
      return "argumentName";
    }
    
    // FieldDefinition context - generate camelCase field names
    // Only when we're directly in FieldDefinition context (not Type/NamedType)
    if (contextRuleName === "FieldDefinition" && context?.ruleName === "FieldDefinition") {
      const fieldCount = (context?.fieldCount ?? 0);
      if (context) {
        context.fieldCount = fieldCount + 1;
      }
      return fieldCount === 0 ? "fieldName" : `fieldName${fieldCount + 1}`;
    }
    
    // Type definition contexts - generate type names
    if (contextRuleName === "ScalarTypeDefinition") {
      return "ScalarName";
    }
    if (contextRuleName === "ObjectTypeDefinition") {
      return "TypeName";
    }
    if (contextRuleName === "InterfaceTypeDefinition") {
      return "InterfaceName";
    }
    if (contextRuleName === "UnionTypeDefinition") {
      return "UnionName";
    }
    if (contextRuleName === "EnumTypeDefinition") {
      return "EnumName";
    }
    if (contextRuleName === "InputObjectTypeDefinition") {
      return "InputObjectName";
    }
    
    // Default placeholder for Name
    return "TypeName";
  }

  // For other terminals, return empty or placeholder
  return "";
}

/**
 * Generate from a NonTerminal by resolving the rule
 */
function generateNonTerminal(
  grammar: Grammar,
  ruleName: string,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number,
  contextRuleName?: string,
  generatedTypeDefinitions?: Set<string>,
  context?: GenerationContext,
  referencedTypes?: Set<string>,
  referencedInputTypes?: Set<string>,
  referencedDirectives?: Set<string>
): string {
  const rule = grammar.rules[ruleName];
  if (!rule) {
    return "";
  }

  // Update context based on rule name
  // Important: Preserve fieldCount from parent context
  const updatedContext: GenerationContext = {
    ...context,
    ruleName: rule.name.endsWith("TypeDefinition") ? rule.name : (rule.name === "EnumValue" ? "EnumValue" : contextRuleName),
    insideFieldsDefinition: rule.name === "FieldsDefinition" || context?.insideFieldsDefinition,
    insideDescription: rule.name === "Description" || context?.insideDescription,
    insideDefaultValue: rule.name === "DefaultValue" || context?.insideDefaultValue,
    insideEnumValue: rule.name === "EnumValue" || context?.insideEnumValue, // Preserve if already set
    insideInputValueDefinition: rule.name === "InputValueDefinition" || context?.insideInputValueDefinition,
    insideDirectiveConst: rule.name === "DirectiveConst" || context?.insideDirectiveConst,
    // Preserve fieldCount - don't reset it
    fieldCount: context?.fieldCount,
  };

  return generateFromRule(
    grammar,
    rule,
    indent,
    options,
    depth,
    generatedTypeDefinitions,
    updatedContext.ruleName,
    updatedContext,
    referencedTypes,
    referencedInputTypes,
    referencedDirectives
  );
}

/**
 * Generate from a Sequence
 * RECOMMENDATION 3: Proper formatting for nested structures
 */
function generateSequence(
  grammar: Grammar,
  sequence: Sequence,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number,
  contextRuleName?: string,
  generatedTypeDefinitions?: Set<string>,
  context?: GenerationContext,
  referencedTypes?: Set<string>,
  referencedInputTypes?: Set<string>,
  referencedDirectives?: Set<string>
): string {
  const parts: string[] = [];

  // Detect if this is a FieldsDefinition or similar brace-wrapped structure
  const isFieldsDefinition = contextRuleName === "FieldsDefinition" || context?.insideFieldsDefinition;
  
  for (let i = 0; i < sequence.elements.length; i++) {
    const element = sequence.elements[i];
    
    // For FieldDefinition sequence, update context for Type element
    // FieldDefinition structure: Name, Colon, Type
    // We want Type to have context "Type" not "FieldDefinition"
    let elementContextRuleName = contextRuleName;
    if (contextRuleName === "FieldDefinition" && element.kind === "NonTerminal" && element.name === "Type") {
      elementContextRuleName = "Type";
    }
    
    // For InputValueDefinition sequence, update context for Type element
    // InputValueDefinition structure: Name, Colon, Type
    // We want Type to have context "Type" but preserve insideInputValueDefinition flag
    let elementContext = context;
    if (contextRuleName === "InputValueDefinition" && element.kind === "NonTerminal" && element.name === "Type") {
      elementContextRuleName = "Type";
      // Preserve insideInputValueDefinition flag for Type generation
      elementContext = {
        ...context,
        insideInputValueDefinition: true,
        ruleName: "Type",
      };
    }
    
    // For DirectiveConst sequence, update context for Name element
    // DirectiveConst structure: At, Name
    if (contextRuleName === "DirectiveConst" && element.kind === "NonTerminal" && element.name === "Name") {
      elementContext = {
        ...context,
        insideDirectiveConst: true,
        ruleName: "DirectiveConst",
      };
    }
    
    // For EnumValueDefinition sequence, update context for EnumValue element
    // EnumValueDefinition structure: EnumValue (which contains Name)
    if (contextRuleName === "EnumValueDefinition" && element.kind === "NonTerminal" && element.name === "EnumValue") {
      elementContext = {
        ...context,
        insideEnumValue: true,
        ruleName: "EnumValue",
      };
    }
    
    const generated = generateFromElement(
      grammar,
      element,
      indent,
      options,
      depth,
      elementContextRuleName,
      generatedTypeDefinitions,
      elementContext,
      referencedTypes,
      referencedInputTypes,
      referencedDirectives
    );

    if (generated && generated.trim()) {
      parts.push(generated);
    }
  }

  // RECOMMENDATION 3: Format FieldsDefinition with proper indentation
  if (isFieldsDefinition && options.format) {
    // FieldsDefinition structure: BraceL, List<FieldDefinition>, BraceR
    // We need to format fields on separate lines with indentation
    const braceLIndex = parts.findIndex(p => p === "{");
    const braceRIndex = parts.findIndex(p => p === "}");
    
    if (braceLIndex >= 0 && braceRIndex > braceLIndex) {
      const beforeBrace = parts.slice(0, braceLIndex);
      const fields = parts.slice(braceLIndex + 1, braceRIndex);
      const afterBrace = parts.slice(braceRIndex + 1);
      
      // Format fields on separate lines with indentation
      const fieldIndent = indent.repeat(depth + 1);
      const formattedFields = fields
        .filter(f => f.trim())
        .map(field => `${fieldIndent}${field.trim()}`)
        .join("\n");
      
      const result: string[] = [];
      if (beforeBrace.length > 0) {
        result.push(beforeBrace.join(" "));
      }
      result.push("{");
      if (formattedFields) {
        result.push(formattedFields);
      }
      result.push("}");
      if (afterBrace.length > 0) {
        result.push(afterBrace.join(" "));
      }
      
      return result.join("\n");
    }
  }

  // For regular sequences, join with space
  return parts.join(" ");
}

/**
 * Generate from a OneOf (select first option for now)
 */
function generateOneOf(
  grammar: Grammar,
  oneOf: OneOf,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number,
  contextRuleName?: string,
  generatedTypeDefinitions?: Set<string>,
  context?: GenerationContext,
  referencedTypes?: Set<string>,
  referencedInputTypes?: Set<string>,
  referencedDirectives?: Set<string>
): string {
  if (oneOf.options.length > 0) {
    return generateFromElement(
      grammar,
      oneOf.options[0],
      indent,
      options,
      depth,
      contextRuleName,
      generatedTypeDefinitions,
      context,
      referencedTypes,
      referencedInputTypes,
      referencedDirectives
    );
  }
  return "";
}

/**
 * Generate from a List
 * RECOMMENDATION 3: Proper formatting for field lists
 */
function generateList(
  grammar: Grammar,
  list: List,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number,
  contextRuleName?: string,
  generatedTypeDefinitions?: Set<string>,
  context?: GenerationContext,
  referencedTypes?: Set<string>,
  referencedInputTypes?: Set<string>,
  referencedDirectives?: Set<string>
): string {
  const nextDepth = depth + 1;
  const items: string[] = [];

  // Special handling for List of RootOperationTypeDefinition
  if (
    list.element.kind === "NonTerminal" &&
    list.element.name === "RootOperationTypeDefinition"
  ) {
    const operationTypes = ["query", "mutation", "subscription"];
    const typeNames = ["Query", "Mutation", "Subscription"];

    for (let i = 0; i < operationTypes.length; i++) {
      const opType = operationTypes[i];
      const typeName = typeNames[i];
      const item = options.format
        ? `${indent.repeat(nextDepth)}${opType}: ${typeName}`
        : `${opType}: ${typeName}`;
      items.push(item);
    }

    return items.join(options.format ? "\n" : " ");
  }

  // Special handling for List of DirectiveConst
  if (
    list.element.kind === "NonTerminal" &&
    list.element.name === "DirectiveConst"
  ) {
    const directiveContext: GenerationContext = {
      ...context,
      insideDirectiveConst: true,
      ruleName: "DirectiveConst",
    };
    
    const item = generateFromElement(
      grammar,
      list.element,
      indent,
      options,
      depth,
      "DirectiveConst",
      generatedTypeDefinitions,
      directiveContext,
      referencedTypes,
      referencedInputTypes,
      referencedDirectives
    );
    
    if (item) {
      return item;
    }
  }

  // RECOMMENDATION 3: Special handling for FieldDefinition lists (inside FieldsDefinition)
  if (
    list.element.kind === "NonTerminal" &&
    list.element.name === "FieldDefinition" &&
    context?.insideFieldsDefinition
  ) {
    // Generate a single field for now (can be extended to generate multiple)
    // Don't increment fieldCount here - let the FieldDefinition sequence handle it
    const fieldContext: GenerationContext = {
      ...context,
      ruleName: "FieldDefinition",
      fieldCount: context.fieldCount ?? 0, // Start at 0, will be incremented in FieldDefinition
    };
    
    const item = generateFromElement(
      grammar,
      list.element,
      indent,
      options,
      depth,
      "FieldDefinition",
      generatedTypeDefinitions,
      fieldContext,
      referencedTypes,
      referencedInputTypes,
      referencedDirectives
    );
    
    if (item) {
      // Field is already formatted as a single line (e.g., "fieldName: FieldType")
      return item;
    }
  }
  
  // Special handling for List of EnumValueDefinition
  if (
    list.element.kind === "NonTerminal" &&
    list.element.name === "EnumValueDefinition"
  ) {
    const enumValueContext: GenerationContext = {
      ...context,
      insideEnumValue: true,
      ruleName: "EnumValue",
    };
    
    const item = generateFromElement(
      grammar,
      list.element,
      indent,
      options,
      depth,
      "EnumValueDefinition",
      generatedTypeDefinitions,
      enumValueContext,
      referencedTypes,
      referencedInputTypes,
      referencedDirectives
    );
    
    if (item) {
      return item;
    }
  }

  // For other lists, generate a single item as placeholder
  const item = generateFromElement(
    grammar,
    list.element,
    indent,
    options,
    depth,
    contextRuleName,
    generatedTypeDefinitions,
    context,
    referencedTypes,
    referencedInputTypes,
    referencedDirectives
  );

  if (item) {
    return item;
  }

  return "";
}

/**
 * Generate schema definition specifically
 */
function generateSchemaDefinition(
  grammar: Grammar,
  rule: ProductionRule,
  indent: string,
  options: GraphQLSDLOptions,
  referencedTypes: Set<string>
): string {
  if (rule.definition.kind !== "Sequence") {
    return "";
  }

  let foundSchemaKeyword = false;
  let foundBraceL = false;
  const rootOpDefs: string[] = [];

  // Parse the sequence elements
  for (const element of rule.definition.elements) {
    // RECOMMENDATION 1: Skip optional Description if includeDescriptions is false
    if (element.kind === "Optional") {
      if (element.element.kind === "NonTerminal" && element.element.name === "Description") {
        if (!options.includeDescriptions) {
          continue;
        }
      }
    }

    // Handle Terminal "schema"
    if (element.kind === "Terminal" && element.name === "schema") {
      foundSchemaKeyword = true;
      continue;
    }

    // Handle BraceL
    if (element.kind === "NonTerminal" && element.name === "BraceL") {
      foundBraceL = true;
      continue;
    }

    // Handle List of RootOperationTypeDefinition
    if (element.kind === "List") {
      const list = element as List;
      if (
        list.element.kind === "NonTerminal" &&
        list.element.name === "RootOperationTypeDefinition"
      ) {
        const rootOpRule = grammar.rules["RootOperationTypeDefinition"];
        if (rootOpRule && rootOpRule.definition.kind === "Sequence") {
          const operationTypeRule = grammar.rules["OperationType"];
          if (operationTypeRule && operationTypeRule.definition.kind === "OneOf") {
            const oneOf = operationTypeRule.definition as OneOf;
            const operationTypes: string[] = [];

            for (const option of oneOf.options) {
              if (option.kind === "Terminal") {
                operationTypes.push(option.name);
              }
            }

            const typeNames = ["Query", "Mutation", "Subscription"];

            for (let i = 0; i < operationTypes.length; i++) {
              const opType = operationTypes[i];
              const typeName = typeNames[i] || "Type";
              
              referencedTypes.add(typeName);
              
              const def = options.format
                ? `${indent}${opType}: ${typeName}`
                : `${opType}: ${typeName}`;
              rootOpDefs.push(def);
            }
          }
        }
        continue;
      }
    }

    // Handle BraceR
    if (element.kind === "NonTerminal" && element.name === "BraceR") {
      continue;
    }
  }

  // Build the final schema definition
  if (foundSchemaKeyword) {
    const parts: string[] = ["schema"];
    if (foundBraceL) {
      parts.push("{");
    }
    if (rootOpDefs.length > 0) {
      if (options.format) {
        parts.push(rootOpDefs.join("\n"));
      } else {
        parts.push(rootOpDefs.join(" "));
      }
    }
    parts.push("}");

    return parts.join(options.format ? "\n" : " ");
  }

  return "";
}
