/**
 * Comprehensive test suite for validating GraphQL Grammar with Zod
 * Tests that each part of the grammar can be represented with Zod schemas
 */

import { describe, it, expect } from "vitest";
import {
  GrammarSchema,
  GrammarElementSchema,
  ProductionRuleSchema,
  TerminalSchema,
  NonTerminalSchema,
  SequenceSchema,
  OneOfSchema,
  OptionalSchema,
  ListSchema,
  validateGrammar,
  validateGrammarElement,
  validateProductionRule,
} from "../src/grammar-zod";
import { GraphQLGrammar } from "../src/grammar";
import type {
  Terminal,
  NonTerminal,
  Sequence,
  OneOf,
  Optional,
  List,
  GrammarElement,
  ProductionRule,
  Grammar,
} from "../src/grammar";

describe("Zod Schema Validation for GraphQL Grammar", () => {
  describe("Terminal Schema", () => {
    it("should validate a Terminal with string pattern", () => {
      const terminal: Terminal = {
        kind: "Terminal",
        name: "Bang",
        pattern: "!",
      };
      expect(TerminalSchema.safeParse(terminal).success).toBe(true);
    });

    it("should validate a Terminal with RegExp pattern", () => {
      const terminal: Terminal = {
        kind: "Terminal",
        name: "Name",
        pattern: /[_A-Za-z][_0-9A-Za-z]*/,
      };
      expect(TerminalSchema.safeParse(terminal).success).toBe(true);
    });

    it("should validate a Terminal without pattern", () => {
      const terminal: Terminal = {
        kind: "Terminal",
        name: "IntValue",
      };
      expect(TerminalSchema.safeParse(terminal).success).toBe(true);
    });

    it("should reject invalid Terminal", () => {
      expect(
        TerminalSchema.safeParse({ kind: "Terminal", name: 123 }).success
      ).toBe(false);
    });
  });

  describe("NonTerminal Schema", () => {
    it("should validate a NonTerminal", () => {
      const nonTerminal: NonTerminal = {
        kind: "NonTerminal",
        name: "Document",
      };
      expect(NonTerminalSchema.safeParse(nonTerminal).success).toBe(true);
    });

    it("should reject invalid NonTerminal", () => {
      expect(
        NonTerminalSchema.safeParse({ kind: "NonTerminal" }).success
      ).toBe(false);
    });
  });

  describe("Sequence Schema", () => {
    it("should validate a Sequence with multiple elements", () => {
      const sequence: Sequence = {
        kind: "Sequence",
        elements: [
          { kind: "Terminal", name: "ParenL" },
          { kind: "NonTerminal", name: "Argument" },
          { kind: "Terminal", name: "ParenR" },
        ],
      };
      expect(SequenceSchema.safeParse(sequence).success).toBe(true);
    });

    it("should validate an empty Sequence", () => {
      const sequence: Sequence = {
        kind: "Sequence",
        elements: [],
      };
      expect(SequenceSchema.safeParse(sequence).success).toBe(true);
    });
  });

  describe("OneOf Schema", () => {
    it("should validate a OneOf with multiple options", () => {
      const oneOf: OneOf = {
        kind: "OneOf",
        options: [
          { kind: "Terminal", name: "query" },
          { kind: "Terminal", name: "mutation" },
          { kind: "Terminal", name: "subscription" },
        ],
      };
      expect(OneOfSchema.safeParse(oneOf).success).toBe(true);
    });
  });

  describe("Optional Schema", () => {
    it("should validate an Optional element", () => {
      const optional: Optional = {
        kind: "Optional",
        element: { kind: "NonTerminal", name: "Description" },
      };
      expect(OptionalSchema.safeParse(optional).success).toBe(true);
    });

    it("should validate nested Optional", () => {
      const optional: Optional = {
        kind: "Optional",
        element: {
          kind: "Optional",
          element: { kind: "NonTerminal", name: "Description" },
        },
      };
      expect(OptionalSchema.safeParse(optional).success).toBe(true);
    });
  });

  describe("List Schema", () => {
    it("should validate a List element", () => {
      const list: List = {
        kind: "List",
        element: { kind: "NonTerminal", name: "Definition" },
      };
      expect(ListSchema.safeParse(list).success).toBe(true);
    });

    it("should validate nested List", () => {
      const list: List = {
        kind: "List",
        element: {
          kind: "List",
          element: { kind: "NonTerminal", name: "Definition" },
        },
      };
      expect(ListSchema.safeParse(list).success).toBe(true);
    });
  });

  describe("GrammarElement Schema", () => {
    it("should validate all GrammarElement types", () => {
      const elements: GrammarElement[] = [
        { kind: "Terminal", name: "Bang" },
        { kind: "NonTerminal", name: "Document" },
        {
          kind: "Sequence",
          elements: [{ kind: "Terminal", name: "ParenL" }],
        },
        {
          kind: "OneOf",
          options: [{ kind: "Terminal", name: "query" }],
        },
        {
          kind: "Optional",
          element: { kind: "NonTerminal", name: "Description" },
        },
        {
          kind: "List",
          element: { kind: "NonTerminal", name: "Definition" },
        },
      ];

      elements.forEach((element) => {
        expect(validateGrammarElement(element)).toBe(true);
      });
    });
  });

  describe("ProductionRule Schema", () => {
    it("should validate a ProductionRule", () => {
      const rule: ProductionRule = {
        name: "Document",
        definition: {
          kind: "List",
          element: { kind: "NonTerminal", name: "Definition" },
        },
      };
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate complex ProductionRule", () => {
      const rule: ProductionRule = {
        name: "OperationDefinition",
        definition: {
          kind: "OneOf",
          options: [
            {
              kind: "Sequence",
              elements: [
                {
                  kind: "Optional",
                  element: { kind: "NonTerminal", name: "Description" },
                },
                { kind: "NonTerminal", name: "OperationType" },
              ],
            },
            { kind: "NonTerminal", name: "SelectionSet" },
          ],
        },
      };
      expect(validateProductionRule(rule)).toBe(true);
    });
  });

  describe("Grammar Schema", () => {
    it("should validate the complete GraphQLGrammar", () => {
      expect(validateGrammar(GraphQLGrammar)).toBe(true);
    });

    it("should validate GrammarSchema.parse on GraphQLGrammar", () => {
      expect(() => GrammarSchema.parse(GraphQLGrammar)).not.toThrow();
    });

    it("should validate all rules in GraphQLGrammar", () => {
      const rules = Object.values(GraphQLGrammar.rules);
      rules.forEach((rule) => {
        expect(validateProductionRule(rule)).toBe(true);
      });
    });

    it("should validate root rule exists", () => {
      expect(GraphQLGrammar.root).toBe("Document");
      expect(GraphQLGrammar.rules[GraphQLGrammar.root]).toBeDefined();
    });
  });

  describe("Individual Grammar Rules Validation", () => {
    it("should validate Document rule", () => {
      const rule = GraphQLGrammar.rules.Document;
      expect(validateProductionRule(rule)).toBe(true);
      expect(rule.name).toBe("Document");
    });

    it("should validate Definition rule", () => {
      const rule = GraphQLGrammar.rules.Definition;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate OperationDefinition rule", () => {
      const rule = GraphQLGrammar.rules.OperationDefinition;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate SelectionSet rule", () => {
      const rule = GraphQLGrammar.rules.SelectionSet;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate Field rule", () => {
      const rule = GraphQLGrammar.rules.Field;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate Arguments rule", () => {
      const rule = GraphQLGrammar.rules.Arguments;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate Value rule", () => {
      const rule = GraphQLGrammar.rules.Value;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate Type rule", () => {
      const rule = GraphQLGrammar.rules.Type;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate Directive rule", () => {
      const rule = GraphQLGrammar.rules.Directive;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate TypeSystemDefinition rule", () => {
      const rule = GraphQLGrammar.rules.TypeSystemDefinition;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate SchemaDefinition rule", () => {
      const rule = GraphQLGrammar.rules.SchemaDefinition;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate ObjectTypeDefinition rule", () => {
      const rule = GraphQLGrammar.rules.ObjectTypeDefinition;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate InterfaceTypeDefinition rule", () => {
      const rule = GraphQLGrammar.rules.InterfaceTypeDefinition;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate UnionTypeDefinition rule", () => {
      const rule = GraphQLGrammar.rules.UnionTypeDefinition;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate EnumTypeDefinition rule", () => {
      const rule = GraphQLGrammar.rules.EnumTypeDefinition;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate InputObjectTypeDefinition rule", () => {
      const rule = GraphQLGrammar.rules.InputObjectTypeDefinition;
      expect(validateProductionRule(rule)).toBe(true);
    });

    it("should validate DirectiveDefinition rule", () => {
      const rule = GraphQLGrammar.rules.DirectiveDefinition;
      expect(validateProductionRule(rule)).toBe(true);
    });
  });

  describe("Terminal Rules Validation", () => {
    it("should validate all terminal rules", () => {
      const terminalRules = [
        "Name",
        "IntValue",
        "FloatValue",
        "StringValue",
        "BooleanValue",
        "NullValue",
        "Bang",
        "Dollar",
        "Ampersand",
        "ParenL",
        "ParenR",
        "Spread",
        "Colon",
        "Equals",
        "At",
        "BracketL",
        "BracketR",
        "BraceL",
        "Pipe",
        "BraceR",
      ];

      terminalRules.forEach((ruleName) => {
        const rule = GraphQLGrammar.rules[ruleName];
        expect(rule).toBeDefined();
        expect(validateProductionRule(rule)).toBe(true);
        expect(rule.definition.kind).toBe("Terminal");
      });
    });
  });

  describe("Complex Nested Structures", () => {
    it("should validate deeply nested grammar elements", () => {
      const complexRule: ProductionRule = {
        name: "ComplexRule",
        definition: {
          kind: "Sequence",
          elements: [
            {
              kind: "Optional",
              element: {
                kind: "List",
                element: {
                  kind: "OneOf",
                  options: [
                    { kind: "Terminal", name: "A" },
                    {
                      kind: "Sequence",
                      elements: [
                        { kind: "NonTerminal", name: "B" },
                        {
                          kind: "Optional",
                          element: { kind: "NonTerminal", name: "C" },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      };

      expect(validateProductionRule(complexRule)).toBe(true);
    });
  });

  describe("Grammar Completeness", () => {
    it("should validate all rules are accessible", () => {
      const ruleNames = Object.keys(GraphQLGrammar.rules);
      expect(ruleNames.length).toBeGreaterThan(0);

      ruleNames.forEach((ruleName) => {
        const rule = GraphQLGrammar.rules[ruleName];
        expect(rule).toBeDefined();
        expect(rule.name).toBe(ruleName);
        expect(validateProductionRule(rule)).toBe(true);
      });
    });

    it("should validate all non-terminal references exist", () => {
      const ruleNames = new Set(Object.keys(GraphQLGrammar.rules));

      function checkReferences(element: GrammarElement): void {
        switch (element.kind) {
          case "NonTerminal":
            expect(ruleNames.has(element.name)).toBe(true);
            break;
          case "Sequence":
            element.elements.forEach(checkReferences);
            break;
          case "OneOf":
            element.options.forEach(checkReferences);
            break;
          case "Optional":
            checkReferences(element.element);
            break;
          case "List":
            checkReferences(element.element);
            break;
        }
      }

      Object.values(GraphQLGrammar.rules).forEach((rule) => {
        checkReferences(rule.definition);
      });
    });
  });

  describe("Zod Schema Type Safety", () => {
    it("should provide type inference for validated grammar", () => {
      const result = GrammarSchema.safeParse(GraphQLGrammar);
      if (result.success) {
        // TypeScript should infer the type correctly
        const grammar: Grammar = result.data;
        expect(grammar.root).toBe("Document");
      } else {
        throw new Error("Grammar validation failed");
      }
    });

    it("should catch type errors at compile time", () => {
      const invalidGrammar = {
        root: 123, // Should be string
        rules: {},
      };

      expect(GrammarSchema.safeParse(invalidGrammar).success).toBe(false);
    });
  });
});

