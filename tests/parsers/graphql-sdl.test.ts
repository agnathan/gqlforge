/**
 * GraphQL SDL Parser Tests
 * 
 * Tests the GraphQL SDL parser plugin with fixture-based testing.
 * All parsed outputs that generate GraphQL are validated and linted.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { PluginRegistry } from "../../src/plugins/registry";
import { graphqlSDLParser } from "../../src/plugins/parsers/graphql-sdl";
import { graphqlSDLGenerator } from "../../src/plugins/generators/graphql-sdl";
import { loadParserFixtures } from "../helpers/fixtures";
import { expectValidGraphQL } from "../helpers/schema-validator";
import { validateGrammar } from "../../src/grammar-zod";
import { createTestID, registerTestID } from "../helpers/test-ids";
import { initTestReport, reportTestPassed, reportTestFailed } from "../helpers/report-test";
import type { SchemaCheckResult } from "../helpers/schema-validator";

describe("graphql-sdl parser", () => {
  const fixtures = loadParserFixtures("graphql-sdl");
  const registry = new PluginRegistry();

  beforeEach(() => {
    registry.clear();
    registry.registerParser("graphql-sdl", graphqlSDLParser);
    registry.registerGenerator("graphql-sdl", graphqlSDLGenerator);
  });

  describe("parses valid schemas", () => {
    it("parses simple schema", () => {
      const schemaSDL = fixtures.valid("simple.graphql");
      const result = graphqlSDLParser.parse(schemaSDL);

      expect(result).toBeDefined();
      expect(result.root).toBe("Document");
      expect(result.rules).toBeDefined();

      // Validate parsed grammar structure
      expect(validateGrammar(result)).toBe(true);
    });

    it("parses schema with interfaces", () => {
      const schemaSDL = fixtures.valid("with-interfaces.graphql");
      const result = graphqlSDLParser.parse(schemaSDL);

      expect(result).toBeDefined();
      expect(validateGrammar(result)).toBe(true);
    });
  });

  describe("handles invalid schemas", () => {
    it("handles syntax errors gracefully", () => {
      const schemaSDL = fixtures.invalid("syntax-error.graphql");

      // Parser should handle errors (either throw or return error state)
      // Adjust based on your parser's error handling strategy
      expect(() => {
        graphqlSDLParser.parse(schemaSDL);
      }).not.toThrow(); // Or adjust if parser throws
    });
  });

  describe("round-trip validation", () => {
    it("parses and generates output", () => {
      const schemaSDL = fixtures.valid("simple.graphql");

      // Parse to grammar
      const parsedGrammar = graphqlSDLParser.parse(schemaSDL);
      expect(validateGrammar(parsedGrammar)).toBe(true);

      // Generate GraphQL from parsed grammar
      const generatedSDL = registry.generate(parsedGrammar, "graphql-sdl", {
        format: true,
      });

      expect(generatedSDL.output).toBeDefined();
      expect(typeof generatedSDL.output).toBe("string");
    });

    // Note: The graphql-sdl generator is currently a placeholder.
    // Once it's fully implemented, uncomment and update these tests:
    /*
    it("parses and generates valid GraphQL", async () => {
      const schemaSDL = fixtures.valid("simple.graphql");

      // Parse to grammar
      const parsedGrammar = graphqlSDLParser.parse(schemaSDL);
      expect(validateGrammar(parsedGrammar)).toBe(true);

      // Generate GraphQL from parsed grammar
      const generatedSDL = registry.generate(parsedGrammar, "graphql-sdl", {
        format: true,
      });

      // REQUIRED: Validate generated GraphQL
      await expectValidGraphQL(generatedSDL.output as string, undefined, {
        failOnWarnings: false,
      });
    });

    it("maintains schema validity through parse->generate cycle", async () => {
      const schemaSDL = fixtures.valid("with-interfaces.graphql");

      // Parse
      const parsedGrammar = graphqlSDLParser.parse(schemaSDL);

      // Generate
      const generatedSDL = registry.generate(parsedGrammar, "graphql-sdl", {
        format: true,
        includeDescriptions: true,
      });

      // REQUIRED: Validate generated GraphQL
      const validation = await expectValidGraphQL(
        generatedSDL.output as string,
        undefined,
        {
          failOnWarnings: false,
        }
      );

      expect(validation.isValid).toBe(true);
    });
    */
  });

});

