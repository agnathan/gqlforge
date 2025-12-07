/**
 * GraphQL Grammar Specification - September 2025 Edition
 * Implemented as a TypeScript Context-Free Grammar definition.
 */

// ==========================================
// 1. Type Definitions for the Grammar System
// ==========================================

export type SymbolName = string;

export type Terminal = {
  kind: "Terminal";
  name: string;
  pattern?: RegExp | string; // Regex for dynamic tokens, string for exact matches (keywords/punctuators)
};

export type NonTerminal = {
  kind: "NonTerminal";
  name: SymbolName;
};

export type Sequence = {
  kind: "Sequence";
  elements: GrammarElement[];
};

export type OneOf = {
  kind: "OneOf"; // Represents | (OR)
  options: GrammarElement[];
};

export type Optional = {
  kind: "Optional"; // Represents 'opt' subscript
  element: GrammarElement;
};

export type List = {
  kind: "List"; // Represents 'list' subscript (one or more)
  element: GrammarElement;
};

export type GrammarElement =
  | Terminal
  | NonTerminal
  | Sequence
  | OneOf
  | Optional
  | List;

export type ProductionRule = {
  name: SymbolName;
  definition: GrammarElement;
};

export type Grammar = {
  root: SymbolName;
  rules: Record<SymbolName, ProductionRule>;
};

// ==========================================
// 2. Helper Functions for Conciseness
// ==========================================

const T = (name: string, pattern?: string | RegExp): Terminal => ({
  kind: "Terminal",
  name,
  pattern,
});
const NT = (name: SymbolName): NonTerminal => ({ kind: "NonTerminal", name });
const Seq = (...elements: GrammarElement[]): Sequence => ({
  kind: "Sequence",
  elements,
});
const Or = (...options: GrammarElement[]): OneOf => ({ kind: "OneOf", options });
const Opt = (element: GrammarElement): Optional => ({
  kind: "Optional",
  element,
});
const Lst = (element: GrammarElement): List => ({ kind: "List", element });

// ==========================================
// 3. The GraphQL Grammar Definition
// ==========================================

export const GraphQLGrammar: Grammar = {
  root: "Document",
  rules: {
    // ------------------------------------------
    // C.1 & C.2 & C.3 Lexical Tokens (Terminals)
    // ------------------------------------------
    // Note: Ignored tokens (Whitespace, BOM, Comments, Commas) are usually handled
    // by the lexer before reaching the CFG, but are defined here for completeness.

    Name: {
      name: "Name",
      definition: T("Name", /[_A-Za-z][_0-9A-Za-z]*/),
    },
    IntValue: {
      name: "IntValue",
      definition: T("IntValue"), // Regex: /-?(0|[1-9][0-9]*)/
    },
    FloatValue: {
      name: "FloatValue",
      definition: T("FloatValue"),
    },
    StringValue: {
      name: "StringValue",
      definition: T("StringValue"), // Includes BlockString
    },
    BooleanValue: {
      name: "BooleanValue",
      definition: T("BooleanValue", /true|false/),
    },
    NullValue: {
      name: "NullValue",
      definition: T("NullValue", "null"),
    },

    // Punctuators
    Bang: {
      name: "Bang",
      definition: T("!"),
    },
    Dollar: {
      name: "Dollar",
      definition: T("$"),
    },
    Ampersand: {
      name: "Ampersand",
      definition: T("&"),
    },
    ParenL: {
      name: "ParenL",
      definition: T("("),
    },
    ParenR: {
      name: "ParenR",
      definition: T(")"),
    },
    Spread: {
      name: "Spread",
      definition: T("..."),
    },
    Colon: {
      name: "Colon",
      definition: T(":"),
    },
    Equals: {
      name: "Equals",
      definition: T("="),
    },
    At: {
      name: "At",
      definition: T("@"),
    },
    BracketL: {
      name: "BracketL",
      definition: T("["),
    },
    BracketR: {
      name: "BracketR",
      definition: T("]"),
    },
    BraceL: {
      name: "BraceL",
      definition: T("{"),
    },
    Pipe: {
      name: "Pipe",
      definition: T("|"),
    },
    BraceR: {
      name: "BraceR",
      definition: T("}"),
    },

    // ------------------------------------------
    // C.4 Document Syntax
    // ------------------------------------------

    Document: {
      name: "Document",
      definition: Lst(NT("Definition")),
    },

    Definition: {
      name: "Definition",
      definition: Or(
        NT("ExecutableDefinition"),
        NT("TypeSystemDefinitionOrExtension")
      ),
    },

    ExecutableDefinition: {
      name: "ExecutableDefinition",
      definition: Or(NT("OperationDefinition"), NT("FragmentDefinition")),
    },

    // 2.4 Operations
    OperationDefinition: {
      name: "OperationDefinition",
      definition: Or(
        // Explicit Operation
        Seq(
          Opt(NT("Description")),
          NT("OperationType"),
          Opt(NT("Name")),
          Opt(NT("VariablesDefinition")),
          Opt(NT("Directives")),
          NT("SelectionSet")
        ),
        // Shorthand Query (Implicit)
        NT("SelectionSet")
      ),
    },

    OperationType: {
      name: "OperationType",
      definition: Or(T("query"), T("mutation"), T("subscription")),
    },

    // 2.5 Selection Sets
    SelectionSet: {
      name: "SelectionSet",
      definition: Seq(NT("BraceL"), Lst(NT("Selection")), NT("BraceR")),
    },

    Selection: {
      name: "Selection",
      definition: Or(
        NT("Field"),
        NT("FragmentSpread"),
        NT("InlineFragment")
      ),
    },

    // 2.6 Fields
    Field: {
      name: "Field",
      definition: Seq(
        Opt(NT("Alias")),
        NT("Name"),
        Opt(NT("Arguments")),
        Opt(NT("Directives")),
        Opt(NT("SelectionSet"))
      ),
    },

    Alias: {
      name: "Alias",
      definition: Seq(NT("Name"), NT("Colon")),
    },

    // 2.7 Arguments
    Arguments: {
      name: "Arguments",
      definition: Seq(NT("ParenL"), Lst(NT("Argument")), NT("ParenR")),
    },

    Argument: {
      name: "Argument",
      definition: Seq(NT("Name"), NT("Colon"), NT("Value")),
    },

    ArgumentsConst: {
      name: "ArgumentsConst",
      definition: Seq(NT("ParenL"), Lst(NT("ArgumentConst")), NT("ParenR")),
    },

    ArgumentConst: {
      name: "ArgumentConst",
      definition: Seq(NT("Name"), NT("Colon"), NT("ValueConst")),
    },

    // 2.9 Fragments
    FragmentSpread: {
      name: "FragmentSpread",
      definition: Seq(NT("Spread"), NT("FragmentName"), Opt(NT("Directives"))),
    },

    InlineFragment: {
      name: "InlineFragment",
      definition: Seq(
        NT("Spread"),
        Opt(NT("TypeCondition")),
        Opt(NT("Directives")),
        NT("SelectionSet")
      ),
    },

    FragmentDefinition: {
      name: "FragmentDefinition",
      definition: Seq(
        Opt(NT("Description")),
        T("fragment"),
        NT("FragmentName"),
        NT("TypeCondition"),
        Opt(NT("Directives")),
        NT("SelectionSet")
      ),
    },

    FragmentName: {
      name: "FragmentName",
      definition: Seq(NT("Name")), // But not 'on'
    },

    TypeCondition: {
      name: "TypeCondition",
      definition: Seq(T("on"), NT("NamedType")),
    },

    // 2.10 Input Values
    Value: {
      name: "Value",
      definition: Or(
        NT("Variable"),
        NT("IntValue"),
        NT("FloatValue"),
        NT("StringValue"),
        NT("BooleanValue"),
        NT("NullValue"),
        NT("EnumValue"),
        NT("ListValue"),
        NT("ObjectValue")
      ),
    },

    ValueConst: {
      name: "ValueConst",
      definition: Or(
        NT("IntValue"),
        NT("FloatValue"),
        NT("StringValue"),
        NT("BooleanValue"),
        NT("NullValue"),
        NT("EnumValue"),
        NT("ListValueConst"),
        NT("ObjectValueConst")
      ),
    },

    EnumValue: {
      name: "EnumValue",
      definition: NT("Name"), // But not true, false, or null
    },

    ListValue: {
      name: "ListValue",
      definition: Or(
        Seq(NT("BracketL"), NT("BracketR")),
        Seq(NT("BracketL"), Lst(NT("Value")), NT("BracketR"))
      ),
    },

    ListValueConst: {
      name: "ListValueConst",
      definition: Or(
        Seq(NT("BracketL"), NT("BracketR")),
        Seq(NT("BracketL"), Lst(NT("ValueConst")), NT("BracketR"))
      ),
    },

    ObjectValue: {
      name: "ObjectValue",
      definition: Or(
        Seq(NT("BraceL"), NT("BraceR")),
        Seq(NT("BraceL"), Lst(NT("ObjectField")), NT("BraceR"))
      ),
    },

    ObjectValueConst: {
      name: "ObjectValueConst",
      definition: Or(
        Seq(NT("BraceL"), NT("BraceR")),
        Seq(NT("BraceL"), Lst(NT("ObjectFieldConst")), NT("BraceR"))
      ),
    },

    ObjectField: {
      name: "ObjectField",
      definition: Seq(NT("Name"), NT("Colon"), NT("Value")),
    },

    ObjectFieldConst: {
      name: "ObjectFieldConst",
      definition: Seq(NT("Name"), NT("Colon"), NT("ValueConst")),
    },

    // 2.11 Variables
    VariablesDefinition: {
      name: "VariablesDefinition",
      definition: Seq(NT("ParenL"), Lst(NT("VariableDefinition")), NT("ParenR")),
    },

    VariableDefinition: {
      name: "VariableDefinition",
      definition: Seq(
        Opt(NT("Description")),
        NT("Variable"),
        NT("Colon"),
        NT("Type"),
        Opt(NT("DefaultValue")),
        Opt(NT("DirectivesConst"))
      ),
    },

    Variable: {
      name: "Variable",
      definition: Seq(NT("Dollar"), NT("Name")),
    },

    DefaultValue: {
      name: "DefaultValue",
      definition: Seq(NT("Equals"), NT("ValueConst")),
    },

    // 2.12 Type References
    Type: {
      name: "Type",
      definition: Or(NT("NamedType"), NT("ListType"), NT("NonNullType")),
    },

    NamedType: {
      name: "NamedType",
      definition: NT("Name"),
    },

    ListType: {
      name: "ListType",
      definition: Seq(NT("BracketL"), NT("Type"), NT("BracketR")),
    },

    NonNullType: {
      name: "NonNullType",
      definition: Or(
        Seq(NT("NamedType"), NT("Bang")),
        Seq(NT("ListType"), NT("Bang"))
      ),
    },

    // 2.13 Directives
    Directives: {
      name: "Directives",
      definition: Lst(NT("Directive")),
    },

    Directive: {
      name: "Directive",
      definition: Seq(NT("At"), NT("Name"), Opt(NT("Arguments"))),
    },

    DirectivesConst: {
      name: "DirectivesConst",
      definition: Lst(NT("DirectiveConst")),
    },

    DirectiveConst: {
      name: "DirectiveConst",
      definition: Seq(NT("At"), NT("Name"), Opt(NT("ArgumentsConst"))),
    },

    // ------------------------------------------
    // 3. Type System
    // ------------------------------------------

    TypeSystemDefinitionOrExtension: {
      name: "TypeSystemDefinitionOrExtension",
      definition: Or(NT("TypeSystemDefinition"), NT("TypeSystemExtension")),
    },

    TypeSystemDefinition: {
      name: "TypeSystemDefinition",
      definition: Or(
        NT("SchemaDefinition"),
        NT("TypeDefinition"),
        NT("DirectiveDefinition")
      ),
    },

    TypeSystemExtension: {
      name: "TypeSystemExtension",
      definition: Or(NT("SchemaExtension"), NT("TypeExtension")),
    },

    // 3.2 Description
    Description: {
      name: "Description",
      definition: NT("StringValue"),
    },

    // 3.3 Schema
    SchemaDefinition: {
      name: "SchemaDefinition",
      definition: Seq(
        Opt(NT("Description")),
        T("schema"),
        Opt(NT("DirectivesConst")),
        NT("BraceL"),
        Lst(NT("RootOperationTypeDefinition")),
        NT("BraceR")
      ),
    },

    RootOperationTypeDefinition: {
      name: "RootOperationTypeDefinition",
      definition: Seq(NT("OperationType"), NT("Colon"), NT("NamedType")),
    },

    SchemaExtension: {
      name: "SchemaExtension",
      definition: Seq(
        T("extend"),
        T("schema"),
        Opt(NT("DirectivesConst")),
        Opt(
          Seq(
            NT("BraceL"),
            Lst(NT("RootOperationTypeDefinition")),
            NT("BraceR")
          )
        )
      ),
    },

    // 3.4 Types
    TypeDefinition: {
      name: "TypeDefinition",
      definition: Or(
        NT("ScalarTypeDefinition"),
        NT("ObjectTypeDefinition"),
        NT("InterfaceTypeDefinition"),
        NT("UnionTypeDefinition"),
        NT("EnumTypeDefinition"),
        NT("InputObjectTypeDefinition")
      ),
    },

    TypeExtension: {
      name: "TypeExtension",
      definition: Or(
        NT("ScalarTypeExtension"),
        NT("ObjectTypeExtension"),
        NT("InterfaceTypeExtension"),
        NT("UnionTypeExtension"),
        NT("EnumTypeExtension"),
        NT("InputObjectTypeExtension")
      ),
    },

    // 3.5 Scalars
    ScalarTypeDefinition: {
      name: "ScalarTypeDefinition",
      definition: Seq(
        Opt(NT("Description")),
        T("scalar"),
        NT("Name"),
        Opt(NT("DirectivesConst"))
      ),
    },

    ScalarTypeExtension: {
      name: "ScalarTypeExtension",
      definition: Seq(
        T("extend"),
        T("scalar"),
        NT("Name"),
        NT("DirectivesConst")
      ),
    },

    // 3.6 Objects
    ObjectTypeDefinition: {
      name: "ObjectTypeDefinition",
      definition: Seq(
        Opt(NT("Description")),
        T("type"),
        NT("Name"),
        Opt(NT("ImplementsInterfaces")),
        Opt(NT("DirectivesConst")),
        Opt(NT("FieldsDefinition"))
      ),
    },

    ImplementsInterfaces: {
      name: "ImplementsInterfaces",
      definition: Seq(
        T("implements"),
        Opt(NT("Ampersand")),
        NT("NamedType"),
        // Repeated
        Opt(Lst(Seq(NT("Ampersand"), NT("NamedType"))))
      ),
    },

    FieldsDefinition: {
      name: "FieldsDefinition",
      definition: Seq(NT("BraceL"), Lst(NT("FieldDefinition")), NT("BraceR")),
    },

    FieldDefinition: {
      name: "FieldDefinition",
      definition: Seq(
        Opt(NT("Description")),
        NT("Name"),
        Opt(NT("ArgumentsDefinition")),
        NT("Colon"),
        NT("Type"),
        Opt(NT("DirectivesConst"))
      ),
    },

    ArgumentsDefinition: {
      name: "ArgumentsDefinition",
      definition: Seq(
        NT("ParenL"),
        Lst(NT("InputValueDefinition")),
        NT("ParenR")
      ),
    },

    InputValueDefinition: {
      name: "InputValueDefinition",
      definition: Seq(
        Opt(NT("Description")),
        NT("Name"),
        NT("Colon"),
        NT("Type"),
        Opt(NT("DefaultValue")),
        Opt(NT("DirectivesConst"))
      ),
    },

    ObjectTypeExtension: {
      name: "ObjectTypeExtension",
      definition: Or(
        // extend type Name Implements? Directives? Fields
        Seq(
          T("extend"),
          T("type"),
          NT("Name"),
          Opt(NT("ImplementsInterfaces")),
          Opt(NT("DirectivesConst")),
          NT("FieldsDefinition")
        ),
        // extend type Name Implements? Directives
        Seq(
          T("extend"),
          T("type"),
          NT("Name"),
          Opt(NT("ImplementsInterfaces")),
          NT("DirectivesConst")
        ),
        // extend type Name Implements
        Seq(
          T("extend"),
          T("type"),
          NT("Name"),
          NT("ImplementsInterfaces")
        )
      ),
    },

    // 3.7 Interfaces
    InterfaceTypeDefinition: {
      name: "InterfaceTypeDefinition",
      definition: Seq(
        Opt(NT("Description")),
        T("interface"),
        NT("Name"),
        Opt(NT("ImplementsInterfaces")),
        Opt(NT("DirectivesConst")),
        Opt(NT("FieldsDefinition"))
      ),
    },

    InterfaceTypeExtension: {
      name: "InterfaceTypeExtension",
      definition: Or(
        Seq(
          T("extend"),
          T("interface"),
          NT("Name"),
          Opt(NT("ImplementsInterfaces")),
          Opt(NT("DirectivesConst")),
          NT("FieldsDefinition")
        ),
        Seq(
          T("extend"),
          T("interface"),
          NT("Name"),
          Opt(NT("ImplementsInterfaces")),
          NT("DirectivesConst")
        ),
        Seq(
          T("extend"),
          T("interface"),
          NT("Name"),
          NT("ImplementsInterfaces")
        )
      ),
    },

    // 3.8 Unions
    UnionTypeDefinition: {
      name: "UnionTypeDefinition",
      definition: Seq(
        Opt(NT("Description")),
        T("union"),
        NT("Name"),
        Opt(NT("DirectivesConst")),
        Opt(NT("UnionMemberTypes"))
      ),
    },

    UnionMemberTypes: {
      name: "UnionMemberTypes",
      definition: Seq(
        NT("Equals"),
        Opt(NT("Pipe")),
        NT("NamedType"),
        Opt(Lst(Seq(NT("Pipe"), NT("NamedType"))))
      ),
    },

    UnionTypeExtension: {
      name: "UnionTypeExtension",
      definition: Or(
        Seq(
          T("extend"),
          T("union"),
          NT("Name"),
          Opt(NT("DirectivesConst")),
          NT("UnionMemberTypes")
        ),
        Seq(
          T("extend"),
          T("union"),
          NT("Name"),
          NT("DirectivesConst")
        )
      ),
    },

    // 3.9 Enums
    EnumTypeDefinition: {
      name: "EnumTypeDefinition",
      definition: Seq(
        Opt(NT("Description")),
        T("enum"),
        NT("Name"),
        Opt(NT("DirectivesConst")),
        Opt(NT("EnumValuesDefinition"))
      ),
    },

    EnumValuesDefinition: {
      name: "EnumValuesDefinition",
      definition: Seq(NT("BraceL"), Lst(NT("EnumValueDefinition")), NT("BraceR")),
    },

    EnumValueDefinition: {
      name: "EnumValueDefinition",
      definition: Seq(
        Opt(NT("Description")),
        NT("EnumValue"),
        Opt(NT("DirectivesConst"))
      ),
    },

    EnumTypeExtension: {
      name: "EnumTypeExtension",
      definition: Or(
        Seq(
          T("extend"),
          T("enum"),
          NT("Name"),
          Opt(NT("DirectivesConst")),
          NT("EnumValuesDefinition")
        ),
        Seq(
          T("extend"),
          T("enum"),
          NT("Name"),
          NT("DirectivesConst")
        )
      ),
    },

    // 3.10 Input Objects
    InputObjectTypeDefinition: {
      name: "InputObjectTypeDefinition",
      definition: Seq(
        Opt(NT("Description")),
        T("input"),
        NT("Name"),
        Opt(NT("DirectivesConst")),
        Opt(NT("InputFieldsDefinition"))
      ),
    },

    InputFieldsDefinition: {
      name: "InputFieldsDefinition",
      definition: Seq(
        NT("BraceL"),
        Lst(NT("InputValueDefinition")),
        NT("BraceR")
      ),
    },

    InputObjectTypeExtension: {
      name: "InputObjectTypeExtension",
      definition: Or(
        Seq(
          T("extend"),
          T("input"),
          NT("Name"),
          Opt(NT("DirectivesConst")),
          NT("InputFieldsDefinition")
        ),
        Seq(
          T("extend"),
          T("input"),
          NT("Name"),
          NT("DirectivesConst")
        )
      ),
    },

    // 3.13 Directives
    DirectiveDefinition: {
      name: "DirectiveDefinition",
      definition: Seq(
        Opt(NT("Description")),
        T("directive"),
        T("@"),
        NT("Name"),
        Opt(NT("ArgumentsDefinition")),
        Opt(T("repeatable")),
        T("on"),
        NT("DirectiveLocations")
      ),
    },

    DirectiveLocations: {
      name: "DirectiveLocations",
      definition: Seq(
        Opt(NT("Pipe")),
        NT("DirectiveLocation"),
        Opt(Lst(Seq(NT("Pipe"), NT("DirectiveLocation"))))
      ),
    },

    DirectiveLocation: {
      name: "DirectiveLocation",
      definition: Or(
        NT("ExecutableDirectiveLocation"),
        NT("TypeSystemDirectiveLocation")
      ),
    },

    ExecutableDirectiveLocation: {
      name: "ExecutableDirectiveLocation",
      definition: Or(
        T("QUERY"),
        T("MUTATION"),
        T("SUBSCRIPTION"),
        T("FIELD"),
        T("FRAGMENT_DEFINITION"),
        T("FRAGMENT_SPREAD"),
        T("INLINE_FRAGMENT"),
        T("VARIABLE_DEFINITION")
      ),
    },

    TypeSystemDirectiveLocation: {
      name: "TypeSystemDirectiveLocation",
      definition: Or(
        T("SCHEMA"),
        T("SCALAR"),
        T("OBJECT"),
        T("FIELD_DEFINITION"),
        T("ARGUMENT_DEFINITION"),
        T("INTERFACE"),
        T("UNION"),
        T("ENUM"),
        T("ENUM_VALUE"),
        T("INPUT_OBJECT"),
        T("INPUT_FIELD_DEFINITION")
      ),
    },
  },
};

