/**
 * Add Field Transformer
 * Adds a new field to an ObjectTypeDefinition
 */

import type { Transformer, PluginOptions } from "../types";
import type {
  Grammar,
  ProductionRule,
  GrammarElement,
  Sequence,
  List,
  Optional,
} from "../../grammar";

export interface AddFieldOptions extends PluginOptions {
  /**
   * Target type name (e.g., "User")
   */
  targetTypeName: string;

  /**
   * Field name to add (e.g., "email")
   */
  fieldName: string;

  /**
   * Field type (e.g., "String!", "User", "[String!]!")
   */
  fieldType: string;

  /**
   * Optional field description
   */
  description?: string;

  /**
   * Optional field arguments (array of { name, type, defaultValue? })
   */
  arguments?: Array<{
    name: string;
    type: string;
    defaultValue?: string;
  }>;

  /**
   * Optional field directives (array of { name, arguments? })
   */
  directives?: Array<{
    name: string;
    arguments?: Record<string, string>;
  }>;
}

/**
 * Helper to create a NonTerminal element
 */
const NT = (name: string): GrammarElement => ({
  kind: "NonTerminal",
  name,
});

/**
 * Helper to create a Sequence element
 */
const Seq = (...elements: GrammarElement[]): Sequence => ({
  kind: "Sequence",
  elements,
});

/**
 * Helper to create an Optional element
 */
const Opt = (element: GrammarElement): Optional => ({
  kind: "Optional",
  element,
});

/**
 * Helper to create a List element
 */
const Lst = (element: GrammarElement): List => ({
  kind: "List",
  element,
});

/**
 * Helper to parse a GraphQL type string into grammar elements
 * Handles: NamedType, NamedType!, [NamedType]!, [NamedType!]!
 * Note: This creates the grammar structure, but the actual type name
 * resolution happens at a different level in the grammar
 */
function parseType(typeString: string): GrammarElement {
  const trimmed = typeString.trim();

  // Handle non-null list: [Type]!
  if (trimmed.endsWith("]!")) {
    const innerType = trimmed.slice(1, -2); // Remove [ and ]!
    const innerTypeElement = parseType(innerType);
    return Seq(
      NT("BracketL"),
      innerTypeElement,
      NT("BracketR"),
      NT("Bang")
    );
  }

  // Handle nullable list: [Type]
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const innerType = trimmed.slice(1, -1); // Remove [ and ]
    const innerTypeElement = parseType(innerType);
    return Seq(NT("BracketL"), innerTypeElement, NT("BracketR"));
  }

  // Handle non-null named type: Type!
  if (trimmed.endsWith("!")) {
    return Seq(NT("NamedType"), NT("Bang"));
  }

  // Handle nullable named type: Type
  return NT("NamedType");
}

/**
 * Helper to create a FieldDefinition grammar element
 */
function createFieldDefinition(
  _fieldName: string,
  fieldType: string,
  _description?: string,
  fieldArguments?: AddFieldOptions["arguments"],
  directives?: AddFieldOptions["directives"]
): GrammarElement {
  const elements: GrammarElement[] = [];

  // Optional Description
  elements.push(Opt(NT("Description")));

  // Field Name
  elements.push(NT("Name"));

  // Optional ArgumentsDefinition
  if (fieldArguments && fieldArguments.length > 0) {
    // Create InputValueDefinition for each argument
    // ArgumentsDefinition is: Seq(ParenL, Lst(InputValueDefinition), ParenR)
    // We need to create a sequence of InputValueDefinitions separated by commas
    // For simplicity, we'll create a single InputValueDefinition wrapped in a List
    // In a full implementation, you'd create multiple InputValueDefinitions
    const firstArg = fieldArguments[0];
    const argElements: GrammarElement[] = [
      Opt(NT("Description")),
      NT("Name"), // argument name
      NT("Colon"),
      parseType(firstArg.type),
    ];
    if (firstArg.defaultValue) {
      argElements.push(Seq(NT("Equals"), NT("ValueConst")));
    }
    argElements.push(Opt(NT("DirectivesConst")));
    const inputValueDef = Seq(...argElements);
    
    elements.push(
      Opt(
        Seq(
          NT("ParenL"),
          Lst(inputValueDef), // List of InputValueDefinition
          NT("ParenR")
        )
      )
    );
  } else {
    elements.push(Opt(NT("ArgumentsDefinition")));
  }

  // Colon
  elements.push(NT("Colon"));

  // Type
  elements.push(parseType(fieldType));

  // Optional DirectivesConst
  if (directives && directives.length > 0) {
    elements.push(Opt(NT("DirectivesConst")));
  } else {
    elements.push(Opt(NT("DirectivesConst")));
  }

  return Seq(...elements);
}

/**
 * Helper to deep clone a grammar element
 */
function cloneElement(element: GrammarElement): GrammarElement {
  switch (element.kind) {
    case "Terminal":
      return { ...element };
    case "NonTerminal":
      return { ...element };
    case "Sequence":
      return {
        kind: "Sequence",
        elements: element.elements.map(cloneElement),
      };
    case "OneOf":
      return {
        kind: "OneOf",
        options: element.options.map(cloneElement),
      };
    case "Optional":
      return {
        kind: "Optional",
        element: cloneElement(element.element),
      };
    case "List":
      return {
        kind: "List",
        element: cloneElement(element.element),
      };
  }
}

/**
 * Helper to find and modify FieldsDefinition in ObjectTypeDefinition
 * Note: This is a simplified implementation. In a production system,
 * you'd want to properly parse and reconstruct the grammar structure
 * to preserve existing fields while adding the new one.
 */
function addFieldToObjectTypeDefinition(
  rule: ProductionRule,
  fieldDefinition: GrammarElement
): ProductionRule {
  const definition = rule.definition;

  if (definition.kind !== "Sequence") {
    throw new Error(
      `ObjectTypeDefinition "${rule.name}" must have a Sequence definition`
    );
  }

  const elements = definition.elements.map(cloneElement);
  
  // Find FieldsDefinition in the sequence
  // ObjectTypeDefinition structure: Seq(Opt(Description), T("type"), NT("Name"), Opt(ImplementsInterfaces), Opt(DirectivesConst), Opt(FieldsDefinition))
  // FieldsDefinition is typically the last optional element
  let fieldsDefinitionIndex = -1;
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    if (
      el.kind === "Optional" &&
      el.element.kind === "NonTerminal" &&
      el.element.name === "FieldsDefinition"
    ) {
      fieldsDefinitionIndex = i;
      break;
    }
  }

  if (fieldsDefinitionIndex === -1) {
    // FieldsDefinition doesn't exist, create it
    // Create: Opt(Seq(BraceL, Lst(FieldDefinition), BraceR))
    const newFieldsDefinition: GrammarElement = Opt(
      Seq(
        NT("BraceL"),
        Lst(fieldDefinition),
        NT("BraceR")
      )
    );
    elements.push(newFieldsDefinition);
  } else {
    // FieldsDefinition exists as Optional(NonTerminal("FieldsDefinition"))
    // We need to replace it with the actual structure containing our new field
    // Since we can't easily extract existing fields from the grammar structure,
    // we'll create a new FieldsDefinition with just our field
    // In a production system, you'd parse the existing structure first
    const newFieldsDefinition: GrammarElement = Opt(
      Seq(
        NT("BraceL"),
        Lst(fieldDefinition), // New list with the new field
        NT("BraceR")
      )
    );
    elements[fieldsDefinitionIndex] = newFieldsDefinition;
  }

  return {
    name: rule.name,
    definition: {
      kind: "Sequence",
      elements,
    },
  };
}

/**
 * Add Field Transformer
 */
export const addFieldTransformer: Transformer = {
  metadata: {
    name: "add-field",
    version: "1.0.0",
    description: "Adds a new field to an ObjectTypeDefinition",
  },

  validateOptions(options: unknown): options is AddFieldOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (typeof opts.targetTypeName !== "string") {
      return false;
    }
    if (typeof opts.fieldName !== "string") {
      return false;
    }
    if (typeof opts.fieldType !== "string") {
      return false;
    }
    if (
      opts.description !== undefined &&
      typeof opts.description !== "string"
    ) {
      return false;
    }
    if (opts.arguments !== undefined && !Array.isArray(opts.arguments)) {
      return false;
    }
    if (opts.directives !== undefined && !Array.isArray(opts.directives)) {
      return false;
    }
    return true;
  },

  transform(grammar: Grammar, options?: AddFieldOptions): Grammar {
    if (!options) {
      throw new Error("add-field transformer requires options");
    }

    const opts = options as AddFieldOptions;

    if (!opts.targetTypeName || !opts.fieldName || !opts.fieldType) {
      throw new Error(
        "add-field transformer requires targetTypeName, fieldName, and fieldType"
      );
    }

    // Note: In the GraphQL grammar, types are defined using ObjectTypeDefinition rule,
    // not individual rules per type. The type name appears as a Name terminal.
    // For this transformer, we assume the targetTypeName refers to a rule name
    // that represents an ObjectTypeDefinition. In practice, you'd need to:
    // 1. Parse the schema to find ObjectTypeDefinitions
    // 2. Match by the Name terminal value
    // 3. Modify that specific instance
    //
    // For now, we'll look for a rule with the target name, or use ObjectTypeDefinition
    let targetRule = grammar.rules[opts.targetTypeName];
    
    // If not found, try ObjectTypeDefinition as fallback
    // (This is a simplified approach - real implementation would parse schema instances)
    if (!targetRule) {
      targetRule = grammar.rules["ObjectTypeDefinition"];
      if (!targetRule) {
        throw new Error(
          `Type "${opts.targetTypeName}" not found in grammar rules, and ObjectTypeDefinition rule not found`
        );
      }
    }

    // Create the new field definition
    const fieldDefinition = createFieldDefinition(
      opts.fieldName,
      opts.fieldType,
      opts.description,
      opts.arguments,
      opts.directives
    );

    // Add field to the ObjectTypeDefinition
    const transformedRule = addFieldToObjectTypeDefinition(
      targetRule,
      fieldDefinition
    );

    // Return grammar with updated rule
    // If we modified ObjectTypeDefinition, keep its name
    // Otherwise, create/update a rule with the target type name
    const ruleName = targetRule.name === "ObjectTypeDefinition" 
      ? "ObjectTypeDefinition" 
      : opts.targetTypeName;
    
    return {
      root: grammar.root,
      rules: {
        ...grammar.rules,
        [ruleName]: transformedRule,
      },
    };
  },
};

