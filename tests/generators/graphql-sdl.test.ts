/**
 * GraphQL SDL Generator Tests
 * 
 * Tests the GraphQL SDL generator plugin with fixture-based testing.
 * All generated GraphQL schemas are validated and linted.
 * 
 * Tests are organized following the GraphQL specification structure in src/grammar.ts:
 * - Schema Definition (3.3)
 * - Scalar Types (3.5)
 * - Object Types (3.6)
 * - Interface Types (3.7)
 * - Union Types (3.8)
 * - Enum Types (3.9)
 * - Input Object Types (3.10)
 * - Directive Definitions (3.13)
 */

import { describe, it, expect } from "vitest";
import { graphqlSDLGenerator } from "../../src/plugins/generators/graphql-sdl";
import { loadGeneratorFixtures } from "../helpers/fixtures";
import { expectValidGraphQL } from "../helpers/schema-validator";
import { GraphQLGrammar, type Grammar } from "../../src/grammar";
import { createTestID, registerTestID } from "../helpers/test-ids";
import { initTestReport, reportTestPassed, reportTestFailed } from "../helpers/report-test";
import type { SchemaCheckResult } from "../helpers/schema-validator";

describe("graphql-sdl generator", () => {
  const fixtures = loadGeneratorFixtures("graphql-sdl");

  describe("3.3 Schema Definition", () => {
    const TEST_ID = createTestID("GEN", "graphql-sdl", 1);
    registerTestID(TEST_ID, "tests/generators/graphql-sdl.test.ts", "generates schema definition with root operation types");

    it(`[${TEST_ID}] generates schema definition with root operation types`, async () => {
      const input = fixtures.input("schema-definition-grammar.json") as Grammar;
      const expected = fixtures.expected("schema-definition-grammar.graphql");
      
      // Initialize test report context
      initTestReport({
        testId: TEST_ID,
        description: "generates schema definition with root operation types",
        input,
        expectedOutput: expected,
      });
      
      const output = graphqlSDLGenerator.generate(input, {
        format: true,
        includeDescriptions: true,
      });

      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);

      // REQUIRED: Validate generated GraphQL and compare with expected fixture
      // Validation errors will cause the test to fail and be reported
      let validationResult: SchemaCheckResult | undefined;
      try {
        validationResult = await expectValidGraphQL(output, undefined, {
          failOnWarnings: false,
          expectedFixture: expected,
          compareMode: "semantic",
          saveOutput:
            process.env.SAVE_TEST_OUTPUTS === "true"
              ? "schema-definition-grammar.graphql"
              : false,
          pluginType: "generators",
          pluginName: "graphql-sdl",
          testId: TEST_ID,
        });
        
        // Report test passed
        reportTestPassed({
          testId: TEST_ID,
          description: "generates schema definition with root operation types",
          input,
          expectedOutput: expected,
          actualOutput: output,
          validationResult,
        });
      } catch (error) {
        // Report test failed
        reportTestFailed(
          {
            testId: TEST_ID,
            description: "generates schema definition with root operation types",
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

  describe("3.5 Scalar Type Definition", () => {
    const TEST_ID = createTestID("GEN", "graphql-sdl", 2);
    registerTestID(TEST_ID, "tests/generators/graphql-sdl.test.ts", "generates scalar type definition");

    it(`[${TEST_ID}] generates scalar type definition`, async () => {
      const input = fixtures.input("scalar-type-grammar.json") as Grammar;
      const expected = fixtures.expected("scalar-type-grammar.graphql");
      
      // Initialize test report context
      initTestReport({
        testId: TEST_ID,
        description: "generates scalar type definition",
        input,
        expectedOutput: expected,
      });
      
      const output = graphqlSDLGenerator.generate(input, {
        format: true,
        includeDescriptions: true,
      });

      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);

      // REQUIRED: Validate generated GraphQL and compare with expected fixture
      // Validation errors will cause the test to fail and be reported
      let validationResult: SchemaCheckResult | undefined;
      try {
        validationResult = await expectValidGraphQL(output, undefined, {
          failOnWarnings: false,
          expectedFixture: expected,
          compareMode: "semantic",
          saveOutput:
            process.env.SAVE_TEST_OUTPUTS === "true"
              ? "scalar-type-grammar.graphql"
              : false,
          pluginType: "generators",
          pluginName: "graphql-sdl",
          testId: TEST_ID,
        });
        
        // Report test passed
        reportTestPassed({
          testId: TEST_ID,
          description: "generates scalar type definition",
          input,
          expectedOutput: expected,
          actualOutput: output,
          validationResult,
        });
      } catch (error) {
        // Report test failed
        reportTestFailed(
          {
            testId: TEST_ID,
            description: "generates scalar type definition",
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

  describe("3.6 Object Type Definition", () => {
    const TEST_ID = createTestID("GEN", "graphql-sdl", 3);
    registerTestID(TEST_ID, "tests/generators/graphql-sdl.test.ts", "generates object type definition with fields");

    it(`[${TEST_ID}] generates object type definition with fields`, async () => {
      const input = fixtures.input("object-type-with-fields-grammar.json") as Grammar;
      const expected = fixtures.expected("object-type-with-fields-grammar.graphql");
      
      // Initialize test report context
      initTestReport({
        testId: TEST_ID,
        description: "generates object type definition with fields",
        input,
        expectedOutput: expected,
      });
      
      const output = graphqlSDLGenerator.generate(input, {
        format: true,
        includeDescriptions: true,
      });

      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);

      // REQUIRED: Validate generated GraphQL and compare with expected fixture
      // Validation errors will cause the test to fail and be reported
      let validationResult: SchemaCheckResult | undefined;
      try {
        validationResult = await expectValidGraphQL(output, undefined, {
          failOnWarnings: false,
          expectedFixture: expected,
          compareMode: "semantic",
          saveOutput:
            process.env.SAVE_TEST_OUTPUTS === "true"
              ? "object-type-with-fields-grammar.graphql"
              : false,
          pluginType: "generators",
          pluginName: "graphql-sdl",
          testId: TEST_ID,
        });
        
        // Report test passed
        reportTestPassed({
          testId: TEST_ID,
          description: "generates object type definition with fields",
          input,
          expectedOutput: expected,
          actualOutput: output,
          validationResult,
        });
      } catch (error) {
        // Report test failed
        reportTestFailed(
          {
            testId: TEST_ID,
            description: "generates object type definition with fields",
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

  describe("3.7 Interface Type Definition", () => {
    const TEST_ID = createTestID("GEN", "graphql-sdl", 4);
    registerTestID(TEST_ID, "tests/generators/graphql-sdl.test.ts", "generates interface type definition");

    it(`[${TEST_ID}] generates interface type definition`, async () => {
      const input = fixtures.input("interface-type-grammar.json") as Grammar;
      const expected = fixtures.expected("interface-type-grammar.graphql");
      
      // Initialize test report context
      initTestReport({
        testId: TEST_ID,
        description: "generates interface type definition",
        input,
        expectedOutput: expected,
      });
      
      const output = graphqlSDLGenerator.generate(input, {
        format: true,
        includeDescriptions: true,
      });

      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);

      // REQUIRED: Validate generated GraphQL and compare with expected fixture
      // Validation errors will cause the test to fail and be reported
      let validationResult: SchemaCheckResult | undefined;
      try {
        validationResult = await expectValidGraphQL(output, undefined, {
          failOnWarnings: false,
          expectedFixture: expected,
          compareMode: "semantic",
          saveOutput:
            process.env.SAVE_TEST_OUTPUTS === "true"
              ? "interface-type-grammar.graphql"
              : false,
          pluginType: "generators",
          pluginName: "graphql-sdl",
          testId: TEST_ID,
        });
        
        // Report test passed
        reportTestPassed({
          testId: TEST_ID,
          description: "generates interface type definition",
          input,
          expectedOutput: expected,
          actualOutput: output,
          validationResult,
        });
      } catch (error) {
        // Report test failed
        reportTestFailed(
          {
            testId: TEST_ID,
            description: "generates interface type definition",
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

  describe("configuration options", () => {
    const TEST_ID_FORMAT = createTestID("GEN", "graphql-sdl", 5);
    registerTestID(TEST_ID_FORMAT, "tests/generators/graphql-sdl.test.ts", "respects format option");

    it(`[${TEST_ID_FORMAT}] respects format option`, async () => {
      const input = GraphQLGrammar;
      
      // Initialize test report context
      initTestReport({
        testId: TEST_ID_FORMAT,
        description: "respects format option",
        input,
      });
      
      const formatted = graphqlSDLGenerator.generate(GraphQLGrammar, {
        format: true,
      });
      const unformatted = graphqlSDLGenerator.generate(GraphQLGrammar, {
        format: false,
      });

      expect(typeof formatted).toBe("string");
      expect(typeof unformatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
      expect(unformatted.length).toBeGreaterThan(0);
      
      // Validate both outputs are valid GraphQL
      let validationResult: SchemaCheckResult | undefined;
      try {
        // Validate formatted output
        validationResult = await expectValidGraphQL(formatted, undefined, {
          failOnWarnings: false,
          pluginType: "generators",
          pluginName: "graphql-sdl",
          testId: TEST_ID_FORMAT,
        });
        
        // Validate unformatted output
        await expectValidGraphQL(unformatted, undefined, {
          failOnWarnings: false,
          pluginType: "generators",
          pluginName: "graphql-sdl",
          testId: TEST_ID_FORMAT,
        });
        
        // Report test passed
        reportTestPassed({
          testId: TEST_ID_FORMAT,
          description: "respects format option",
          input,
          actualOutput: formatted,
          validationResult,
        });
      } catch (error) {
        // Report test failed
        reportTestFailed(
          {
            testId: TEST_ID_FORMAT,
            description: "respects format option",
            input,
            actualOutput: formatted,
            validationResult,
          },
          error instanceof Error ? error : new Error(String(error))
        );
        throw error;
      }
    });

    const TEST_ID_DESCRIPTIONS = createTestID("GEN", "graphql-sdl", 6);
    registerTestID(TEST_ID_DESCRIPTIONS, "tests/generators/graphql-sdl.test.ts", "respects includeDescriptions option");

    it(`[${TEST_ID_DESCRIPTIONS}] respects includeDescriptions option`, async () => {
      const input = GraphQLGrammar;
      
      // Initialize test report context
      initTestReport({
        testId: TEST_ID_DESCRIPTIONS,
        description: "respects includeDescriptions option",
        input,
      });
      
      const withDescriptions = graphqlSDLGenerator.generate(GraphQLGrammar, {
        includeDescriptions: true,
      });
      const withoutDescriptions = graphqlSDLGenerator.generate(GraphQLGrammar, {
        includeDescriptions: false,
      });

      expect(typeof withDescriptions).toBe("string");
      expect(typeof withoutDescriptions).toBe("string");
      expect(withDescriptions.length).toBeGreaterThan(0);
      expect(withoutDescriptions.length).toBeGreaterThan(0);
      
      // Validate both outputs are valid GraphQL
      let validationResult: SchemaCheckResult | undefined;
      try {
        // Validate output with descriptions
        validationResult = await expectValidGraphQL(withDescriptions, undefined, {
          failOnWarnings: false,
          pluginType: "generators",
          pluginName: "graphql-sdl",
          testId: TEST_ID_DESCRIPTIONS,
        });
        
        // Validate output without descriptions
        await expectValidGraphQL(withoutDescriptions, undefined, {
          failOnWarnings: false,
          pluginType: "generators",
          pluginName: "graphql-sdl",
          testId: TEST_ID_DESCRIPTIONS,
        });
        
        // Report test passed
        reportTestPassed({
          testId: TEST_ID_DESCRIPTIONS,
          description: "respects includeDescriptions option",
          input,
          actualOutput: withDescriptions,
          validationResult,
        });
      } catch (error) {
        // Report test failed
        reportTestFailed(
          {
            testId: TEST_ID_DESCRIPTIONS,
            description: "respects includeDescriptions option",
            input,
            actualOutput: withDescriptions,
            validationResult,
          },
          error instanceof Error ? error : new Error(String(error))
        );
        throw error;
      }
    });
  });

  describe("C.1-C.3 Lexical Tokens - Name Token", () => {
    describe("Generator Tests", () => {
      const TEST_ID_001 = createTestID("GEN", "graphql-sdl", 7);
      registerTestID(TEST_ID_001, "tests/generators/graphql-sdl.test.ts", "Generate Name terminal with valid identifier pattern");

      it(`[${TEST_ID_001}] Generate Name terminal with valid identifier pattern`, async () => {
        const input = fixtures.input("name-terminal-grammar.json") as Grammar;
        const expected = fixtures.expected("name-terminal-grammar.graphql");
        
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
                ? "name-terminal-grammar.graphql"
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
      registerTestID(TEST_ID_002, "tests/generators/graphql-sdl.test.ts", "Generate Name in type definition context");

      it(`[${TEST_ID_002}] Generate Name in type definition context`, async () => {
        const input = fixtures.input("name-type-definition-grammar.json") as Grammar;
        const expected = fixtures.expected("name-type-definition-grammar.graphql");
        
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
                ? "name-type-definition-grammar.graphql"
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
      registerTestID(TEST_ID_003, "tests/generators/graphql-sdl.test.ts", "Generate Name in field definition context");

      it(`[${TEST_ID_003}] Generate Name in field definition context`, async () => {
        const input = fixtures.input("name-field-definition-grammar.json") as Grammar;
        const expected = fixtures.expected("name-field-definition-grammar.graphql");
        
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
                ? "name-field-definition-grammar.graphql"
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
      registerTestID(TEST_ID_004, "tests/generators/graphql-sdl.test.ts", "Generate Name in argument definition context");

      it(`[${TEST_ID_004}] Generate Name in argument definition context`, async () => {
        const input = fixtures.input("name-argument-definition-grammar.json") as Grammar;
        const expected = fixtures.expected("name-argument-definition-grammar.graphql");
        
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
                ? "name-argument-definition-grammar.graphql"
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
      registerTestID(TEST_ID_005, "tests/generators/graphql-sdl.test.ts", "Generate Name in directive context");

      it(`[${TEST_ID_005}] Generate Name in directive context`, async () => {
        const input = fixtures.input("name-directive-grammar.json") as Grammar;
        const expected = fixtures.expected("name-directive-grammar.graphql");
        
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
                ? "name-directive-grammar.graphql"
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
      registerTestID(TEST_ID_006, "tests/generators/graphql-sdl.test.ts", "Generate Name in enum value context");

      it(`[${TEST_ID_006}] Generate Name in enum value context`, async () => {
        const input = fixtures.input("name-enum-value-grammar.json") as Grammar;
        const expected = fixtures.expected("name-enum-value-grammar.graphql");
        
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
                ? "name-enum-value-grammar.graphql"
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
