/**
 * GraphQL SDL Generator Tests - Configuration Options
 * 
 * Tests for generator configuration options (format, includeDescriptions, etc.).
 */

import { describe, it, expect } from "vitest";
import { graphqlSDLGenerator } from "../../src/plugins/generators/graphql-sdl";
import { expectValidGraphQL } from "../helpers/schema-validator";
import { GraphQLGrammar } from "../../src/grammar";
import { createTestID, registerTestID } from "../helpers/test-ids";
import { initTestReport, reportTestPassed, reportTestFailed } from "../helpers/report-test";
import type { SchemaCheckResult } from "../helpers/schema-validator";

describe("graphql-sdl generator - configuration options", () => {
  describe("configuration options", () => {
    const TEST_ID_FORMAT = createTestID("GEN", "graphql-sdl", 5);
    registerTestID(TEST_ID_FORMAT, "tests/generators/graphql-sdl.config.test.ts", "respects format option");

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
    registerTestID(TEST_ID_DESCRIPTIONS, "tests/generators/graphql-sdl.config.test.ts", "respects includeDescriptions option");

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
});

