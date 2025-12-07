/**
 * Plugin Architecture Types
 * Defines interfaces for transformers and generators
 */

import type { Grammar } from "../grammar";

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
}

/**
 * Plugin configuration options
 */
export type PluginOptions = Record<string, unknown>;

/**
 * Transformer plugin interface
 * Transforms a Grammar (Zod schema) into another Grammar
 */
export interface Transformer {
  metadata: PluginMetadata;
  
  /**
   * Transform the grammar
   * @param grammar - The input grammar
   * @param options - Plugin-specific options
   * @returns The transformed grammar
   */
  transform(grammar: Grammar, options?: PluginOptions): Grammar;
  
  /**
   * Validate transformer options
   */
  validateOptions?: (options: unknown) => options is PluginOptions;
}

/**
 * Parser plugin interface
 * Parses input (e.g., GraphQL SDL) into a Grammar (Zod schema)
 */
export interface Parser<TInput = string> {
  metadata: PluginMetadata;
  
  /**
   * Parse input into a grammar
   * @param input - The input to parse (e.g., GraphQL SDL string)
   * @param options - Plugin-specific options
   * @returns The parsed grammar
   */
  parse(input: TInput, options?: PluginOptions): Grammar;
  
  /**
   * Validate parser options
   */
  validateOptions?: (options: unknown) => options is PluginOptions;
  
  /**
   * Get the input format name
   */
  getInputFormat?(): string;
}

/**
 * Generator plugin interface
 * Generates output from a Grammar (Zod schema)
 */
export interface Generator<T = unknown> {
  metadata: PluginMetadata;
  
  /**
   * Generate output from the grammar
   * @param grammar - The input grammar
   * @param options - Plugin-specific options
   * @returns The generated output
   */
  generate(grammar: Grammar, options?: PluginOptions): T;
  
  /**
   * Validate generator options
   */
  validateOptions?: (options: unknown) => options is PluginOptions;
  
  /**
   * Get the output format name
   */
  getOutputFormat?(): string;
}

/**
 * Plugin registration
 */
export interface PluginRegistration {
  id: string;
  plugin: Transformer | Generator | Parser;
  enabled: boolean;
  options?: PluginOptions;
}

/**
 * Transformer result with metadata
 */
export interface TransformResult {
  grammar: Grammar;
  transformer: string;
  timestamp: Date;
  options?: PluginOptions;
}

/**
 * Parser result with metadata
 */
export interface ParseResult {
  grammar: Grammar;
  parser: string;
  format?: string;
  timestamp: Date;
  options?: PluginOptions;
}

/**
 * Generator result with metadata
 */
export interface GenerateResult<T = unknown> {
  output: T;
  generator: string;
  format?: string;
  timestamp: Date;
  options?: PluginOptions;
}

/**
 * Plugin error
 */
export class PluginError extends Error {
  constructor(
    public readonly pluginId: string,
    public readonly pluginType: "transformer" | "generator" | "parser",
    message: string,
    public readonly cause?: unknown
  ) {
    super(`[${pluginType}:${pluginId}] ${message}`);
    this.name = "PluginError";
  }
}

