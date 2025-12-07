/**
 * JSON Generator
 * Generates JSON representation of grammar
 */

import type { Generator, PluginOptions } from "../types";
import type { Grammar } from "../../grammar";

export interface JSONOptions extends PluginOptions {
  /**
   * Pretty print JSON
   */
  pretty?: boolean;
  
  /**
   * Include metadata
   */
  includeMetadata?: boolean;
}

/**
 * JSON generator plugin
 */
export const jsonGenerator: Generator<string> = {
  metadata: {
    name: "json",
    version: "1.0.0",
    description: "Generates JSON representation of grammar",
  },

  validateOptions(options: unknown): options is JSONOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (opts.pretty !== undefined && typeof opts.pretty !== "boolean") {
      return false;
    }
    if (
      opts.includeMetadata !== undefined &&
      typeof opts.includeMetadata !== "boolean"
    ) {
      return false;
    }
    return true;
  },

  getOutputFormat(): string {
    return "json";
  },

  generate(grammar: Grammar, options?: JSONOptions): string {
    const opts: JSONOptions = {
      pretty: true,
      includeMetadata: false,
      ...options,
    };

    const output: Record<string, unknown> = {
      root: grammar.root,
      rules: grammar.rules,
    };

    if (opts.includeMetadata) {
      (output as Record<string, unknown>).metadata = {
        generatedAt: new Date().toISOString(),
        ruleCount: Object.keys(grammar.rules).length,
      };
    }

    return opts.pretty
      ? JSON.stringify(output, null, 2)
      : JSON.stringify(output);
  },
};

