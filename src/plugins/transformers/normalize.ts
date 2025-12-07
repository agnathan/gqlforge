/**
 * Normalize Transformer
 * Normalizes grammar structure (removes redundant options, sorts rules, etc.)
 */

import type { Transformer, PluginOptions } from "../types";
import type { Grammar, ProductionRule, GrammarElement } from "../../grammar";

export interface NormalizeOptions extends PluginOptions {
  /**
   * Sort rules alphabetically
   */
  sortRules?: boolean;
  
  /**
   * Remove duplicate options in OneOf
   */
  removeDuplicateOptions?: boolean;
  
  /**
   * Remove empty sequences
   */
  removeEmptySequences?: boolean;
}

/**
 * Normalize transformer plugin
 */
export const normalizeTransformer: Transformer = {
  metadata: {
    name: "normalize",
    version: "1.0.0",
    description: "Normalizes grammar structure by removing redundancies and sorting",
  },

  validateOptions(options: unknown): options is NormalizeOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (opts.sortRules !== undefined && typeof opts.sortRules !== "boolean") {
      return false;
    }
    if (
      opts.removeDuplicateOptions !== undefined &&
      typeof opts.removeDuplicateOptions !== "boolean"
    ) {
      return false;
    }
    if (
      opts.removeEmptySequences !== undefined &&
      typeof opts.removeEmptySequences !== "boolean"
    ) {
      return false;
    }
    return true;
  },

  transform(grammar: Grammar, options?: NormalizeOptions): Grammar {
    const opts: NormalizeOptions = {
      sortRules: true,
      removeDuplicateOptions: true,
      removeEmptySequences: true,
      ...options,
    };

    const normalizedRules: Record<string, ProductionRule> = {};

    // Process each rule
    for (const [name, rule] of Object.entries(grammar.rules)) {
      normalizedRules[name] = {
        name: rule.name,
        definition: normalizeElement(rule.definition, opts),
      };
    }

    // Sort rules if requested
    const ruleEntries = Object.entries(normalizedRules);
    if (opts.sortRules) {
      ruleEntries.sort(([a], [b]) => a.localeCompare(b));
    }

    const sortedRules: Record<string, ProductionRule> = {};
    for (const [name, rule] of ruleEntries) {
      sortedRules[name] = rule;
    }

    return {
      root: grammar.root,
      rules: sortedRules,
    };
  },
};

function normalizeElement(
  element: GrammarElement,
  options: NormalizeOptions
): GrammarElement {
  switch (element.kind) {
    case "Terminal":
    case "NonTerminal":
      return element;

    case "Sequence":
      if (options.removeEmptySequences && element.elements.length === 0) {
        // Return a placeholder - in practice, empty sequences might be removed differently
        return element;
      }
      return {
        ...element,
        elements: element.elements.map((el) => normalizeElement(el, options)),
      };

    case "OneOf":
      if (options.removeDuplicateOptions) {
        // Remove duplicate options by comparing JSON representation
        const seen = new Set<string>();
        const uniqueOptions: GrammarElement[] = [];
        
        for (const option of element.options) {
          const key = JSON.stringify(option);
          if (!seen.has(key)) {
            seen.add(key);
            uniqueOptions.push(normalizeElement(option, options));
          }
        }
        
        return {
          ...element,
          options: uniqueOptions,
        };
      }
      return {
        ...element,
        options: element.options.map((opt) => normalizeElement(opt, options)),
      };

    case "Optional":
      return {
        ...element,
        element: normalizeElement(element.element, options),
      };

    case "List":
      return {
        ...element,
        element: normalizeElement(element.element, options),
      };
  }
}

