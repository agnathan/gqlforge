/**
 * Add Description Transformer
 * Simple transformer that adds a metadata field to track transformations
 * This is the simplest possible transformer - it just adds a note without changing structure
 */

import type { Transformer, PluginOptions } from "../types";
import type { Grammar, ProductionRule } from "../../grammar";

export interface AddDescriptionOptions extends PluginOptions {
  /**
   * Description text to add (stored as metadata, not in grammar structure)
   */
  description?: string;
  
  /**
   * Only transform specific rule names (if provided)
   */
  ruleNames?: string[];
}

/**
 * Simple transformer - adds a note by wrapping rules in a sequence
 * This demonstrates the simplest possible transformation
 */
export const addDescriptionTransformer: Transformer = {
  metadata: {
    name: "add-description",
    version: "1.0.0",
    description: "Simple transformer that demonstrates basic transformation",
  },

  validateOptions(options: unknown): options is AddDescriptionOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (
      opts.description !== undefined &&
      typeof opts.description !== "string"
    ) {
      return false;
    }
    if (
      opts.ruleNames !== undefined &&
      !Array.isArray(opts.ruleNames)
    ) {
      return false;
    }
    return true;
  },

  transform(grammar: Grammar, options?: AddDescriptionOptions): Grammar {
    const opts: AddDescriptionOptions = {
      description: "Transformed by add-description transformer",
      ...options,
    };

    const transformedRules: Record<string, ProductionRule> = {};

    for (const [ruleName, rule] of Object.entries(grammar.rules)) {
      // If ruleNames specified, only transform those rules
      if (opts.ruleNames && !opts.ruleNames.includes(ruleName)) {
        transformedRules[ruleName] = rule;
        continue;
      }

      // Simple transformation: wrap the definition in a sequence with an optional description
      // This is the simplest meaningful transformation
      transformedRules[ruleName] = {
        name: rule.name,
        definition: {
          kind: "Sequence",
          elements: [
            {
              kind: "Optional",
              element: {
                kind: "NonTerminal",
                name: "Description",
              },
            },
            rule.definition,
          ],
        },
      };
    }

    return {
      root: grammar.root,
      rules: transformedRules,
    };
  },
};

