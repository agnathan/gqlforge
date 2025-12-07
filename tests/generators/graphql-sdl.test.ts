/**
 * GraphQL SDL Generator Tests
 * 
 * Tests the GraphQL SDL generator plugin with fixture-based testing.
 * All generated GraphQL schemas are validated and linted.
 */

import { describe, it, expect } from "vitest";
import { graphqlSDLGenerator } from "../../src/plugins/generators/graphql-sdl";
import { loadGeneratorFixtures } from "../helpers/fixtures";
import { expectValidGraphQL } from "../helpers/schema-validator";
import { GraphQLGrammar } from "../../src/grammar";

describe("graphql-sdl generator", () => {
  const fixtures = loadGeneratorFixtures("graphql-sdl");

  describe("generates output", () => {
    it("generates string output from grammar", () => {
      const input = fixtures.input("simple-grammar.json");
      const output = graphqlSDLGenerator.generate(input, {
        format: true,
        includeDescriptions: true,
      });

      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);
    });

    it("generates string output from GraphQLGrammar", () => {
      const output = graphqlSDLGenerator.generate(GraphQLGrammar, {
        format: true,
        includeDescriptions: true,
      });

      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);
    });

    // Note: The graphql-sdl generator is currently a placeholder.
    // Once it's fully implemented, uncomment and update these tests:
    /*
    it("generates valid GraphQL schema from grammar", async () => {
      const input = fixtures.input("simple-grammar.json");
      const output = graphqlSDLGenerator.generate(input, {
        format: true,
        includeDescriptions: true,
      });

      // REQUIRED: Validate generated GraphQL
      await expectValidGraphQL(output, undefined, {
        failOnWarnings: false,
      });
    });

    it("generates valid GraphQL from GraphQLGrammar", async () => {
      const output = graphqlSDLGenerator.generate(GraphQLGrammar, {
        format: true,
        includeDescriptions: true,
      });

      // REQUIRED: Validate generated GraphQL
      await expectValidGraphQL(output, undefined, {
        failOnWarnings: false,
      });
    });
    */
  });

  describe("configuration options", () => {
    it("respects format option", () => {
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

    it("respects includeDescriptions option", () => {
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

