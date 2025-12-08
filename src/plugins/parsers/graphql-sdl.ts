/**
 * GraphQL SDL Parser
 * Parses GraphQL Schema Definition Language into Zod GraphQL Grammar
 * 
 * Implementation follows the Grammar structure in src/grammar.ts as a specification.
 * The parser builds only the Grammar rules that are actually used in the parsed schema.
 */

import type { Parser, PluginOptions } from "../types";
import type { Grammar, GrammarElement, Terminal, NonTerminal, Sequence, List, Optional, OneOf, ProductionRule } from "../../grammar";

export interface GraphQLSDLParserOptions extends PluginOptions {
  /**
   * Strict mode - throw on parsing errors
   */
  strict?: boolean;
  
  /**
   * Include comments/descriptions
   */
  preserveComments?: boolean;
  
  /**
   * Validate parsed grammar
   */
  validate?: boolean;
}

/**
 * GraphQL SDL parser plugin
 * 
 * Note: This is a placeholder implementation. A full implementation would
 * require a complete GraphQL SDL parser that converts the text into
 * the grammar structure.
 */
export const graphqlSDLParser: Parser<string> = {
  metadata: {
    name: "graphql-sdl",
    version: "1.0.0",
    description: "Parses GraphQL Schema Definition Language into Zod GraphQL Grammar",
  },

  validateOptions(options: unknown): options is GraphQLSDLParserOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (opts.strict !== undefined && typeof opts.strict !== "boolean") {
      return false;
    }
    if (
      opts.preserveComments !== undefined &&
      typeof opts.preserveComments !== "boolean"
    ) {
      return false;
    }
    if (opts.validate !== undefined && typeof opts.validate !== "boolean") {
      return false;
    }
    return true;
  },

  getInputFormat(): string {
    return "graphql";
  },

  parse(sdl: string, options?: GraphQLSDLParserOptions): Grammar {
    const opts: GraphQLSDLParserOptions = {
      strict: true,
      preserveComments: true,
      validate: true,
      ...options,
    };

    if (opts.strict && !sdl.trim()) {
      throw new Error("Empty GraphQL SDL input");
    }

    // Tokenize the SDL string
    const lexer = new Lexer(sdl, opts);
    const tokens = lexer.tokenize();

    // Parse tokens into Grammar structure
    const parser = new ParserImpl(tokens, opts);
    const grammar = parser.parse();

    return grammar;
  },
};

// ==========================================
// Lexer (Tokenizer)
// ==========================================

type TokenType =
  | "Name"
  | "StringValue"
  | "IntValue"
  | "FloatValue"
  | "BooleanValue"
  | "NullValue"
  | "Keyword" // type, scalar, enum, etc.
  | "Punctuator" // {, }, (, ), :, @, etc.
  | "EOF";

interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private options: GraphQLSDLParserOptions;

  // GraphQL keywords
  private keywords = new Set([
    "type",
    "scalar",
    "enum",
    "interface",
    "union",
    "input",
    "extend",
    "implements",
    "schema",
    "directive",
    "query",
    "mutation",
    "subscription",
    "on",
    "true",
    "false",
    "null",
  ]);

  // Name pattern: [_A-Za-z][_0-9A-Za-z]*
  private namePattern = /^[_A-Za-z][_0-9A-Za-z]*/;

  constructor(input: string, options: GraphQLSDLParserOptions) {
    this.input = input;
    this.options = options;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      this.skipWhitespace();
      if (this.position >= this.input.length) break;

      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }

    tokens.push({
      type: "EOF",
      value: "",
      line: this.line,
      column: this.column,
    });

    return tokens;
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length) {
      const char = this.input[this.position];

      if (char === "\n") {
        this.line++;
        this.column = 1;
        this.position++;
      } else if (char === "\r") {
        this.position++;
        if (this.position < this.input.length && this.input[this.position] === "\n") {
          this.line++;
          this.column = 1;
          this.position++;
        } else {
          this.column = 1;
        }
      } else if (char === " " || char === "\t" || char === ",") {
        this.column++;
        this.position++;
      } else if (char === "#") {
        // Comment - skip until end of line
        while (this.position < this.input.length && this.input[this.position] !== "\n") {
          this.position++;
        }
      } else {
        break;
      }
    }
  }

  private nextToken(): Token | null {
    const startPos = this.position;
    const startLine = this.line;
    const startCol = this.column;
    const char = this.input[this.position];

    // String value
    if (char === '"') {
      return this.readString(startLine, startCol);
    }

    // Punctuators
    const punctuators: Record<string, string> = {
      "!": "!",
      "$": "$",
      "&": "&",
      "(": "(",
      ")": ")",
      ":": ":",
      "=": "=",
      "@": "@",
      "[": "[",
      "]": "]",
      "{": "{",
      "}": "}",
      "|": "|",
    };

    if (char in punctuators) {
      // Check for multi-character punctuators
      if (char === "." && this.position + 2 < this.input.length) {
        const threeChars = this.input.substring(this.position, this.position + 3);
        if (threeChars === "...") {
          this.position += 3;
          this.column += 3;
          return {
            type: "Punctuator",
            value: "...",
            line: startLine,
            column: startCol,
          };
        }
      }

      this.position++;
      this.column++;
      return {
        type: "Punctuator",
        value: char,
        line: startLine,
        column: startCol,
      };
    }

    // Name or keyword
    const nameMatch = this.input.substring(this.position).match(this.namePattern);
    if (nameMatch) {
      const value = nameMatch[0];
      this.position += value.length;
      this.column += value.length;

      // Check if it's a keyword
      if (this.keywords.has(value)) {
        return {
          type: "Keyword",
          value,
          line: startLine,
          column: startCol,
        };
      }

      // Validate Name token pattern (for strict mode)
      if (this.options.strict) {
        if (!/^[_A-Za-z][_0-9A-Za-z]*$/.test(value)) {
          throw new Error(
            `Invalid Name token at line ${startLine}, column ${startCol}: "${value}". Name must match pattern [_A-Za-z][_0-9A-Za-z]*`
          );
        }
        if (/^[0-9]/.test(value)) {
          throw new Error(
            `Invalid Name token at line ${startLine}, column ${startCol}: "${value}". Name cannot start with a number.`
          );
        }
      }

      return {
        type: "Name",
        value,
        line: startLine,
        column: startCol,
      };
    }

    // Unknown character
    if (this.options.strict) {
      throw new Error(
        `Unexpected character at line ${startLine}, column ${startCol}: "${char}"`
      );
    }

    return null;
  }

  private readString(startLine: number, startCol: number): Token {
    this.position++; // Skip opening quote
    this.column++;
    let value = "";
    let escaped = false;

    while (this.position < this.input.length) {
      const char = this.input[this.position];

      if (escaped) {
        value += char;
        escaped = false;
        this.position++;
        this.column++;
      } else if (char === "\\") {
        escaped = true;
        this.position++;
        this.column++;
      } else if (char === '"') {
        this.position++; // Skip closing quote
        this.column++;
        break;
      } else if (char === "\n") {
        throw new Error(`Unterminated string at line ${startLine}, column ${startCol}`);
      } else {
        value += char;
        this.position++;
        this.column++;
      }
    }

    return {
      type: "StringValue",
      value: `"${value}"`,
      line: startLine,
      column: startCol,
    };
  }
}

// ==========================================
// Parser
// ==========================================

class ParserImpl {
  private tokens: Token[];
  private position: number = 0;
  private options: GraphQLSDLParserOptions;
  private grammarBuilder: GrammarBuilder;
  private encounteredTypeDefinitions: Set<string> = new Set();

  constructor(tokens: Token[], options: GraphQLSDLParserOptions) {
    this.tokens = tokens;
    this.options = options;
    this.grammarBuilder = new GrammarBuilder();
  }

  parse(): Grammar {
    // Always include Document and Name rules
    this.grammarBuilder.addNameRule();

    // Build Document rule first
    this.grammarBuilder.addRule("Document", {
      kind: "List",
      element: { kind: "NonTerminal", name: "Definition" },
    });

    // Build Definition rule
    this.grammarBuilder.addRule("Definition", {
      kind: "NonTerminal",
      name: "TypeSystemDefinition",
    });

    this.grammarBuilder.addRule("TypeSystemDefinition", {
      kind: "NonTerminal",
      name: "TypeDefinition",
    });

    // Parse all definitions
    while (!this.isEOF() && this.peek()?.type !== "EOF") {
      const definition = this.parseDefinition();
      if (!definition) {
        // Skip unknown tokens
        if (this.peek()?.type === "EOF") break;
        this.consume();
      }
    }

    // Build TypeDefinition as OneOf of all encountered types
    if (this.encounteredTypeDefinitions.size > 0) {
      const options: GrammarElement[] = Array.from(this.encounteredTypeDefinitions).map(
        (name) => ({ kind: "NonTerminal", name })
      );
      this.grammarBuilder.addRule("TypeDefinition", {
        kind: "OneOf",
        options,
      });
    }

    return this.grammarBuilder.build();
  }

  private parseDefinition(): GrammarElement | null {
    return this.parseTypeSystemDefinition();
  }

  private parseTypeSystemDefinition(): GrammarElement | null {
    return this.parseTypeDefinition();
  }

  private parseTypeDefinition(): GrammarElement | null {
    const token = this.peek();
    if (!token || token.type === "EOF") return null;

    if (token.type === "Keyword") {
      switch (token.value) {
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        default:
          return null;
      }
    }

    return null;
  }

  private parseScalarTypeDefinition(): GrammarElement {
    // ScalarTypeDefinition: Seq(Opt(Description), T("scalar"), NT("Name"), Opt(DirectivesConst))
    const elements: GrammarElement[] = [];

    // Optional Description
    if (this.peek()?.type === "StringValue") {
      const desc = this.parseDescription();
      if (desc) elements.push(desc);
    }

    // "scalar" keyword
    this.expectKeyword("scalar");
    elements.push({ kind: "Terminal", name: "scalar" });
    this.grammarBuilder.addRule("scalar", { name: "scalar", definition: { kind: "Terminal", name: "scalar" } });

    // Name
    const nameToken = this.expectToken("Name");
    elements.push({ kind: "NonTerminal", name: "Name" });

    // Optional DirectivesConst
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directives = this.parseDirectivesConst();
      if (directives) elements.push(directives);
    }

    // Build rule
    this.grammarBuilder.addRule("ScalarTypeDefinition", {
      kind: "Sequence",
      elements,
    });

    this.encounteredTypeDefinitions.add("ScalarTypeDefinition");

    return { kind: "NonTerminal", name: "ScalarTypeDefinition" };
  }

  private parseObjectTypeDefinition(): GrammarElement {
    // ObjectTypeDefinition: Seq(Opt(Description), T("type"), NT("Name"), Opt(ImplementsInterfaces), Opt(DirectivesConst), Opt(FieldsDefinition))
    const elements: GrammarElement[] = [];

    // Optional Description
    if (this.peek()?.type === "StringValue") {
      const desc = this.parseDescription();
      if (desc) elements.push(desc);
    }

    // "type" keyword
    this.expectKeyword("type");
    elements.push({ kind: "Terminal", name: "type" });
    this.grammarBuilder.addRule("type", { name: "type", definition: { kind: "Terminal", name: "type" } });

    // Name
    this.expectToken("Name");
    elements.push({ kind: "NonTerminal", name: "Name" });

    // Optional ImplementsInterfaces
    if (this.peek()?.type === "Keyword" && this.peek()?.value === "implements") {
      const impl = this.parseImplementsInterfaces();
      if (impl) elements.push(impl);
    }

    // Optional DirectivesConst
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directives = this.parseDirectivesConst();
      if (directives) elements.push(directives);
    }

    // Optional FieldsDefinition
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "{") {
      const fields = this.parseFieldsDefinition();
      if (fields) elements.push(fields);
    }

    // Build rule
    this.grammarBuilder.addRule("ObjectTypeDefinition", {
      kind: "Sequence",
      elements,
    });

    this.encounteredTypeDefinitions.add("ObjectTypeDefinition");

    return { kind: "NonTerminal", name: "ObjectTypeDefinition" };
  }

  private parseEnumTypeDefinition(): GrammarElement {
    // EnumTypeDefinition: Seq(Opt(Description), T("enum"), NT("Name"), Opt(DirectivesConst), Opt(EnumValuesDefinition))
    const elements: GrammarElement[] = [];

    // Optional Description
    if (this.peek()?.type === "StringValue") {
      const desc = this.parseDescription();
      if (desc) elements.push(desc);
    }

    // "enum" keyword
    this.expectKeyword("enum");
    elements.push({ kind: "Terminal", name: "enum" });
    this.grammarBuilder.addRule("enum", { name: "enum", definition: { kind: "Terminal", name: "enum" } });

    // Name
    this.expectToken("Name");
    elements.push({ kind: "NonTerminal", name: "Name" });

    // Optional DirectivesConst
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directives = this.parseDirectivesConst();
      if (directives) elements.push(directives);
    }

    // Optional EnumValuesDefinition
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "{") {
      const enumValues = this.parseEnumValuesDefinition();
      if (enumValues) elements.push(enumValues);
    }

    // Build rule
    this.grammarBuilder.addRule("EnumTypeDefinition", {
      kind: "Sequence",
      elements,
    });

    this.encounteredTypeDefinitions.add("EnumTypeDefinition");

    return { kind: "NonTerminal", name: "EnumTypeDefinition" };
  }

  private parseInterfaceTypeDefinition(): GrammarElement {
    // InterfaceTypeDefinition: Seq(Opt(Description), T("interface"), NT("Name"), Opt(ImplementsInterfaces), Opt(DirectivesConst), Opt(FieldsDefinition))
    const elements: GrammarElement[] = [];

    if (this.peek()?.type === "StringValue") {
      const desc = this.parseDescription();
      if (desc) elements.push(desc);
    }

    this.expectKeyword("interface");
    elements.push({ kind: "Terminal", name: "interface" });
    this.grammarBuilder.addRule("interface", { name: "interface", definition: { kind: "Terminal", name: "interface" } });
    this.expectToken("Name");
    elements.push({ kind: "NonTerminal", name: "Name" });

    if (this.peek()?.type === "Keyword" && this.peek()?.value === "implements") {
      const impl = this.parseImplementsInterfaces();
      if (impl) elements.push(impl);
    }

    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directives = this.parseDirectivesConst();
      if (directives) elements.push(directives);
    }

    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "{") {
      const fields = this.parseFieldsDefinition();
      if (fields) elements.push(fields);
    }

    this.grammarBuilder.addRule("InterfaceTypeDefinition", {
      kind: "Sequence",
      elements,
    });

    this.encounteredTypeDefinitions.add("InterfaceTypeDefinition");

    return { kind: "NonTerminal", name: "InterfaceTypeDefinition" };
  }

  private parseUnionTypeDefinition(): GrammarElement {
    // UnionTypeDefinition: Seq(Opt(Description), T("union"), NT("Name"), Opt(DirectivesConst), Opt(UnionMemberTypes))
    const elements: GrammarElement[] = [];

    if (this.peek()?.type === "StringValue") {
      const desc = this.parseDescription();
      if (desc) elements.push(desc);
    }

    this.expectKeyword("union");
    elements.push({ kind: "Terminal", name: "union" });
    this.grammarBuilder.addRule("union", { name: "union", definition: { kind: "Terminal", name: "union" } });
    this.expectToken("Name");
    elements.push({ kind: "NonTerminal", name: "Name" });

    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directives = this.parseDirectivesConst();
      if (directives) elements.push(directives);
    }

    this.grammarBuilder.addRule("UnionTypeDefinition", {
      kind: "Sequence",
      elements,
    });

    this.encounteredTypeDefinitions.add("UnionTypeDefinition");

    return { kind: "NonTerminal", name: "UnionTypeDefinition" };
  }

  private parseInputObjectTypeDefinition(): GrammarElement {
    // InputObjectTypeDefinition: Seq(Opt(Description), T("input"), NT("Name"), Opt(DirectivesConst), Opt(InputFieldsDefinition))
    const elements: GrammarElement[] = [];

    if (this.peek()?.type === "StringValue") {
      const desc = this.parseDescription();
      if (desc) elements.push(desc);
    }

    this.expectKeyword("input");
    elements.push({ kind: "Terminal", name: "input" });
    this.grammarBuilder.addRule("input", { name: "input", definition: { kind: "Terminal", name: "input" } });
    this.expectToken("Name");
    elements.push({ kind: "NonTerminal", name: "Name" });

    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directives = this.parseDirectivesConst();
      if (directives) elements.push(directives);
    }

    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "{") {
      const fields = this.parseInputFieldsDefinition();
      if (fields) elements.push(fields);
    }

    this.grammarBuilder.addRule("InputObjectTypeDefinition", {
      kind: "Sequence",
      elements,
    });

    this.encounteredTypeDefinitions.add("InputObjectTypeDefinition");

    return { kind: "NonTerminal", name: "InputObjectTypeDefinition" };
  }

  private parseDescription(): GrammarElement | null {
    if (this.peek()?.type === "StringValue") {
      this.consume();
      this.grammarBuilder.addRule("Description", {
        kind: "NonTerminal",
        name: "StringValue",
      });
      return { kind: "Optional", element: { kind: "NonTerminal", name: "Description" } };
    }
    return null;
  }

  private parseImplementsInterfaces(): GrammarElement | null {
    if (this.peek()?.type === "Keyword" && this.peek()?.value === "implements") {
      this.consume(); // "implements"
      const elements: GrammarElement[] = [];

      // First interface
      this.expectToken("Name");
      elements.push({ kind: "NonTerminal", name: "NamedType" });

      // Additional interfaces with &
      while (this.peek()?.type === "Punctuator" && this.peek()?.value === "&") {
        this.consume(); // "&"
        this.expectToken("Name");
        elements.push({ kind: "NonTerminal", name: "NamedType" });
      }

      this.grammarBuilder.addRule("ImplementsInterfaces", {
        kind: "Sequence",
        elements: [
          { kind: "Terminal", name: "implements" },
          ...elements,
        ],
      });

      this.grammarBuilder.addRule("NamedType", {
        kind: "NonTerminal",
        name: "Name",
      });

      return { kind: "NonTerminal", name: "ImplementsInterfaces" };
    }
    return null;
  }

  private parseDirectivesConst(): GrammarElement | null {
    const directives: GrammarElement[] = [];

    while (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directive = this.parseDirectiveConst();
      if (directive) {
        directives.push(directive);
      }
    }

    if (directives.length === 0) return null;

    this.grammarBuilder.addRule("DirectivesConst", {
      kind: "List",
      element: { kind: "NonTerminal", name: "DirectiveConst" },
    });

    return { kind: "NonTerminal", name: "DirectivesConst" };
  }

  private parseDirectiveConst(): GrammarElement | null {
    // DirectiveConst: Seq(At, Name, Opt(ArgumentsConst))
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      this.consume(); // "@"

      this.expectToken("Name");
      const nameEl: GrammarElement = { kind: "NonTerminal", name: "Name" };

      // Optional ArgumentsConst
      let argsEl: GrammarElement | null = null;
      if (this.peek()?.type === "Punctuator" && this.peek()?.value === "(") {
        argsEl = this.parseArgumentsConst();
      }

      const elements: GrammarElement[] = [
        { kind: "Terminal", name: "@" },
        nameEl,
      ];
      if (argsEl) elements.push(argsEl);

      this.grammarBuilder.addRule("DirectiveConst", {
        kind: "Sequence",
        elements,
      });

      this.grammarBuilder.addRule("At", {
        kind: "Terminal",
        name: "@",
      });

      return { kind: "NonTerminal", name: "DirectiveConst" };
    }
    return null;
  }

  private parseArgumentsConst(): GrammarElement | null {
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "(") {
      this.consume(); // "("

      const args: GrammarElement[] = [];
      while (this.peek()?.type !== "Punctuator" || this.peek()?.value !== ")") {
        if (this.isEOF()) break;
        const arg = this.parseArgumentConst();
        if (arg) args.push(arg);
        if (this.peek()?.type === "Punctuator" && this.peek()?.value === ",") {
          this.consume();
        }
      }

      this.expectPunctuator(")");

      this.grammarBuilder.addRule("ArgumentsConst", {
        kind: "Sequence",
        elements: [
          { kind: "Terminal", name: "(" },
          { kind: "List", element: { kind: "NonTerminal", name: "ArgumentConst" } },
          { kind: "Terminal", name: ")" },
        ],
      });

      return { kind: "NonTerminal", name: "ArgumentsConst" };
    }
    return null;
  }

  private parseArgumentConst(): GrammarElement | null {
    // ArgumentConst: Seq(Name, Colon, ValueConst)
    const nameToken = this.expectToken("Name");
    this.expectPunctuator(":");
    const value = this.parseValueConst();

    this.grammarBuilder.addRule("ArgumentConst", {
      kind: "Sequence",
      elements: [
        { kind: "NonTerminal", name: "Name" },
        { kind: "Terminal", name: ":" },
        { kind: "NonTerminal", name: "ValueConst" },
      ],
    });

    return { kind: "NonTerminal", name: "ArgumentConst" };
  }

  private parseValueConst(): GrammarElement {
    const token = this.peek();
    if (!token) throw this.error("Expected value");

    if (token.type === "StringValue") {
      this.consume();
      this.grammarBuilder.addRule("ValueConst", {
        kind: "NonTerminal",
        name: "StringValue",
      });
      return { kind: "NonTerminal", name: "ValueConst" };
    }

    if (token.type === "IntValue") {
      this.consume();
      this.grammarBuilder.addRule("ValueConst", {
        kind: "NonTerminal",
        name: "IntValue",
      });
      return { kind: "NonTerminal", name: "ValueConst" };
    }

    if (token.type === "BooleanValue" || token.value === "true" || token.value === "false") {
      this.consume();
      this.grammarBuilder.addRule("ValueConst", {
        kind: "NonTerminal",
        name: "BooleanValue",
      });
      return { kind: "NonTerminal", name: "ValueConst" };
    }

    if (token.type === "NullValue" || token.value === "null") {
      this.consume();
      this.grammarBuilder.addRule("ValueConst", {
        kind: "NonTerminal",
        name: "NullValue",
      });
      return { kind: "NonTerminal", name: "ValueConst" };
    }

    if (token.type === "Name") {
      // EnumValue
      this.consume();
      this.grammarBuilder.addRule("EnumValue", {
        kind: "NonTerminal",
        name: "Name",
      });
      this.grammarBuilder.addRule("ValueConst", {
        kind: "NonTerminal",
        name: "EnumValue",
      });
      return { kind: "NonTerminal", name: "ValueConst" };
    }

    throw this.error(`Unexpected token type for value: ${token.type}`);
  }

  private parseFieldsDefinition(): GrammarElement | null {
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "{") {
      this.consume(); // "{"

      const fields: GrammarElement[] = [];
      while (this.peek()?.type !== "Punctuator" || this.peek()?.value !== "}") {
        if (this.isEOF()) break;
        const field = this.parseFieldDefinition();
        if (field) fields.push(field);
      }

      this.expectPunctuator("}");

      this.grammarBuilder.addRule("FieldsDefinition", {
        kind: "Sequence",
        elements: [
          { kind: "Terminal", name: "{" },
          { kind: "List", element: { kind: "NonTerminal", name: "FieldDefinition" } },
          { kind: "Terminal", name: "}" },
        ],
      });

      this.grammarBuilder.addRule("BraceL", { kind: "Terminal", name: "{" });
      this.grammarBuilder.addRule("BraceR", { kind: "Terminal", name: "}" });

      return { kind: "NonTerminal", name: "FieldsDefinition" };
    }
    return null;
  }

  private parseFieldDefinition(): GrammarElement | null {
    // FieldDefinition: Seq(Opt(Description), Name, Opt(ArgumentsDefinition), Colon, Type, Opt(DirectivesConst))
    const elements: GrammarElement[] = [];

    // Optional Description
    if (this.peek()?.type === "StringValue") {
      const desc = this.parseDescription();
      if (desc) elements.push(desc);
    }

    // Name
    this.expectToken("Name");
    elements.push({ kind: "NonTerminal", name: "Name" });

    // Optional ArgumentsDefinition
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "(") {
      const args = this.parseArgumentsDefinition();
      if (args) elements.push(args);
    }

    // Colon
    this.expectPunctuator(":");
    elements.push({ kind: "Terminal", name: ":" });

    // Type
    const typeEl = this.parseType();
    elements.push(typeEl);

    // Optional DirectivesConst
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directives = this.parseDirectivesConst();
      if (directives) elements.push(directives);
    }

    this.grammarBuilder.addRule("FieldDefinition", {
      kind: "Sequence",
      elements,
    });

    this.grammarBuilder.addRule("Colon", { kind: "Terminal", name: ":" });

    return { kind: "NonTerminal", name: "FieldDefinition" };
  }

  private parseArgumentsDefinition(): GrammarElement | null {
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "(") {
      this.consume(); // "("

      const args: GrammarElement[] = [];
      while (this.peek()?.type !== "Punctuator" || this.peek()?.value !== ")") {
        if (this.isEOF()) break;
        const arg = this.parseInputValueDefinition();
        if (arg) args.push(arg);
        if (this.peek()?.type === "Punctuator" && this.peek()?.value === ",") {
          this.consume();
        }
      }

      this.expectPunctuator(")");

      this.grammarBuilder.addRule("ArgumentsDefinition", {
        kind: "Sequence",
        elements: [
          { kind: "Terminal", name: "(" },
          { kind: "List", element: { kind: "NonTerminal", name: "InputValueDefinition" } },
          { kind: "Terminal", name: ")" },
        ],
      });

      this.grammarBuilder.addRule("ParenL", { kind: "Terminal", name: "(" });
      this.grammarBuilder.addRule("ParenR", { kind: "Terminal", name: ")" });

      return { kind: "NonTerminal", name: "ArgumentsDefinition" };
    }
    return null;
  }

  private parseInputValueDefinition(): GrammarElement | null {
    // InputValueDefinition: Seq(Opt(Description), Name, Colon, Type, Opt(DefaultValue), Opt(DirectivesConst))
    const elements: GrammarElement[] = [];

    if (this.peek()?.type === "StringValue") {
      const desc = this.parseDescription();
      if (desc) elements.push(desc);
    }

    this.expectToken("Name");
    elements.push({ kind: "NonTerminal", name: "Name" });

    this.expectPunctuator(":");
    elements.push({ kind: "Terminal", name: ":" });

    const typeEl = this.parseType();
    elements.push(typeEl);

    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "=") {
      const defaultValue = this.parseDefaultValue();
      if (defaultValue) elements.push(defaultValue);
    }

    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directives = this.parseDirectivesConst();
      if (directives) elements.push(directives);
    }

    this.grammarBuilder.addRule("InputValueDefinition", {
      kind: "Sequence",
      elements,
    });

    return { kind: "NonTerminal", name: "InputValueDefinition" };
  }

  private parseDefaultValue(): GrammarElement | null {
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "=") {
      this.consume(); // "="
      const value = this.parseValueConst();

      this.grammarBuilder.addRule("DefaultValue", {
        kind: "Sequence",
        elements: [
          { kind: "Terminal", name: "=" },
          { kind: "NonTerminal", name: "ValueConst" },
        ],
      });

      this.grammarBuilder.addRule("Equals", { kind: "Terminal", name: "=" });

      return { kind: "NonTerminal", name: "DefaultValue" };
    }
    return null;
  }

  private parseType(): GrammarElement {
    // Type: Or(NamedType, ListType, NonNullType)
    const token = this.peek();
    if (!token) throw this.error("Expected type");

    // ListType: [Type]
    if (token.type === "Punctuator" && token.value === "[") {
      this.consume(); // "["
      const innerType = this.parseType();
      this.expectPunctuator("]");

      this.grammarBuilder.addRule("ListType", {
        kind: "Sequence",
        elements: [
          { kind: "Terminal", name: "[" },
          { kind: "NonTerminal", name: "Type" },
          { kind: "Terminal", name: "]" },
        ],
      });

      this.grammarBuilder.addRule("BracketL", { kind: "Terminal", name: "[" });
      this.grammarBuilder.addRule("BracketR", { kind: "Terminal", name: "]" });

      // Check for NonNull
      if (this.peek()?.type === "Punctuator" && this.peek()?.value === "!") {
        this.consume(); // "!"
        this.grammarBuilder.addRule("NonNullType", {
          kind: "Sequence",
          elements: [
            { kind: "NonTerminal", name: "ListType" },
            { kind: "Terminal", name: "!" },
          ],
        });
        this.grammarBuilder.addRule("Bang", { kind: "Terminal", name: "!" });
        return { kind: "NonTerminal", name: "NonNullType" };
      }

      this.grammarBuilder.addRule("Type", {
        kind: "OneOf",
        options: [
          { kind: "NonTerminal", name: "NamedType" },
          { kind: "NonTerminal", name: "ListType" },
          { kind: "NonTerminal", name: "NonNullType" },
        ],
      });

      return { kind: "NonTerminal", name: "ListType" };
    }

    // NamedType
    this.expectToken("Name");
    this.grammarBuilder.addRule("NamedType", {
      kind: "NonTerminal",
      name: "Name",
    });

    // Check for NonNull
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "!") {
      this.consume(); // "!"
      this.grammarBuilder.addRule("NonNullType", {
        kind: "Sequence",
        elements: [
          { kind: "NonTerminal", name: "NamedType" },
          { kind: "Terminal", name: "!" },
        ],
      });
      this.grammarBuilder.addRule("Bang", { kind: "Terminal", name: "!" });
      this.grammarBuilder.addRule("Type", {
        kind: "OneOf",
        options: [
          { kind: "NonTerminal", name: "NamedType" },
          { kind: "NonTerminal", name: "ListType" },
          { kind: "NonTerminal", name: "NonNullType" },
        ],
      });
      return { kind: "NonTerminal", name: "NonNullType" };
    }

    this.grammarBuilder.addRule("Type", {
      kind: "OneOf",
      options: [
        { kind: "NonTerminal", name: "NamedType" },
        { kind: "NonTerminal", name: "ListType" },
        { kind: "NonTerminal", name: "NonNullType" },
      ],
    });

    return { kind: "NonTerminal", name: "NamedType" };
  }

  private parseEnumValuesDefinition(): GrammarElement | null {
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "{") {
      this.consume(); // "{"

      const values: GrammarElement[] = [];
      while (this.peek()?.type !== "Punctuator" || this.peek()?.value !== "}") {
        if (this.isEOF()) break;
        const value = this.parseEnumValueDefinition();
        if (value) values.push(value);
      }

      this.expectPunctuator("}");

      this.grammarBuilder.addRule("EnumValuesDefinition", {
        kind: "Sequence",
        elements: [
          { kind: "Terminal", name: "{" },
          { kind: "List", element: { kind: "NonTerminal", name: "EnumValueDefinition" } },
          { kind: "Terminal", name: "}" },
        ],
      });

      return { kind: "NonTerminal", name: "EnumValuesDefinition" };
    }
    return null;
  }

  private parseEnumValueDefinition(): GrammarElement | null {
    // EnumValueDefinition: Seq(Opt(Description), EnumValue, Opt(DirectivesConst))
    const elements: GrammarElement[] = [];

    if (this.peek()?.type === "StringValue") {
      const desc = this.parseDescription();
      if (desc) elements.push(desc);
    }

    // EnumValue is just a Name
    this.expectToken("Name");
    elements.push({ kind: "NonTerminal", name: "EnumValue" });

    this.grammarBuilder.addRule("EnumValue", {
      kind: "NonTerminal",
      name: "Name",
    });

    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "@") {
      const directives = this.parseDirectivesConst();
      if (directives) elements.push(directives);
    }

    this.grammarBuilder.addRule("EnumValueDefinition", {
      kind: "Sequence",
      elements,
    });

    return { kind: "NonTerminal", name: "EnumValueDefinition" };
  }

  private parseInputFieldsDefinition(): GrammarElement | null {
    if (this.peek()?.type === "Punctuator" && this.peek()?.value === "{") {
      this.consume(); // "{"

      const fields: GrammarElement[] = [];
      while (this.peek()?.type !== "Punctuator" || this.peek()?.value !== "}") {
        if (this.isEOF()) break;
        const field = this.parseInputValueDefinition();
        if (field) fields.push(field);
      }

      this.expectPunctuator("}");

      this.grammarBuilder.addRule("InputFieldsDefinition", {
        kind: "Sequence",
        elements: [
          { kind: "Terminal", name: "{" },
          { kind: "List", element: { kind: "NonTerminal", name: "InputValueDefinition" } },
          { kind: "Terminal", name: "}" },
        ],
      });

      return { kind: "NonTerminal", name: "InputFieldsDefinition" };
    }
    return null;
  }

  // Token utilities
  private peek(): Token | null {
    if (this.position >= this.tokens.length) return null;
    return this.tokens[this.position];
  }

  private consume(): Token {
    if (this.position >= this.tokens.length) {
      throw this.error("Unexpected end of input");
    }
    return this.tokens[this.position++];
  }

  private expectToken(type: TokenType): Token {
    const token = this.peek();
    if (!token || token.type !== type) {
      throw this.error(`Expected ${type}, got ${token?.type || "EOF"}`);
    }
    return this.consume();
  }

  private expectKeyword(value: string): void {
    const token = this.expectToken("Keyword");
    if (token.value !== value) {
      throw this.error(`Expected keyword "${value}", got "${token.value}"`);
    }
  }

  private expectPunctuator(value: string): void {
    const token = this.expectToken("Punctuator");
    if (token.value !== value) {
      throw this.error(`Expected "${value}", got "${token.value}"`);
    }
  }

  private isEOF(): boolean {
    const token = this.peek();
    return !token || token.type === "EOF";
  }

  private error(message: string): Error {
    const token = this.peek();
    if (token) {
      return new Error(`${message} at line ${token.line}, column ${token.column}`);
    }
    return new Error(message);
  }
}

// ==========================================
// Grammar Builder
// ==========================================

class GrammarBuilder {
  private rules: Map<string, ProductionRule> = new Map();

  addNameRule(): void {
    if (!this.rules.has("Name")) {
      this.rules.set("Name", {
        name: "Name",
        definition: {
          kind: "Terminal",
          name: "Name",
          pattern: "[_A-Za-z][_0-9A-Za-z]*",
        },
      });
    }
  }

  addRule(name: string, definition: GrammarElement): void {
    // Only add if not already present (to avoid overwriting)
    if (!this.rules.has(name)) {
      this.rules.set(name, {
        name,
        definition,
      });
    }
  }

  build(): Grammar {
    const rules: Record<string, ProductionRule> = {};
    for (const [name, rule] of this.rules.entries()) {
      rules[name] = rule;
    }

    return {
      root: "Document",
      rules,
    };
  }
}

