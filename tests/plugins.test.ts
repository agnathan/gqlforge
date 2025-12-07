/**
 * Plugin Architecture Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  PluginRegistry,
  defaultRegistry,
} from "../src/plugins/registry";
import { PluginError } from "../src/plugins/types";
import {
  graphqlSDLParser,
  type GraphQLSDLParserOptions,
} from "../src/plugins/parsers/graphql-sdl";
import {
  normalizeTransformer,
  type NormalizeOptions,
} from "../src/plugins/transformers/normalize";
import {
  simplifyTransformer,
  type SimplifyOptions,
} from "../src/plugins/transformers/simplify";
import {
  validateTransformer,
  type ValidateOptions,
} from "../src/plugins/transformers/validate";
import {
  jsonGenerator,
  type JSONOptions,
} from "../src/plugins/generators/json";
import {
  typescriptGenerator,
  type TypeScriptOptions,
} from "../src/plugins/generators/typescript";
import {
  graphqlSDLGenerator,
  type GraphQLSDLOptions,
} from "../src/plugins/generators/graphql-sdl";
import { GraphQLGrammar } from "../src/grammar";
import type { Grammar } from "../src/grammar";

describe("Plugin Architecture", () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = new PluginRegistry();
  });

  describe("PluginRegistry", () => {
    describe("Transformer Registration", () => {
      it("should register a transformer", () => {
        registry.registerTransformer("normalize", normalizeTransformer);
        expect(registry.getTransformer("normalize")).toBe(normalizeTransformer);
      });

      it("should throw when registering duplicate transformer", () => {
        registry.registerTransformer("normalize", normalizeTransformer);
        expect(() => {
          registry.registerTransformer("normalize", normalizeTransformer);
        }).toThrow('Transformer with id "normalize" is already registered');
      });

      it("should list registered transformers", () => {
        registry.registerTransformer("normalize", normalizeTransformer);
        registry.registerTransformer("simplify", simplifyTransformer);

        const transformers = registry.listTransformers();
        expect(transformers).toHaveLength(2);
        expect(transformers.map((t) => t.id)).toContain("normalize");
        expect(transformers.map((t) => t.id)).toContain("simplify");
      });

      it("should enable/disable transformers", () => {
        registry.registerTransformer("normalize", normalizeTransformer);
        registry.setPluginEnabled("normalize", "transformer", false);
        expect(registry.getTransformer("normalize")).toBeUndefined();

        registry.setPluginEnabled("normalize", "transformer", true);
        expect(registry.getTransformer("normalize")).toBe(normalizeTransformer);
      });
    });

    describe("Generator Registration", () => {
      it("should register a generator", () => {
        registry.registerGenerator("json", jsonGenerator);
        expect(registry.getGenerator("json")).toBe(jsonGenerator);
      });

      it("should throw when registering duplicate generator", () => {
        registry.registerGenerator("json", jsonGenerator);
        expect(() => {
          registry.registerGenerator("json", jsonGenerator);
        }).toThrow('Generator with id "json" is already registered');
      });

      it("should list registered generators", () => {
        registry.registerGenerator("json", jsonGenerator);
        registry.registerGenerator("typescript", typescriptGenerator);

        const generators = registry.listGenerators();
        expect(generators).toHaveLength(2);
        expect(generators.map((g) => g.id)).toContain("json");
        expect(generators.map((g) => g.id)).toContain("typescript");
      });
    });

    describe("Parser Registration", () => {
      it("should register a parser", () => {
        registry.registerParser("graphql-sdl", graphqlSDLParser);
        expect(registry.getParser("graphql-sdl")).toBe(graphqlSDLParser);
      });

      it("should throw when registering duplicate parser", () => {
        registry.registerParser("graphql-sdl", graphqlSDLParser);
        expect(() => {
          registry.registerParser("graphql-sdl", graphqlSDLParser);
        }).toThrow('Parser with id "graphql-sdl" is already registered');
      });

      it("should list registered parsers", () => {
        registry.registerParser("graphql-sdl", graphqlSDLParser);

        const parsers = registry.listParsers();
        expect(parsers).toHaveLength(1);
        expect(parsers.map((p) => p.id)).toContain("graphql-sdl");
      });

      it("should enable/disable parsers", () => {
        registry.registerParser("graphql-sdl", graphqlSDLParser);
        registry.setPluginEnabled("graphql-sdl", "parser", false);
        expect(registry.getParser("graphql-sdl")).toBeUndefined();

        registry.setPluginEnabled("graphql-sdl", "parser", true);
        expect(registry.getParser("graphql-sdl")).toBe(graphqlSDLParser);
      });
    });

    describe("Transformer Pipeline", () => {
      beforeEach(() => {
        registry.registerTransformer("normalize", normalizeTransformer);
        registry.registerTransformer("simplify", simplifyTransformer);
      });

      it("should execute transformer pipeline", () => {
        const result = registry.transform(GraphQLGrammar, ["normalize"]);
        expect(result.grammar).toBeDefined();
        expect(result.transformer).toBe("normalize");
        expect(result.timestamp).toBeInstanceOf(Date);
      });

      it("should execute multiple transformers in order", () => {
        const result = registry.transform(GraphQLGrammar, [
          "normalize",
          "simplify",
        ]);
        expect(result.transformer).toBe("normalize -> simplify");
      });

      it("should pass options to transformers", () => {
        const options: NormalizeOptions = {
          sortRules: false,
        };
        const result = registry.transform(GraphQLGrammar, ["normalize"], {
          normalize: options,
        });
        expect(result.options).toBeDefined();
      });

      it("should throw PluginError when transformer not found", () => {
        expect(() => {
          registry.transform(GraphQLGrammar, ["nonexistent"]);
        }).toThrow(PluginError);
      });
    });

    describe("Generator Execution", () => {
      beforeEach(() => {
        registry.registerGenerator("json", jsonGenerator);
        registry.registerGenerator("typescript", typescriptGenerator);
      });

      it("should execute generator", () => {
        const result = registry.generate(GraphQLGrammar, "json");
        expect(result.output).toBeDefined();
        expect(result.generator).toBe("json");
        expect(result.format).toBe("json");
        expect(result.timestamp).toBeInstanceOf(Date);
      });

      it("should pass options to generator", () => {
        const options: JSONOptions = {
          pretty: false,
        };
        const result = registry.generate(GraphQLGrammar, "json", options);
        expect(result.options).toBe(options);
      });

      it("should throw PluginError when generator not found", () => {
        expect(() => {
          registry.generate(GraphQLGrammar, "nonexistent");
        }).toThrow(PluginError);
      });
    });

    describe("Parser Execution", () => {
      beforeEach(() => {
        registry.registerParser("graphql-sdl", graphqlSDLParser);
      });

      it("should execute parser", () => {
        const sdl = "type User { id: ID! }";
        const result = registry.parse(sdl, "graphql-sdl");
        expect(result.grammar).toBeDefined();
        expect(result.parser).toBe("graphql-sdl");
        expect(result.format).toBe("graphql");
        expect(result.timestamp).toBeInstanceOf(Date);
      });

      it("should pass options to parser", () => {
        const options: GraphQLSDLParserOptions = {
          strict: false,
        };
        const result = registry.parse("type User { id: ID! }", "graphql-sdl", options);
        expect(result.options).toBe(options);
      });

      it("should throw PluginError when parser not found", () => {
        expect(() => {
          registry.parse("type User { id: ID! }", "nonexistent");
        }).toThrow(PluginError);
      });
    });
  });

  describe("Built-in Transformers", () => {
    describe("normalizeTransformer", () => {
      it("should normalize grammar", () => {
        const result = normalizeTransformer.transform(GraphQLGrammar);
        expect(result).toBeDefined();
        expect(result.root).toBe(GraphQLGrammar.root);
      });

      it("should validate options", () => {
        const validOptions: NormalizeOptions = {
          sortRules: true,
          removeDuplicateOptions: false,
        };
        expect(
          normalizeTransformer.validateOptions?.(validOptions)
        ).toBe(true);

        const invalidOptions = { sortRules: "invalid" };
        expect(
          normalizeTransformer.validateOptions?.(invalidOptions)
        ).toBe(false);
      });
    });

    describe("simplifyTransformer", () => {
      it("should simplify grammar", () => {
        const result = simplifyTransformer.transform(GraphQLGrammar);
        expect(result).toBeDefined();
        expect(result.root).toBe(GraphQLGrammar.root);
      });

      it("should validate options", () => {
        const validOptions: SimplifyOptions = {
          flattenSequences: true,
        };
        expect(simplifyTransformer.validateOptions?.(validOptions)).toBe(true);
      });
    });

    describe("validateTransformer", () => {
      it("should validate grammar without throwing", () => {
        const result = validateTransformer.transform(GraphQLGrammar, {
          throwOnError: false,
        });
        expect(result).toBeDefined();
      });

      it("should throw on validation error when configured", () => {
        const invalidGrammar: Grammar = {
          root: "Nonexistent",
          rules: {},
        };

        expect(() => {
          validateTransformer.transform(invalidGrammar, {
            throwOnError: true,
          });
        }).toThrow();
      });
    });
  });

  describe("Built-in Parsers", () => {
    describe("graphqlSDLParser", () => {
      it("should parse GraphQL SDL", () => {
        const sdl = "type User { id: ID! }";
        const result = graphqlSDLParser.parse(sdl);
        expect(result).toBeDefined();
        expect(result.root).toBe("Document");
      });

      it("should validate options", () => {
        const validOptions: GraphQLSDLParserOptions = {
          strict: true,
          preserveComments: false,
        };
        expect(graphqlSDLParser.validateOptions?.(validOptions)).toBe(true);

        const invalidOptions = { strict: "invalid" };
        expect(graphqlSDLParser.validateOptions?.(invalidOptions)).toBe(false);
      });

      it("should return input format", () => {
        expect(graphqlSDLParser.getInputFormat?.()).toBe("graphql");
      });
    });
  });

  describe("Built-in Generators", () => {
    describe("jsonGenerator", () => {
      it("should generate JSON output", () => {
        const result = jsonGenerator.generate(GraphQLGrammar);
        expect(typeof result).toBe("string");
        expect(() => JSON.parse(result)).not.toThrow();
      });

      it("should generate pretty JSON", () => {
        const result = jsonGenerator.generate(GraphQLGrammar, {
          pretty: true,
        });
        expect(result).toContain("\n");
      });

      it("should include metadata when requested", () => {
        const result = jsonGenerator.generate(GraphQLGrammar, {
          includeMetadata: true,
        });
        const parsed = JSON.parse(result);
        expect(parsed.metadata).toBeDefined();
      });
    });

    describe("typescriptGenerator", () => {
      it("should generate TypeScript output", () => {
        const result = typescriptGenerator.generate(GraphQLGrammar);
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
      });

      it("should include comments when requested", () => {
        const result = typescriptGenerator.generate(GraphQLGrammar, {
          includeComments: true,
        });
        expect(result).toContain("/**");
      });
    });

    describe("graphqlSDLGenerator", () => {
      it("should generate GraphQL SDL output", () => {
        const result = graphqlSDLGenerator.generate(GraphQLGrammar);
        expect(typeof result).toBe("string");
        expect(graphqlSDLGenerator.getOutputFormat?.()).toBe("graphql");
      });
    });
  });

  describe("PluginError", () => {
    it("should create error with plugin information", () => {
      const error = new PluginError(
        "test-plugin",
        "transformer",
        "Test error"
      );
      expect(error.pluginId).toBe("test-plugin");
      expect(error.pluginType).toBe("transformer");
      expect(error.message).toContain("test-plugin");
      expect(error.name).toBe("PluginError");
    });

    it("should include cause", () => {
      const cause = new Error("Original error");
      const error = new PluginError(
        "test-plugin",
        "generator",
        "Wrapped error",
        cause
      );
      expect(error.cause).toBe(cause);
    });
  });

  describe("Default Registry", () => {
    it("should have default registry instance", () => {
      expect(defaultRegistry).toBeInstanceOf(PluginRegistry);
    });

    it("should allow registering plugins on default registry", () => {
      defaultRegistry.registerTransformer("test-normalize", normalizeTransformer);
      expect(defaultRegistry.getTransformer("test-normalize")).toBe(
        normalizeTransformer
      );
      defaultRegistry.clear();
    });
  });
});

