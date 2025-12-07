/**
 * Simplify Transformer
 * Simplifies grammar structure (flattens nested structures, removes unnecessary wrappers)
 */

import type { Transformer, PluginOptions } from "../types";
import type { Grammar, ProductionRule, GrammarElement } from "../../grammar";

export interface SimplifyOptions extends PluginOptions {
  /**
   * Flatten nested sequences
   */
  flattenSequences?: boolean;
  
  /**
   * Remove single-element sequences
   */
  removeSingleElementSequences?: boolean;
  
  /**
   * Remove single-option OneOf
   */
  removeSingleOptionOneOf?: boolean;
}

/**
 * Simplify transformer plugin
 */
export const simplifyTransformer: Transformer = {
  metadata: {
    name: "simplify",
    version: "1.0.0",
    description: "Simplifies grammar structure by removing unnecessary nesting",
  },

  validateOptions(options: unknown): options is SimplifyOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (
      opts.flattenSequences !== undefined &&
      typeof opts.flattenSequences !== "boolean"
    ) {
      return false;
    }
    if (
      opts.removeSingleElementSequences !== undefined &&
      typeof opts.removeSingleElementSequences !== "boolean"
    ) {
      return false;
    }
    if (
      opts.removeSingleOptionOneOf !== undefined &&
      typeof opts.removeSingleOptionOneOf !== "boolean"
    ) {
      return false;
    }
    return true;
  },

  transform(grammar: Grammar, options?: SimplifyOptions): Grammar {
    const opts: SimplifyOptions = {
      flattenSequences: true,
      removeSingleElementSequences: true,
      removeSingleOptionOneOf: true,
      ...options,
    };

    const simplifiedRules: Record<string, ProductionRule> = {};

    for (const [name, rule] of Object.entries(grammar.rules)) {
      simplifiedRules[name] = {
        name: rule.name,
        definition: simplifyElement(rule.definition, opts),
      };
    }

    return {
      root: grammar.root,
      rules: simplifiedRules,
    };
  },
};

function simplifyElement(
  element: GrammarElement,
  options: SimplifyOptions
): GrammarElement {
  switch (element.kind) {
    case "Terminal":
    case "NonTerminal":
      return element;

    case "Sequence":
      let elements = element.elements.map((el) => simplifyElement(el, options));

      // Flatten nested sequences
      if (options.flattenSequences) {
        const flattened: GrammarElement[] = [];
        for (const el of elements) {
          if (el.kind === "Sequence") {
            flattened.push(...el.elements);
          } else {
            flattened.push(el);
          }
        }
        elements = flattened;
      }

      // Remove single-element sequences
      if (
        options.removeSingleElementSequences &&
        elements.length === 1
      ) {
        return elements[0];
      }

      return {
        ...element,
        elements,
      };

    case "OneOf":
      const options_ = element.options.map((opt) =>
        simplifyElement(opt, options)
      );

      // Remove single-option OneOf
      if (options.removeSingleOptionOneOf && options_.length === 1) {
        return options_[0];
      }

      return {
        ...element,
        options: options_,
      };

    case "Optional":
      return {
        ...element,
        element: simplifyElement(element.element, options),
      };

    case "List":
      return {
        ...element,
        element: simplifyElement(element.element, options),
      };
  }
}

