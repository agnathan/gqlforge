/**
 * Validate Transformer
 * Validates grammar structure and reports issues
 */

import type { Transformer, PluginOptions } from "../types";
import type { Grammar, GrammarElement } from "../../grammar";

export interface ValidateOptions extends PluginOptions {
  /**
   * Throw error on validation failure
   */
  throwOnError?: boolean;
  
  /**
   * Check for unreferenced rules
   */
  checkUnreferenced?: boolean;
  
  /**
   * Check for missing references
   */
  checkMissingReferences?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate transformer plugin
 */
export const validateTransformer: Transformer = {
  metadata: {
    name: "validate",
    version: "1.0.0",
    description: "Validates grammar structure and reports issues",
  },

  validateOptions(options: unknown): options is ValidateOptions {
    if (typeof options !== "object" || options === null) {
      return false;
    }
    const opts = options as Record<string, unknown>;
    if (
      opts.throwOnError !== undefined &&
      typeof opts.throwOnError !== "boolean"
    ) {
      return false;
    }
    if (
      opts.checkUnreferenced !== undefined &&
      typeof opts.checkUnreferenced !== "boolean"
    ) {
      return false;
    }
    if (
      opts.checkMissingReferences !== undefined &&
      typeof opts.checkMissingReferences !== "boolean"
    ) {
      return false;
    }
    return true;
  },

  transform(grammar: Grammar, options?: ValidateOptions): Grammar {
    const opts: ValidateOptions = {
      throwOnError: false,
      checkUnreferenced: true,
      checkMissingReferences: true,
      ...options,
    };

    const result = validateGrammar(grammar, opts);

    if (!result.valid && opts.throwOnError) {
      throw new Error(
        `Grammar validation failed:\n${result.errors.join("\n")}`
      );
    }

    // Return grammar unchanged (validation only)
    return grammar;
  },
};

function validateGrammar(
  grammar: Grammar,
  options: ValidateOptions
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ruleNames = new Set(Object.keys(grammar.rules));

  // Check root exists
  if (!ruleNames.has(grammar.root)) {
    errors.push(`Root rule "${grammar.root}" not found`);
  }

  // Check for missing references
  if (options.checkMissingReferences) {
    const referencedRules = new Set<string>();
    
    function collectReferences(element: GrammarElement): void {
      switch (element.kind) {
        case "NonTerminal":
          referencedRules.add(element.name);
          break;
        case "Sequence":
          element.elements.forEach(collectReferences);
          break;
        case "OneOf":
          element.options.forEach(collectReferences);
          break;
        case "Optional":
        case "List":
          collectReferences(element.element);
          break;
      }
    }

    for (const rule of Object.values(grammar.rules)) {
      collectReferences(rule.definition);
    }

    for (const ref of referencedRules) {
      if (!ruleNames.has(ref)) {
        errors.push(`Missing reference to rule "${ref}"`);
      }
    }
  }

  // Check for unreferenced rules
  if (options.checkUnreferenced) {
    const referencedRules = new Set<string>();
    referencedRules.add(grammar.root);

    function collectReferences(element: GrammarElement): void {
      switch (element.kind) {
        case "NonTerminal":
          referencedRules.add(element.name);
          break;
        case "Sequence":
          element.elements.forEach(collectReferences);
          break;
        case "OneOf":
          element.options.forEach(collectReferences);
          break;
        case "Optional":
        case "List":
          collectReferences(element.element);
          break;
      }
    }

    for (const rule of Object.values(grammar.rules)) {
      collectReferences(rule.definition);
    }

    for (const ruleName of ruleNames) {
      if (!referencedRules.has(ruleName)) {
        warnings.push(`Unreferenced rule "${ruleName}"`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

