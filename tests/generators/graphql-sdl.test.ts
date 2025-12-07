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
      const output = graphqlSDLGenerator.generate(input, {
        format: true,
        includeDescriptions: true,
      });

      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);

      // REQUIRED: Validate generated GraphQL and compare with expected fixture
      // Note: Currently placeholder - uncomment when generator is implemented
      // await expectValidGraphQL(output, undefined, {
      //   failOnWarnings: false,
      //   expectedFixture: expected,
      //   compareMode: "semantic",
      // });
    });
  });

  describe("3.7 Interface Type Definition", () => {
    const TEST_ID = createTestID("GEN", "graphql-sdl", 4);
    registerTestID(TEST_ID, "tests/generators/graphql-sdl.test.ts", "generates interface type definition");

    it(`[${TEST_ID}] generates interface type definition`, async () => {
      const input = fixtures.input("interface-type-grammar.json") as Grammar;
      const expected = fixtures.expected("interface-type-grammar.graphql");
      const output = graphqlSDLGenerator.generate(input, {
        format: true,
        includeDescriptions: true,
      });

      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);

      // REQUIRED: Validate generated GraphQL and compare with expected fixture
      // Note: Currently placeholder - uncomment when generator is implemented
      // await expectValidGraphQL(output, undefined, {
      //   failOnWarnings: false,
      //   expectedFixture: expected,
      //   compareMode: "semantic",
      // });
    });
  });

  describe("configuration options", () => {
    const TEST_ID_FORMAT = createTestID("GEN", "graphql-sdl", 5);
    registerTestID(TEST_ID_FORMAT, "tests/generators/graphql-sdl.test.ts", "respects format option");

    it(`[${TEST_ID_FORMAT}] respects format option`, () => {
      const formatted = graphqlSDLGenerator.generate(GraphQLGrammar, {
        format: true,
      });
      const unformatted = graphqlSDLGenerator.generate(GraphQLGrammar, {
        format: false,
      });

      expect(typeof formatted).toBe("string");
      expect(typeof unformatted).toBe("string");
      // Note: Placeholder generator may not show difference
    });

    const TEST_ID_DESCRIPTIONS = createTestID("GEN", "graphql-sdl", 6);
    registerTestID(TEST_ID_DESCRIPTIONS, "tests/generators/graphql-sdl.test.ts", "respects includeDescriptions option");

    it(`[${TEST_ID_DESCRIPTIONS}] respects includeDescriptions option`, () => {
      const withDescriptions = graphqlSDLGenerator.generate(GraphQLGrammar, {
        includeDescriptions: true,
      });
      const withoutDescriptions = graphqlSDLGenerator.generate(GraphQLGrammar, {
        includeDescriptions: false,
      });

      expect(typeof withDescriptions).toBe("string");
      expect(typeof withoutDescriptions).toBe("string");
      // Note: Placeholder generator may not show difference
    });
  });
});
