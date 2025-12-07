/**
 * GraphQL SDL Generator
 * Generates GraphQL Schema Definition Language from grammar
 */

import type { Generator, PluginOptions } from "../types";
import type { Grammar, GrammarElement } from "../../grammar";

export interface GraphQLSDLOptions extends PluginOptions {
  /**
   * Include comments/descriptions
   */
  includeDescriptions?: boolean;
  
  /**
   * Format output with indentation
   */
  format?: boolean;
  
  /**
   * Indentation size
   */
  indentSize?: number;
}

/**
 * GraphQL SDL generator plugin
 */
export const graphqlSDLGenerator: Generator<string> = {
  metadata: {
    name: "graphql-sdl",
    version: "1.0.0",
    description: "Generates GraphQL Schema Definition Language from grammar",
  },

  validateOptions(options: unknown): options is GraphQLSDLOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (
      opts.includeDescriptions !== undefined &&
      typeof opts.includeDescriptions !== "boolean"
    ) {
      return false;
    }
    if (opts.format !== undefined && typeof opts.format !== "boolean") {
      return false;
    }
    if (
      opts.indentSize !== undefined &&
      (typeof opts.indentSize !== "number" || opts.indentSize < 0)
    ) {
      return false;
    }
    return true;
  },

  getOutputFormat(): string {
    return "graphql";
  },

  generate(grammar: Grammar, options?: GraphQLSDLOptions): string {
    const opts: GraphQLSDLOptions = {
      includeDescriptions: true,
      format: true,
      indentSize: 2,
      ...options,
    };

    const indent = opts.format ? " ".repeat(opts.indentSize ?? 2) : "";
    const lines: string[] = [];

    // Generate schema definition if present
    if (grammar.rules.SchemaDefinition) {
      lines.push("schema {");
      if (opts.format) {
        lines.push(`${indent}query: Query`);
        lines.push(`${indent}mutation: Mutation`);
        lines.push(`${indent}subscription: Subscription`);
      }
      lines.push("}");
      lines.push("");
    }

    // Generate type definitions
    const typeDefinitions = [
      "ScalarTypeDefinition",
      "ObjectTypeDefinition",
      "InterfaceTypeDefinition",
      "UnionTypeDefinition",
      "EnumTypeDefinition",
      "InputObjectTypeDefinition",
    ];

    for (const typeDef of typeDefinitions) {
      const rule = grammar.rules[typeDef];
      if (rule) {
        const sdl = generateTypeDefinition(rule, indent, opts);
        if (sdl) {
          lines.push(sdl);
          lines.push("");
        }
      }
    }

    return lines.join(opts.format ? "\n" : " ");
  },
};

function generateTypeDefinition(
  rule: { name: string; definition: GrammarElement },
  _indent: string,
  _options: GraphQLSDLOptions
): string {
  // Simplified SDL generation - in a real implementation,
  // this would parse the grammar structure more deeply
  return `# ${rule.name} type definition\n# Generated from grammar rule`;
}

