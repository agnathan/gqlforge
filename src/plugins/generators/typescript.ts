/**
 * TypeScript Generator
 * Generates TypeScript type definitions from grammar
 */

import type { Generator, PluginOptions } from "../types";
import type { Grammar, GrammarElement } from "../../grammar";

export interface TypeScriptOptions extends PluginOptions {
  /**
   * Export types
   */
  exportTypes?: boolean;
  
  /**
   * Include JSDoc comments
   */
  includeComments?: boolean;
  
  /**
   * Format output
   */
  format?: boolean;
}

/**
 * TypeScript generator plugin
 */
export const typescriptGenerator: Generator<string> = {
  metadata: {
    name: "typescript",
    version: "1.0.0",
    description: "Generates TypeScript type definitions from grammar",
  },

  validateOptions(options: unknown): options is TypeScriptOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (
      opts.exportTypes !== undefined &&
      typeof opts.exportTypes !== "boolean"
    ) {
      return false;
    }
    if (
      opts.includeComments !== undefined &&
      typeof opts.includeComments !== "boolean"
    ) {
      return false;
    }
    if (opts.format !== undefined && typeof opts.format !== "boolean") {
      return false;
    }
    return true;
  },

  getOutputFormat(): string {
    return "typescript";
  },

  generate(grammar: Grammar, options?: TypeScriptOptions): string {
    const opts: TypeScriptOptions = {
      exportTypes: true,
      includeComments: true,
      format: true,
      ...options,
    };

    const lines: string[] = [];
    
    if (opts.includeComments) {
      lines.push("/**");
      lines.push(" * Generated TypeScript types from GraphQL Grammar");
      lines.push(" */");
      lines.push("");
    }

    // Generate type definitions for each rule
    for (const [name, rule] of Object.entries(grammar.rules)) {
      const typeDef = generateTypeDefinition(name, rule, opts);
      if (typeDef) {
        lines.push(typeDef);
        lines.push("");
      }
    }

    return lines.join("\n");
  },
};

function generateTypeDefinition(
  name: string,
  rule: { name: string; definition: GrammarElement },
  options: TypeScriptOptions
): string {
  const exportKeyword = options.exportTypes ? "export " : "";
  const comment = options.includeComments
    ? `/**\n * ${rule.name} grammar rule\n */\n`
    : "";
  
  return `${comment}${exportKeyword}type ${name} = GrammarElement;`;
}

