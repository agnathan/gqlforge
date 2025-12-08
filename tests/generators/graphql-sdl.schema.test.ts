/**
 * GraphQL SDL Generator Tests - 3.3 Schema Definition
 * 
 * Tests for Schema Definition generation (section 3.3 of GraphQL spec).
 */

import { describe, it, expect } from "vitest";
import { graphqlSDLGenerator } from "../../src/plugins/generators/graphql-sdl";
import { loadGeneratorFixtures } from "../helpers/fixtures";
import { expectValidGraphQL } from "../helpers/schema-validator";
import type { Grammar } from "../../src/grammar";
import { createTestID, registerTestID } from "../helpers/test-ids";
import { initTestReport, reportTestPassed, reportTestFailed } from "../helpers/report-test";
import type { SchemaCheckResult } from "../helpers/schema-validator";

describe("graphql-sdl generator - 3.3 Schema Definition", () => {
  const fixtures = loadGeneratorFixtures("graphql-sdl");

  describe("3.3 Schema Definition", () => {
    const TEST_ID = createTestID("GEN", "graphql-sdl", 1);
    registerTestID(TEST_ID, "tests/generators/graphql-sdl.schema.test.ts", "generates schema definition with root operation types");

    it(`[${TEST_ID}] generates schema definition with root operation types`, async () => {
      const input = fixtures.input("GEN-GSDL-001-generates-schema-definition-with-root-operation-types-grammar.json") as Grammar;
      const expected = fixtures.expected("GEN-GSDL-001-generates-schema-definition-with-root-operation-types-grammar.graphql");
      
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
                ? "GEN-GSDL-001-generates-schema-definition-with-root-operation-types-grammar.graphql"
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
});

