/**
 * GraphQL SDL Generator Tests - C.1-C.3 Lexical Tokens
 * 
 * Tests for Lexical Token generation (sections C.1-C.3 of GraphQL spec).
 * Currently focused on Name Token generation in various contexts.
 */

import { describe, it, expect } from "vitest";
import { graphqlSDLGenerator } from "../../src/plugins/generators/graphql-sdl";
import { loadGeneratorFixtures } from "../helpers/fixtures";
import { expectValidGraphQL } from "../helpers/schema-validator";
import type { Grammar } from "../../src/grammar";
import { createTestID, registerTestID } from "../helpers/test-ids";
import { initTestReport, reportTestPassed, reportTestFailed } from "../helpers/report-test";
import type { SchemaCheckResult } from "../helpers/schema-validator";

describe("graphql-sdl generator - C.1-C.3 Lexical Tokens", () => {
  const fixtures = loadGeneratorFixtures("graphql-sdl");

  describe("C.1-C.3 Lexical Tokens - Name Token", () => {
    describe("Generator Tests", () => {
      const TEST_ID_001 = createTestID("GEN", "graphql-sdl", 7);
      registerTestID(TEST_ID_001, "tests/generators/graphql-sdl.lexical-tokens.test.ts", "Generate Name terminal with valid identifier pattern");

      it(`[${TEST_ID_001}] Generate Name terminal with valid identifier pattern`, async () => {
        const input = fixtures.input("GEN-GSDL-007-generate-name-terminal-with-valid-identifier-pattern-grammar.json") as Grammar;
        const expected = fixtures.expected("GEN-GSDL-007-generate-name-terminal-with-valid-identifier-pattern-grammar.graphql");
        
        initTestReport({
          testId: TEST_ID_001,
          description: "Generate Name terminal with valid identifier pattern",
          input,
          expectedOutput: expected,
        });
        
        const output = graphqlSDLGenerator.generate(input, {
          format: true,
          includeDescriptions: true,
        });

        expect(typeof output).toBe("string");
        expect(output.length).toBeGreaterThan(0);

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(output, undefined, {
            failOnWarnings: false,
            expectedFixture: expected,
            compareMode: "semantic",
            saveOutput:
              process.env.SAVE_TEST_OUTPUTS === "true"
                ? "GEN-GSDL-007-generate-name-terminal-with-valid-identifier-pattern-grammar.graphql"
                : false,
            pluginType: "generators",
            pluginName: "graphql-sdl",
            testId: TEST_ID_001,
          });
          
          reportTestPassed({
            testId: TEST_ID_001,
            description: "Generate Name terminal with valid identifier pattern",
            input,
            expectedOutput: expected,
            actualOutput: output,
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_001,
              description: "Generate Name terminal with valid identifier pattern",
              input,
              expectedOutput: expected,
              actualOutput: output,
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_002 = createTestID("GEN", "graphql-sdl", 8);
      registerTestID(TEST_ID_002, "tests/generators/graphql-sdl.lexical-tokens.test.ts", "Generate Name in type definition context");

      it(`[${TEST_ID_002}] Generate Name in type definition context`, async () => {
        const input = fixtures.input("GEN-GSDL-008-generate-name-in-type-definition-context-grammar.json") as Grammar;
        const expected = fixtures.expected("GEN-GSDL-008-generate-name-in-type-definition-context-grammar.graphql");
        
        initTestReport({
          testId: TEST_ID_002,
          description: "Generate Name in type definition context",
          input,
          expectedOutput: expected,
        });
        
        const output = graphqlSDLGenerator.generate(input, {
          format: true,
          includeDescriptions: true,
        });

        expect(typeof output).toBe("string");
        expect(output.length).toBeGreaterThan(0);

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(output, undefined, {
            failOnWarnings: false,
            expectedFixture: expected,
            compareMode: "semantic",
            saveOutput:
              process.env.SAVE_TEST_OUTPUTS === "true"
                ? "GEN-GSDL-008-generate-name-in-type-definition-context-grammar.graphql"
                : false,
            pluginType: "generators",
            pluginName: "graphql-sdl",
            testId: TEST_ID_002,
          });
          
          reportTestPassed({
            testId: TEST_ID_002,
            description: "Generate Name in type definition context",
            input,
            expectedOutput: expected,
            actualOutput: output,
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_002,
              description: "Generate Name in type definition context",
              input,
              expectedOutput: expected,
              actualOutput: output,
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_003 = createTestID("GEN", "graphql-sdl", 9);
      registerTestID(TEST_ID_003, "tests/generators/graphql-sdl.lexical-tokens.test.ts", "Generate Name in field definition context");

      it(`[${TEST_ID_003}] Generate Name in field definition context`, async () => {
        const input = fixtures.input("GEN-GSDL-009-generate-name-in-field-definition-context-grammar.json") as Grammar;
        const expected = fixtures.expected("GEN-GSDL-009-generate-name-in-field-definition-context-grammar.graphql");
        
        initTestReport({
          testId: TEST_ID_003,
          description: "Generate Name in field definition context",
          input,
          expectedOutput: expected,
        });
        
        const output = graphqlSDLGenerator.generate(input, {
          format: true,
          includeDescriptions: true,
        });

        expect(typeof output).toBe("string");
        expect(output.length).toBeGreaterThan(0);

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(output, undefined, {
            failOnWarnings: false,
            expectedFixture: expected,
            compareMode: "semantic",
            saveOutput:
              process.env.SAVE_TEST_OUTPUTS === "true"
                ? "GEN-GSDL-009-generate-name-in-field-definition-context-grammar.graphql"
                : false,
            pluginType: "generators",
            pluginName: "graphql-sdl",
            testId: TEST_ID_003,
          });
          
          reportTestPassed({
            testId: TEST_ID_003,
            description: "Generate Name in field definition context",
            input,
            expectedOutput: expected,
            actualOutput: output,
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_003,
              description: "Generate Name in field definition context",
              input,
              expectedOutput: expected,
              actualOutput: output,
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_004 = createTestID("GEN", "graphql-sdl", 10);
      registerTestID(TEST_ID_004, "tests/generators/graphql-sdl.lexical-tokens.test.ts", "Generate Name in argument definition context");

      it(`[${TEST_ID_004}] Generate Name in argument definition context`, async () => {
        const input = fixtures.input("GEN-GSDL-010-generate-name-in-argument-definition-context-grammar.json") as Grammar;
        const expected = fixtures.expected("GEN-GSDL-010-generate-name-in-argument-definition-context-grammar.graphql");
        
        initTestReport({
          testId: TEST_ID_004,
          description: "Generate Name in argument definition context",
          input,
          expectedOutput: expected,
        });
        
        const output = graphqlSDLGenerator.generate(input, {
          format: true,
          includeDescriptions: true,
        });

        expect(typeof output).toBe("string");
        expect(output.length).toBeGreaterThan(0);

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(output, undefined, {
            failOnWarnings: false,
            expectedFixture: expected,
            compareMode: "semantic",
            saveOutput:
              process.env.SAVE_TEST_OUTPUTS === "true"
                ? "GEN-GSDL-010-generate-name-in-argument-definition-context-grammar.graphql"
                : false,
            pluginType: "generators",
            pluginName: "graphql-sdl",
            testId: TEST_ID_004,
          });
          
          reportTestPassed({
            testId: TEST_ID_004,
            description: "Generate Name in argument definition context",
            input,
            expectedOutput: expected,
            actualOutput: output,
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_004,
              description: "Generate Name in argument definition context",
              input,
              expectedOutput: expected,
              actualOutput: output,
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_005 = createTestID("GEN", "graphql-sdl", 11);
      registerTestID(TEST_ID_005, "tests/generators/graphql-sdl.lexical-tokens.test.ts", "Generate Name in directive context");

      it(`[${TEST_ID_005}] Generate Name in directive context`, async () => {
        const input = fixtures.input("GEN-GSDL-011-generate-name-in-directive-context-grammar.json") as Grammar;
        const expected = fixtures.expected("GEN-GSDL-011-generate-name-in-directive-context-grammar.graphql");
        
        initTestReport({
          testId: TEST_ID_005,
          description: "Generate Name in directive context",
          input,
          expectedOutput: expected,
        });
        
        const output = graphqlSDLGenerator.generate(input, {
          format: true,
          includeDescriptions: true,
        });

        expect(typeof output).toBe("string");
        expect(output.length).toBeGreaterThan(0);

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(output, undefined, {
            failOnWarnings: false,
            expectedFixture: expected,
            compareMode: "semantic",
            saveOutput:
              process.env.SAVE_TEST_OUTPUTS === "true"
                ? "GEN-GSDL-011-generate-name-in-directive-context-grammar.graphql"
                : false,
            pluginType: "generators",
            pluginName: "graphql-sdl",
            testId: TEST_ID_005,
          });
          
          reportTestPassed({
            testId: TEST_ID_005,
            description: "Generate Name in directive context",
            input,
            expectedOutput: expected,
            actualOutput: output,
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_005,
              description: "Generate Name in directive context",
              input,
              expectedOutput: expected,
              actualOutput: output,
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_006 = createTestID("GEN", "graphql-sdl", 12);
      registerTestID(TEST_ID_006, "tests/generators/graphql-sdl.lexical-tokens.test.ts", "Generate Name in enum value context");

      it(`[${TEST_ID_006}] Generate Name in enum value context`, async () => {
        const input = fixtures.input("GEN-GSDL-012-generate-name-in-enum-value-context-grammar.json") as Grammar;
        const expected = fixtures.expected("GEN-GSDL-012-generate-name-in-enum-value-context-grammar.graphql");
        
        initTestReport({
          testId: TEST_ID_006,
          description: "Generate Name in enum value context",
          input,
          expectedOutput: expected,
        });
        
        const output = graphqlSDLGenerator.generate(input, {
          format: true,
          includeDescriptions: true,
        });

        expect(typeof output).toBe("string");
        expect(output.length).toBeGreaterThan(0);

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(output, undefined, {
            failOnWarnings: false,
            expectedFixture: expected,
            compareMode: "semantic",
            saveOutput:
              process.env.SAVE_TEST_OUTPUTS === "true"
                ? "GEN-GSDL-012-generate-name-in-enum-value-context-grammar.graphql"
                : false,
            pluginType: "generators",
            pluginName: "graphql-sdl",
            testId: TEST_ID_006,
          });
          
          reportTestPassed({
            testId: TEST_ID_006,
            description: "Generate Name in enum value context",
            input,
            expectedOutput: expected,
            actualOutput: output,
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_006,
              description: "Generate Name in enum value context",
              input,
              expectedOutput: expected,
              actualOutput: output,
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });
    });
  });
});

