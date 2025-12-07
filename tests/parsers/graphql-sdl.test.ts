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

  describe("C.1-C.3 Lexical Tokens - Name Token", () => {
    describe("Parser Tests", () => {
      const TEST_ID_001 = createTestID("PARSE", "graphql-sdl", 1);
      registerTestID(TEST_ID_001, "tests/parsers/graphql-sdl.test.ts", "Parse Name terminal with valid identifier pattern");

      it(`[${TEST_ID_001}] Parse Name terminal with valid identifier pattern`, async () => {
        const schemaSDL = fixtures.valid("name-terminal.graphql");
        let expectedGrammar;
        try {
          expectedGrammar = fixtures.expected("name-terminal-grammar.json");
        } catch {
          expectedGrammar = undefined;
        }
        
        initTestReport({
          testId: TEST_ID_001,
          description: "Parse Name terminal with valid identifier pattern",
          input: schemaSDL,
          expectedOutput: expectedGrammar,
        });
        
        const parsedGrammar = graphqlSDLParser.parse(schemaSDL);
        
        expect(parsedGrammar).toBeDefined();
        expect(parsedGrammar.root).toBe("Document");
        expect(validateGrammar(parsedGrammar)).toBe(true);

        // Generate GraphQL from parsed grammar for validation
        const generatedSDL = registry.generate(parsedGrammar, "graphql-sdl", {
          format: true,
          includeDescriptions: true,
        });

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(generatedSDL.output as string, undefined, {
            failOnWarnings: false,
            pluginType: "parsers",
            pluginName: "graphql-sdl",
            testId: TEST_ID_001,
          });
          
          reportTestPassed({
            testId: TEST_ID_001,
            description: "Parse Name terminal with valid identifier pattern",
            input: schemaSDL,
            expectedOutput: expectedGrammar,
            actualOutput: JSON.stringify(parsedGrammar, null, 2),
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_001,
              description: "Parse Name terminal with valid identifier pattern",
              input: schemaSDL,
              expectedOutput: expectedGrammar,
              actualOutput: JSON.stringify(parsedGrammar, null, 2),
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_002 = createTestID("PARSE", "graphql-sdl", 2);
      registerTestID(TEST_ID_002, "tests/parsers/graphql-sdl.test.ts", "Parse Name in type definition context");

      it(`[${TEST_ID_002}] Parse Name in type definition context`, async () => {
        const schemaSDL = fixtures.valid("name-type-definition.graphql");
        let expectedGrammar;
        try {
          expectedGrammar = fixtures.expected("name-type-definition-grammar.json");
        } catch {
          expectedGrammar = undefined;
        }
        
        initTestReport({
          testId: TEST_ID_002,
          description: "Parse Name in type definition context",
          input: schemaSDL,
          expectedOutput: expectedGrammar,
        });
        
        const parsedGrammar = graphqlSDLParser.parse(schemaSDL);
        
        expect(parsedGrammar).toBeDefined();
        expect(validateGrammar(parsedGrammar)).toBe(true);

        const generatedSDL = registry.generate(parsedGrammar, "graphql-sdl", {
          format: true,
          includeDescriptions: true,
        });

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(generatedSDL.output as string, undefined, {
            failOnWarnings: false,
            pluginType: "parsers",
            pluginName: "graphql-sdl",
            testId: TEST_ID_002,
          });
          
          reportTestPassed({
            testId: TEST_ID_002,
            description: "Parse Name in type definition context",
            input: schemaSDL,
            expectedOutput: expectedGrammar,
            actualOutput: JSON.stringify(parsedGrammar, null, 2),
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_002,
              description: "Parse Name in type definition context",
              input: schemaSDL,
              expectedOutput: expectedGrammar,
              actualOutput: JSON.stringify(parsedGrammar, null, 2),
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_003 = createTestID("PARSE", "graphql-sdl", 3);
      registerTestID(TEST_ID_003, "tests/parsers/graphql-sdl.test.ts", "Parse Name in field definition context");

      it(`[${TEST_ID_003}] Parse Name in field definition context`, async () => {
        const schemaSDL = fixtures.valid("name-field-definition.graphql");
        let expectedGrammar;
        try {
          expectedGrammar = fixtures.expected("name-field-definition-grammar.json");
        } catch {
          expectedGrammar = undefined;
        }
        
        initTestReport({
          testId: TEST_ID_003,
          description: "Parse Name in field definition context",
          input: schemaSDL,
          expectedOutput: expectedGrammar,
        });
        
        const parsedGrammar = graphqlSDLParser.parse(schemaSDL);
        
        expect(parsedGrammar).toBeDefined();
        expect(validateGrammar(parsedGrammar)).toBe(true);

        const generatedSDL = registry.generate(parsedGrammar, "graphql-sdl", {
          format: true,
          includeDescriptions: true,
        });

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(generatedSDL.output as string, undefined, {
            failOnWarnings: false,
            pluginType: "parsers",
            pluginName: "graphql-sdl",
            testId: TEST_ID_003,
          });
          
          reportTestPassed({
            testId: TEST_ID_003,
            description: "Parse Name in field definition context",
            input: schemaSDL,
            expectedOutput: expectedGrammar,
            actualOutput: JSON.stringify(parsedGrammar, null, 2),
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_003,
              description: "Parse Name in field definition context",
              input: schemaSDL,
              expectedOutput: expectedGrammar,
              actualOutput: JSON.stringify(parsedGrammar, null, 2),
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_004 = createTestID("PARSE", "graphql-sdl", 4);
      registerTestID(TEST_ID_004, "tests/parsers/graphql-sdl.test.ts", "Parse Name in argument definition context");

      it(`[${TEST_ID_004}] Parse Name in argument definition context`, async () => {
        const schemaSDL = fixtures.valid("name-argument-definition.graphql");
        let expectedGrammar;
        try {
          expectedGrammar = fixtures.expected("name-argument-definition-grammar.json");
        } catch {
          expectedGrammar = undefined;
        }
        
        initTestReport({
          testId: TEST_ID_004,
          description: "Parse Name in argument definition context",
          input: schemaSDL,
          expectedOutput: expectedGrammar,
        });
        
        const parsedGrammar = graphqlSDLParser.parse(schemaSDL);
        
        expect(parsedGrammar).toBeDefined();
        expect(validateGrammar(parsedGrammar)).toBe(true);

        const generatedSDL = registry.generate(parsedGrammar, "graphql-sdl", {
          format: true,
          includeDescriptions: true,
        });

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(generatedSDL.output as string, undefined, {
            failOnWarnings: false,
            pluginType: "parsers",
            pluginName: "graphql-sdl",
            testId: TEST_ID_004,
          });
          
          reportTestPassed({
            testId: TEST_ID_004,
            description: "Parse Name in argument definition context",
            input: schemaSDL,
            expectedOutput: expectedGrammar,
            actualOutput: JSON.stringify(parsedGrammar, null, 2),
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_004,
              description: "Parse Name in argument definition context",
              input: schemaSDL,
              expectedOutput: expectedGrammar,
              actualOutput: JSON.stringify(parsedGrammar, null, 2),
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_005 = createTestID("PARSE", "graphql-sdl", 5);
      registerTestID(TEST_ID_005, "tests/parsers/graphql-sdl.test.ts", "Parse Name in directive context");

      it(`[${TEST_ID_005}] Parse Name in directive context`, async () => {
        const schemaSDL = fixtures.valid("name-directive.graphql");
        let expectedGrammar;
        try {
          expectedGrammar = fixtures.expected("name-directive-grammar.json");
        } catch {
          expectedGrammar = undefined;
        }
        
        initTestReport({
          testId: TEST_ID_005,
          description: "Parse Name in directive context",
          input: schemaSDL,
          expectedOutput: expectedGrammar,
        });
        
        const parsedGrammar = graphqlSDLParser.parse(schemaSDL);
        
        expect(parsedGrammar).toBeDefined();
        expect(validateGrammar(parsedGrammar)).toBe(true);

        const generatedSDL = registry.generate(parsedGrammar, "graphql-sdl", {
          format: true,
          includeDescriptions: true,
        });

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(generatedSDL.output as string, undefined, {
            failOnWarnings: false,
            pluginType: "parsers",
            pluginName: "graphql-sdl",
            testId: TEST_ID_005,
          });
          
          reportTestPassed({
            testId: TEST_ID_005,
            description: "Parse Name in directive context",
            input: schemaSDL,
            expectedOutput: expectedGrammar,
            actualOutput: JSON.stringify(parsedGrammar, null, 2),
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_005,
              description: "Parse Name in directive context",
              input: schemaSDL,
              expectedOutput: expectedGrammar,
              actualOutput: JSON.stringify(parsedGrammar, null, 2),
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_006 = createTestID("PARSE", "graphql-sdl", 6);
      registerTestID(TEST_ID_006, "tests/parsers/graphql-sdl.test.ts", "Parse Name in enum value context");

      it(`[${TEST_ID_006}] Parse Name in enum value context`, async () => {
        const schemaSDL = fixtures.valid("name-enum-value.graphql");
        let expectedGrammar;
        try {
          expectedGrammar = fixtures.expected("name-enum-value-grammar.json");
        } catch {
          expectedGrammar = undefined;
        }
        
        initTestReport({
          testId: TEST_ID_006,
          description: "Parse Name in enum value context",
          input: schemaSDL,
          expectedOutput: expectedGrammar,
        });
        
        const parsedGrammar = graphqlSDLParser.parse(schemaSDL);
        
        expect(parsedGrammar).toBeDefined();
        expect(validateGrammar(parsedGrammar)).toBe(true);

        const generatedSDL = registry.generate(parsedGrammar, "graphql-sdl", {
          format: true,
          includeDescriptions: true,
        });

        let validationResult: SchemaCheckResult | undefined;
        try {
          validationResult = await expectValidGraphQL(generatedSDL.output as string, undefined, {
            failOnWarnings: false,
            pluginType: "parsers",
            pluginName: "graphql-sdl",
            testId: TEST_ID_006,
          });
          
          reportTestPassed({
            testId: TEST_ID_006,
            description: "Parse Name in enum value context",
            input: schemaSDL,
            expectedOutput: expectedGrammar,
            actualOutput: JSON.stringify(parsedGrammar, null, 2),
            validationResult,
          });
        } catch (error) {
          reportTestFailed(
            {
              testId: TEST_ID_006,
              description: "Parse Name in enum value context",
              input: schemaSDL,
              expectedOutput: expectedGrammar,
              actualOutput: JSON.stringify(parsedGrammar, null, 2),
              validationResult,
            },
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        }
      });

      const TEST_ID_007 = createTestID("PARSE", "graphql-sdl", 7);
      registerTestID(TEST_ID_007, "tests/parsers/graphql-sdl.test.ts", "Parse Name with invalid characters (should fail)");

      it(`[${TEST_ID_007}] Parse Name with invalid characters (should fail)`, async () => {
        const schemaSDL = fixtures.invalid("name-invalid-chars.graphql");
        
        initTestReport({
          testId: TEST_ID_007,
          description: "Parse Name with invalid characters (should fail)",
          input: schemaSDL,
          expectedOutput: undefined,
        });
        
        let parsedGrammar;
        let parseError: Error | undefined;
        
        try {
          parsedGrammar = graphqlSDLParser.parse(schemaSDL);
        } catch (error) {
          parseError = error instanceof Error ? error : new Error(String(error));
        }

        // Parser should handle invalid input (either throw or return error state)
        // Adjust based on your parser's error handling strategy
        expect(parseError || !parsedGrammar || !validateGrammar(parsedGrammar)).toBe(true);
        
        reportTestPassed({
          testId: TEST_ID_007,
          description: "Parse Name with invalid characters (should fail)",
          input: schemaSDL,
          expectedOutput: undefined,
          actualOutput: parseError ? parseError.message : JSON.stringify(parsedGrammar, null, 2),
        });
      });

      const TEST_ID_008 = createTestID("PARSE", "graphql-sdl", 8);
      registerTestID(TEST_ID_008, "tests/parsers/graphql-sdl.test.ts", "Parse Name starting with number (should fail)");

      it(`[${TEST_ID_008}] Parse Name starting with number (should fail)`, async () => {
        const schemaSDL = fixtures.invalid("name-starts-with-number.graphql");
        
        initTestReport({
          testId: TEST_ID_008,
          description: "Parse Name starting with number (should fail)",
          input: schemaSDL,
          expectedOutput: undefined,
        });
        
        let parsedGrammar;
        let parseError: Error | undefined;
        
        try {
          parsedGrammar = graphqlSDLParser.parse(schemaSDL);
        } catch (error) {
          parseError = error instanceof Error ? error : new Error(String(error));
        }

        // Parser should handle invalid input
        expect(parseError || !parsedGrammar || !validateGrammar(parsedGrammar)).toBe(true);
        
        reportTestPassed({
          testId: TEST_ID_008,
          description: "Parse Name starting with number (should fail)",
          input: schemaSDL,
          expectedOutput: undefined,
          actualOutput: parseError ? parseError.message : JSON.stringify(parsedGrammar, null, 2),
        });
      });
    });
  });
});

