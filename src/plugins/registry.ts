/**
 * Plugin Registry
 * Manages registration and execution of transformers and generators
 */

import type {
  Transformer,
  Generator,
  Parser,
  PluginRegistration,
  PluginOptions,
  TransformResult,
  GenerateResult,
  ParseResult,
} from "./types";
import { PluginError } from "./types";

export { PluginError };
import type { Grammar } from "../grammar";

/**
 * Plugin registry for managing transformers, generators, and parsers
 */
export class PluginRegistry {
  private transformers: Map<string, PluginRegistration> = new Map();
  private generators: Map<string, PluginRegistration> = new Map();
  private parsers: Map<string, PluginRegistration> = new Map();

  /**
   * Register a transformer plugin
   */
  registerTransformer(
    id: string,
    transformer: Transformer,
    options?: PluginOptions
  ): void {
    if (this.transformers.has(id)) {
      throw new Error(`Transformer with id "${id}" is already registered`);
    }

    this.transformers.set(id, {
      id,
      plugin: transformer,
      enabled: true,
      options,
    });
  }

  /**
   * Register a generator plugin
   */
  registerGenerator(
    id: string,
    generator: Generator,
    options?: PluginOptions
  ): void {
    if (this.generators.has(id)) {
      throw new Error(`Generator with id "${id}" is already registered`);
    }

    this.generators.set(id, {
      id,
      plugin: generator,
      enabled: true,
      options,
    });
  }

  /**
   * Register a parser plugin
   */
  registerParser(
    id: string,
    parser: Parser,
    options?: PluginOptions
  ): void {
    if (this.parsers.has(id)) {
      throw new Error(`Parser with id "${id}" is already registered`);
    }

    this.parsers.set(id, {
      id,
      plugin: parser,
      enabled: true,
      options,
    });
  }

  /**
   * Get a transformer by ID
   */
  getTransformer(id: string): Transformer | undefined {
    const registration = this.transformers.get(id);
    if (!registration || !registration.enabled) {
      return undefined;
    }
    return registration.plugin as Transformer;
  }

  /**
   * Get a generator by ID
   */
  getGenerator(id: string): Generator | undefined {
    const registration = this.generators.get(id);
    if (!registration || !registration.enabled) {
      return undefined;
    }
    return registration.plugin as Generator;
  }

  /**
   * Get a parser by ID
   */
  getParser(id: string): Parser | undefined {
    const registration = this.parsers.get(id);
    if (!registration || !registration.enabled) {
      return undefined;
    }
    return registration.plugin as Parser;
  }

  /**
   * List all registered transformers
   */
  listTransformers(): Array<{ id: string; metadata: Transformer["metadata"] }> {
    return Array.from(this.transformers.values())
      .filter((reg) => reg.enabled)
      .map((reg) => ({
        id: reg.id,
        metadata: (reg.plugin as Transformer).metadata,
      }));
  }

  /**
   * List all registered generators
   */
  listGenerators(): Array<{ id: string; metadata: Generator["metadata"] }> {
    return Array.from(this.generators.values())
      .filter((reg) => reg.enabled)
      .map((reg) => ({
        id: reg.id,
        metadata: (reg.plugin as Generator).metadata,
      }));
  }

  /**
   * List all registered parsers
   */
  listParsers(): Array<{ id: string; metadata: Parser["metadata"] }> {
    return Array.from(this.parsers.values())
      .filter((reg) => reg.enabled)
      .map((reg) => ({
        id: reg.id,
        metadata: (reg.plugin as Parser).metadata,
      }));
  }

  /**
   * Enable or disable a plugin
   */
  setPluginEnabled(
    id: string,
    type: "transformer" | "generator" | "parser",
    enabled: boolean
  ): void {
    const map =
      type === "transformer"
        ? this.transformers
        : type === "generator"
        ? this.generators
        : this.parsers;
    const registration = map.get(id);
    if (!registration) {
      throw new Error(`Plugin "${id}" of type "${type}" not found`);
    }
    registration.enabled = enabled;
  }

  /**
   * Update plugin options
   */
  updatePluginOptions(
    id: string,
    type: "transformer" | "generator" | "parser",
    options: PluginOptions
  ): void {
    const map =
      type === "transformer"
        ? this.transformers
        : type === "generator"
        ? this.generators
        : this.parsers;
    const registration = map.get(id);
    if (!registration) {
      throw new Error(`Plugin "${id}" of type "${type}" not found`);
    }
    registration.options = options;
  }

  /**
   * Execute a transformer pipeline
   * @param grammar - Input grammar
   * @param transformerIds - IDs of transformers to apply in order
   * @param options - Override options for specific transformers
   * @returns Result with transformed grammar
   */
  transform(
    grammar: Grammar,
    transformerIds: string[],
    options?: Record<string, PluginOptions>
  ): TransformResult {
    let currentGrammar = grammar;
    const appliedTransformers: string[] = [];

    for (const id of transformerIds) {
      const transformer = this.getTransformer(id);
      if (!transformer) {
        throw new PluginError(
          id,
          "transformer",
          `Transformer not found or disabled`
        );
      }

      try {
        const pluginOptions = options?.[id] ?? this.transformers.get(id)?.options;
        
        // Validate options if validator provided
        if (transformer.validateOptions && pluginOptions) {
          if (!transformer.validateOptions(pluginOptions)) {
            throw new PluginError(
              id,
              "transformer",
              "Invalid options provided"
            );
          }
        }

        currentGrammar = transformer.transform(currentGrammar, pluginOptions);
        appliedTransformers.push(id);
      } catch (error) {
        throw new PluginError(
          id,
          "transformer",
          `Transformation failed: ${error instanceof Error ? error.message : String(error)}`,
          error
        );
      }
    }

    return {
      grammar: currentGrammar,
      transformer: appliedTransformers.join(" -> "),
      timestamp: new Date(),
      options: options,
    };
  }

  /**
   * Execute a generator
   * @param grammar - Input grammar
   * @param generatorId - ID of generator to use
   * @param options - Generator-specific options
   * @returns Result with generated output
   */
  generate<T = unknown>(
    grammar: Grammar,
    generatorId: string,
    options?: PluginOptions
  ): GenerateResult<T> {
    const generator = this.getGenerator(generatorId);
    if (!generator) {
      throw new PluginError(
        generatorId,
        "generator",
        `Generator not found or disabled`
      );
    }

    try {
      const pluginOptions = options ?? this.generators.get(generatorId)?.options;
      
      // Validate options if validator provided
      if (generator.validateOptions && pluginOptions) {
        if (!generator.validateOptions(pluginOptions)) {
          throw new PluginError(
            generatorId,
            "generator",
            "Invalid options provided"
          );
        }
      }

      const output = generator.generate(grammar, pluginOptions) as T;
      
      return {
        output,
        generator: generatorId,
        format: generator.getOutputFormat?.(),
        timestamp: new Date(),
        options: pluginOptions,
      };
    } catch (error) {
      throw new PluginError(
        generatorId,
        "generator",
        `Generation failed: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
    }
  }

  /**
   * Execute a parser
   * @param input - Input to parse (e.g., GraphQL SDL string)
   * @param parserId - ID of parser to use
   * @param options - Parser-specific options
   * @returns Result with parsed grammar
   */
  parse<TInput extends string = string>(
    input: TInput,
    parserId: string,
    options?: PluginOptions
  ): ParseResult {
    const parser = this.getParser(parserId);
    if (!parser) {
      throw new PluginError(
        parserId,
        "parser",
        `Parser not found or disabled`
      );
    }

    try {
      const pluginOptions = options ?? this.parsers.get(parserId)?.options;
      
      // Validate options if validator provided
      if (parser.validateOptions && pluginOptions) {
        if (!parser.validateOptions(pluginOptions)) {
          throw new PluginError(
            parserId,
            "parser",
            "Invalid options provided"
          );
        }
      }

      const grammar = parser.parse(input as string, pluginOptions);
      
      return {
        grammar,
        parser: parserId,
        format: parser.getInputFormat?.(),
        timestamp: new Date(),
        options: pluginOptions,
      };
    } catch (error) {
      throw new PluginError(
        parserId,
        "parser",
        `Parsing failed: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
    }
  }

  /**
   * Clear all registered plugins
   */
  clear(): void {
    this.transformers.clear();
    this.generators.clear();
    this.parsers.clear();
  }
}

/**
 * Default plugin registry instance
 */
export const defaultRegistry = new PluginRegistry();

