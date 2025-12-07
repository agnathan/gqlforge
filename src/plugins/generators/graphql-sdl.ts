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
      const rootRule = grammar.rules[grammar.root];
      if (rootRule) {
        const generated = generateFromRule(grammar, rootRule, indent, opts, 0);
        if (generated) {
          lines.push(generated);
        }
      }
    }

    // Generate type definitions for referenced types that don't exist
    for (const typeName of referencedTypes) {
      if (!grammar.rules[`${typeName}TypeDefinition`] && !grammar.rules[typeName]) {
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

    // Generate type definitions from grammar
    const typeDefinitions = [
      "ScalarTypeDefinition",
      "ObjectTypeDefinition",
      "InterfaceTypeDefinition",
      "UnionTypeDefinition",
      "EnumTypeDefinition",
      "InputObjectTypeDefinition",
    ];

    for (const typeDef of typeDefinitions) {
      const rule = grammar.rules[typeDef];
      if (rule) {
        const sdl = generateFromRule(grammar, rule, indent, opts, 0);
        if (sdl) {
          lines.push(sdl);
          if (opts.format) {
            lines.push("");
          }
        }
      }
    }

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
  depth: number
): string {
  return generateFromElement(grammar, rule.definition, indent, options, depth);
}

/**
 * Generate SDL from a grammar element
 */
function generateFromElement(
  grammar: Grammar,
  element: GrammarElement,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number
): string {
  switch (element.kind) {
    case "Terminal":
      return generateTerminal(element, grammar);

    case "NonTerminal":
      return generateNonTerminal(grammar, element.name, indent, options, depth);

    case "Sequence":
      return generateSequence(
        grammar,
        element,
        indent,
        options,
        depth
      );

    case "OneOf":
      return generateOneOf(grammar, element, indent, options, depth);

    case "Optional":
      // For Optional, we generate it if it's commonly present
      // In practice, we'll generate it for now (can be made configurable)
      return generateFromElement(
        grammar,
        element.element,
        indent,
        options,
        depth
      );

    case "List":
      return generateList(grammar, element, indent, options, depth);

    default:
      return "";
  }
}

/**
 * Generate from a Terminal
 */
function generateTerminal(terminal: Terminal, _grammar: Grammar): string {
  // If terminal has a name that's a keyword, use it directly
  // Check if it's a known GraphQL keyword
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
  ];

  if (graphQLKeywords.includes(keyword)) {
    return keyword;
  }

  // If it's a punctuator, return the name directly (e.g., "{", "}", ":", etc.)
  if (terminal.name.length === 1 || terminal.name === "..." || terminal.name === "@") {
    return terminal.name;
  }

  // For other terminals, try to extract from pattern or use name
  // This is a placeholder - in a full implementation, we'd need to handle
  // actual token values from parsing
  return terminal.name;
}

/**
 * Generate from a NonTerminal by resolving the rule
 */
function generateNonTerminal(
  grammar: Grammar,
  ruleName: string,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number
): string {
  const rule = grammar.rules[ruleName];
  if (!rule) {
    // If rule doesn't exist, return empty or placeholder
    return "";
  }

  return generateFromRule(grammar, rule, indent, options, depth);
}

/**
 * Generate from a Sequence
 */
function generateSequence(
  grammar: Grammar,
  sequence: Sequence,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number
): string {
  const parts: string[] = [];

  for (const element of sequence.elements) {
    const generated = generateFromElement(
      grammar,
      element,
      indent,
      options,
      depth
    );

    if (generated) {
      // Skip empty strings
      if (generated.trim()) {
        parts.push(generated);
      }
    }
  }

  return parts.join(options.format ? " " : "");
}

/**
 * Generate from a OneOf (select first option for now)
 * In a full implementation, this would need context to choose the right option
 */
function generateOneOf(
  grammar: Grammar,
  oneOf: OneOf,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number
): string {
  // For OneOf, we need to select one option
  // For OperationType specifically, we might want to generate all options
  // For now, generate the first option
  if (oneOf.options.length > 0) {
    return generateFromElement(
      grammar,
      oneOf.options[0],
      indent,
      options,
      depth
    );
  }
  return "";
}

/**
 * Generate from a List
 * For Lists in schema definitions, we generate all items
 */
function generateList(
  grammar: Grammar,
  list: List,
  indent: string,
  options: GraphQLSDLOptions,
  depth: number
): string {
  const nextIndent = depth + 1;
  const items: string[] = [];

  // Special handling for List of RootOperationTypeDefinition
  // We need to generate all three operation types (query, mutation, subscription)
  if (
    list.element.kind === "NonTerminal" &&
    list.element.name === "RootOperationTypeDefinition"
  ) {
    // Generate all three operation types
    const operationTypes = ["query", "mutation", "subscription"];
    const typeNames = ["Query", "Mutation", "Subscription"];

    for (let i = 0; i < operationTypes.length; i++) {
      const opType = operationTypes[i];
      const typeName = typeNames[i];
      const item = options.format
        ? `${indent.repeat(nextIndent)}${opType}: ${typeName}`
        : `${opType}: ${typeName}`;
      items.push(item);
    }

    return items.join(options.format ? "\n" : " ");
  }

  // For other lists, generate a single item as placeholder
  // In a full implementation, we'd need to know how many items to generate
  const item = generateFromElement(
    grammar,
    list.element,
    indent,
    options,
    depth
  );

  if (item) {
    return item;
  }

  return "";
}

/**
 * Generate schema definition specifically
 * Parses the SchemaDefinition rule structure and generates the schema block
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
    // Skip optional Description
    if (element.kind === "Optional") {
      continue;
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
        // Parse RootOperationTypeDefinition to extract operation type and named type
        const rootOpRule = grammar.rules["RootOperationTypeDefinition"];
        if (rootOpRule && rootOpRule.definition.kind === "Sequence") {
          // Generate all three operation types (query, mutation, subscription)
          // by parsing the OperationType OneOf and generating each option
          const operationTypeRule = grammar.rules["OperationType"];
          if (operationTypeRule && operationTypeRule.definition.kind === "OneOf") {
            const oneOf = operationTypeRule.definition as OneOf;
            const operationTypes: string[] = [];

            // Extract operation type keywords from terminals
            for (const option of oneOf.options) {
              if (option.kind === "Terminal") {
                operationTypes.push(option.name);
              }
            }

            // For each operation type, generate a root operation type definition
            // Default type names: Query, Mutation, Subscription
            const typeNames = ["Query", "Mutation", "Subscription"];

            for (let i = 0; i < operationTypes.length; i++) {
              const opType = operationTypes[i];
              const typeName = typeNames[i] || "Type";
              
              // Track referenced types so we can generate them if missing
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

    // Handle BraceR - we'll add it at the end
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
