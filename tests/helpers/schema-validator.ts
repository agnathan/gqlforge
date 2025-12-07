/**
 * GraphQL Schema Validation and Linting Helper
 * 
 * Gold standard approach combining:
 * 1. graphql-js for strict specification validation
 * 2. @graphql-eslint/eslint-plugin for best-practice linting
 * 
 * This ensures schemas are both technically valid and follow quality standards.
 */

import {
  buildSchema,
  validateSchema,
  GraphQLError,
  GraphQLSchema,
  Source,
} from "graphql";
import { ESLint } from "eslint";
import type { Linter } from "eslint";

export interface SchemaIssue {
  message: string;
  line?: number;
  column?: number;
  ruleId?: string;
  severity: "error" | "warning";
  source: "validation" | "lint";
}

export interface SchemaCheckResult {
  isValid: boolean;
  issues: SchemaIssue[];
  schema?: GraphQLSchema;
}

export interface SchemaCheckOptions {
  /**
   * Skip linting if validation fails (default: true)
   */
  skipLintOnValidationError?: boolean;

  /**
   * Custom ESLint configuration overrides
   */
  eslintConfig?: Linter.Config;

  /**
   * File path for ESLint (helps with rule resolution)
   */
  filePath?: string;
}

/**
 * Validates and lints a GraphQL Schema string.
 * 
 * Gold standard approach:
 * 1. Strict spec validation via graphql-js (catches "won't work" errors)
 * 2. Best-practice linting via graphql-eslint (catches "messy/bad practice" errors)
 * 
 * @param schemaSDL - GraphQL Schema Definition Language string
 * @param options - Optional configuration
 * @returns Result with validation status and all issues
 */
export async function checkGraphQLSchema(
  schemaSDL: string,
  options: SchemaCheckOptions = {}
): Promise<SchemaCheckResult> {
  const {
    skipLintOnValidationError = true,
    eslintConfig,
    filePath = "schema.graphql",
  } = options;

  const issues: SchemaIssue[] = [];
  let schema: GraphQLSchema | null = null;

  // ---------------------------------------------------------
  // STEP 1: Strict Specification Validation (graphql-js)
  // ---------------------------------------------------------
  try {
    // buildSchema throws a syntax error if parsing fails immediately
    // It can throw GraphQLError for various validation issues
    schema = buildSchema(schemaSDL);

    // validateSchema checks for semantic errors (e.g. missing interface fields)
    const validationErrors = validateSchema(schema);

    validationErrors.forEach((error) => {
      issues.push({
        message: error.message,
        line: error.locations?.[0]?.line,
        column: error.locations?.[0]?.column,
        severity: "error",
        source: "validation",
      });
    });
  } catch (error) {
    // Catch GraphQLError from buildSchema (includes syntax errors, unknown types, etc.)
    if (error instanceof GraphQLError) {
      issues.push({
        message: error.message,
        line: error.locations?.[0]?.line,
        column: error.locations?.[0]?.column,
        severity: "error",
        source: "validation",
      });
    } else if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      // Handle other error types that might be thrown
      issues.push({
        message: error.message,
        severity: "error",
        source: "validation",
      });
    } else {
      // Rethrow unexpected non-GraphQL errors
      throw error;
    }
  }

  // If strict validation failed, it's often unsafe or noisy to run the linter
  if (skipLintOnValidationError && issues.some((i) => i.severity === "error")) {
    return { isValid: false, issues, schema: schema || undefined };
  }

  // ---------------------------------------------------------
  // STEP 2: Best Practice Linting (graphql-eslint)
  // ---------------------------------------------------------
  try {
    // Import graphql-eslint plugin dynamically to avoid requiring it as a peer dependency
    // This allows the function to work even if graphql-eslint isn't installed
    const graphqlESLintPlugin = await import("@graphql-eslint/eslint-plugin").catch(
      () => null
    );

    if (!graphqlESLintPlugin) {
      // If graphql-eslint is not installed, skip linting
      return {
        isValid: !issues.some((i) => i.severity === "error"),
        issues,
        schema: schema || undefined,
      };
    }

    // Get recommended schema rules - graphql-eslint v4.x structure
    let recommendedRules: Record<string, unknown> = {};
    try {
      const configs = graphqlESLintPlugin.configs || {};
      const schemaRecommended = configs["schema-recommended"] || configs.recommended;
      if (schemaRecommended && typeof schemaRecommended === "object" && "rules" in schemaRecommended) {
        recommendedRules = schemaRecommended.rules as Record<string, unknown>;
      }
    } catch {
      // If configs don't exist or are in unexpected format, use empty rules
    }

    const eslint = new ESLint({
      useEslintrc: false, // Don't use project's .eslintrc
      overrideConfig: {
        parser: "@graphql-eslint/eslint-plugin",
        plugins: ["@graphql-eslint"],
        rules: {
          // Load recommended schema rules
          ...recommendedRules,
          // Apply custom overrides if provided
          ...(eslintConfig?.rules || {}),
        },
        // Apply other config overrides (excluding rules which we already handled)
        ...Object.fromEntries(
          Object.entries(eslintConfig || {}).filter(([key]) => key !== "rules")
        ),
      },
    });

    // Lint the schema text
    const lintResults = await eslint.lintText(schemaSDL, { filePath });

    lintResults.forEach((result) => {
      result.messages.forEach((msg) => {
        issues.push({
          message: msg.message,
          line: msg.line,
          column: msg.column,
          ruleId: msg.ruleId || undefined,
          // Map ESLint severity (1=warn, 2=error) to string
          severity: msg.severity === 2 ? "error" : "warning",
          source: "lint",
        });
      });
    });
  } catch (error) {
    // If linting fails (e.g., config error), log but don't fail validation
    if (error instanceof Error) {
      issues.push({
        message: `Linting failed: ${error.message}`,
        severity: "warning",
        source: "lint",
      });
    }
  }

  // Determine overall validity (validation errors = invalid, lint warnings = valid but dirty)
  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    isValid: !hasErrors,
    issues,
    schema: schema || undefined,
  };
}

/**
 * Helper to format issues for test output
 */
export function formatSchemaIssues(issues: SchemaIssue[]): string {
  if (issues.length === 0) {
    return "No issues found";
  }

  const grouped = {
    validation: issues.filter((i) => i.source === "validation"),
    lint: issues.filter((i) => i.source === "lint"),
  };

  const lines: string[] = [];

  if (grouped.validation.length > 0) {
    lines.push("\nValidation Errors:");
    grouped.validation.forEach((issue) => {
      const loc = issue.line
        ? ` (${issue.line}${issue.column ? `:${issue.column}` : ""})`
        : "";
      lines.push(`  ✗ ${issue.message}${loc}`);
    });
  }

  if (grouped.lint.length > 0) {
    lines.push("\nLinting Issues:");
    grouped.lint.forEach((issue) => {
      const loc = issue.line
        ? ` (${issue.line}${issue.column ? `:${issue.column}` : ""})`
        : "";
      const rule = issue.ruleId ? ` [${issue.ruleId}]` : "";
      const severity = issue.severity === "error" ? "✗" : "⚠";
      lines.push(`  ${severity} ${issue.message}${loc}${rule}`);
    });
  }

  return lines.join("\n");
}

/**
 * Vitest matcher helper - throws with formatted issues if validation fails
 */
export function assertValidSchema(
  result: SchemaCheckResult,
  options?: { failOnWarnings?: boolean }
): asserts result is SchemaCheckResult & { isValid: true } {
  const { failOnWarnings = false } = options || {};

  if (!result.isValid) {
    throw new Error(
      `Schema validation failed:\n${formatSchemaIssues(result.issues)}`
    );
  }

  if (failOnWarnings) {
    const warnings = result.issues.filter((i) => i.severity === "warning");
    if (warnings.length > 0) {
      throw new Error(
        `Schema has linting warnings:\n${formatSchemaIssues(warnings)}`
      );
    }
  }
}

