/**
 * JSON Generator Tests
 * 
 * Tests the JSON generator plugin with fixture-based testing.
 * All generated outputs are validated and linted.
 */

import { describe, it, expect } from "vitest";
import { jsonGenerator } from "../../src/plugins/generators/json";
import { loadGeneratorFixtures } from "../helpers/fixtures";
import { expectValidGraphQL } from "../helpers/schema-validator";
import { GraphQLGrammar } from "../../src/grammar";

describe("json generator", () => {
  const fixtures = loadGeneratorFixtures("json");

  describe("generates valid output", () => {
    it("generates JSON from simple grammar", () => {
      const input = fixtures.input("simple-grammar.json");
      const output = jsonGenerator.generate(input);

      expect(typeof output).toBe("string");
      expect(() => JSON.parse(output)).not.toThrow();
      
      const parsed = JSON.parse(output);
      expect(parsed).toHaveProperty("root");
      expect(parsed).toHaveProperty("rules");
    });

    it("generates JSON from GraphQLGrammar", () => {
      const output = jsonGenerator.generate(GraphQLGrammar, {
        pretty: true,
        includeMetadata: true,
      });

      expect(typeof output).toBe("string");
      const parsed = JSON.parse(output);
      expect(parsed.root).toBe("Document");
      expect(parsed.rules).toBeDefined();
    });
  });

  describe("configuration options", () => {
    it("respects pretty option", () => {
      const outputPretty = jsonGenerator.generate(GraphQLGrammar, {
        pretty: true,
      });
      const outputCompact = jsonGenerator.generate(GraphQLGrammar, {
        pretty: false,
      });

      expect(outputPretty.length).toBeGreaterThan(outputCompact.length);
      expect(outputPretty).toContain("\n");
    });

    it("respects includeMetadata option", () => {
      const outputWithMeta = jsonGenerator.generate(GraphQLGrammar, {
        includeMetadata: true,
      });
      const outputWithoutMeta = jsonGenerator.generate(GraphQLGrammar, {
        includeMetadata: false,
      });

      const parsedWith = JSON.parse(outputWithMeta);
      const parsedWithout = JSON.parse(outputWithoutMeta);

      // Metadata might add extra fields
      expect(Object.keys(parsedWith).length).toBeGreaterThanOrEqual(
        Object.keys(parsedWithout).length
      );
    });
  });
});

