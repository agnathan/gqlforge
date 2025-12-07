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
import { parse, DocumentNode, visit, Kind } from "graphql/language";
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

export interface FixtureComparisonOptions {
  /**
   * Expected GraphQL SDL fixture content (string)
   */
  expectedFixture?: string;

  /**
   * Comparison mode: 'exact' | 'normalized' | 'semantic' (default: 'semantic')
   */
  compareMode?: "exact" | "normalized" | "semantic";
}

export interface FixtureComparisonResult {
  matches: boolean;
  diff?: string;
  error?: string;
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

/**
 * Validation result fixture format
 */
export interface ValidationResultFixture {
  isValid: boolean;
  errors: Array<{
    message: string;
    line?: number;
    column?: number;
    ruleId?: string;
    source?: "validation" | "lint";
  }>;
  warnings: Array<{
    message: string;
    line?: number;
    column?: number;
    ruleId?: string;
  }>;
  acceptableWarnings?: string[]; // Rule IDs that are acceptable
  timestamp?: string;
}

/**
 * Compare validation result with expected fixture
 */
export function compareValidationResults(
  actual: SchemaCheckResult,
  expected: ValidationResultFixture
): {
  matches: boolean;
  differences: {
    unexpectedErrors: SchemaIssue[];
    unexpectedWarnings: SchemaIssue[];
    missingExpectedErrors: SchemaIssue[];
    missingExpectedWarnings: SchemaIssue[];
  };
} {
  const actualErrors = actual.issues.filter((i) => i.severity === "error");
  const actualWarnings = actual.issues.filter(
    (i) =>
      i.severity === "warning" &&
      !expected.acceptableWarnings?.includes(i.ruleId || "")
  );

  const expectedErrorMessages = new Set(
    expected.errors.map((e) => `${e.message}:${e.line}:${e.column}`)
  );
  const expectedWarningMessages = new Set(
    expected.warnings.map((w) => `${w.message}:${w.line}:${w.ruleId}`)
  );

  const unexpectedErrors = actualErrors.filter(
    (e) => !expectedErrorMessages.has(`${e.message}:${e.line}:${e.column}`)
  );
  const unexpectedWarnings = actualWarnings.filter(
    (w) =>
      !expectedWarningMessages.has(
        `${w.message}:${w.line}:${w.ruleId || ""}`
      )
  );

  const missingExpectedErrors = expected.errors.filter((e) => {
    const key = `${e.message}:${e.line}:${e.column}`;
    return !actualErrors.some(
      (a) => `${a.message}:${a.line}:${a.column}` === key
    );
  });

  const missingExpectedWarnings = expected.warnings.filter((w) => {
    const key = `${w.message}:${w.line}:${w.ruleId || ""}`;
    return !actualWarnings.some(
      (a) => `${a.message}:${a.line}:${a.ruleId || ""}` === key
    );
  });

  const matches =
    unexpectedErrors.length === 0 &&
    unexpectedWarnings.length === 0 &&
    missingExpectedErrors.length === 0 &&
    missingExpectedWarnings.length === 0 &&
    actual.isValid === expected.isValid;

  return {
    matches,
    differences: {
      unexpectedErrors,
      unexpectedWarnings,
      missingExpectedErrors: missingExpectedErrors.map((e) => ({
        message: e.message,
        line: e.line,
        column: e.column,
        ruleId: e.ruleId,
        severity: "error" as const,
        source: (e.source || "validation") as "validation" | "lint",
      })),
      missingExpectedWarnings: missingExpectedWarnings.map((w) => ({
        message: w.message,
        line: w.line,
        column: w.column,
        ruleId: w.ruleId,
        severity: "warning" as const,
        source: "lint" as const,
      })),
    },
  };
}

/**
 * Format validation differences for error messages
 */
export function formatValidationDifferences(differences: {
  unexpectedErrors: SchemaIssue[];
  unexpectedWarnings: SchemaIssue[];
  missingExpectedErrors: SchemaIssue[];
  missingExpectedWarnings: SchemaIssue[];
}): string {
  const lines: string[] = [];

  if (differences.unexpectedErrors.length > 0) {
    lines.push("\nUnexpected Errors:");
    differences.unexpectedErrors.forEach((e) => {
      const loc = e.line ? ` (${e.line}${e.column ? `:${e.column}` : ""})` : "";
      lines.push(`  ✗ ${e.message}${loc}`);
    });
  }

  if (differences.unexpectedWarnings.length > 0) {
    lines.push("\nUnexpected Warnings:");
    differences.unexpectedWarnings.forEach((w) => {
      const loc = w.line ? ` (${w.line}${w.column ? `:${w.column}` : ""})` : "";
      const rule = w.ruleId ? ` [${w.ruleId}]` : "";
      lines.push(`  ⚠ ${w.message}${loc}${rule}`);
    });
  }

  if (differences.missingExpectedErrors.length > 0) {
    lines.push("\nMissing Expected Errors:");
    differences.missingExpectedErrors.forEach((e) => {
      const loc = e.line ? ` (${e.line}${e.column ? `:${e.column}` : ""})` : "";
      lines.push(`  ✗ ${e.message}${loc}`);
    });
  }

  if (differences.missingExpectedWarnings.length > 0) {
    lines.push("\nMissing Expected Warnings:");
    differences.missingExpectedWarnings.forEach((w) => {
      const loc = w.line ? ` (${w.line}${w.column ? `:${w.column}` : ""})` : "";
      const rule = w.ruleId ? ` [${w.ruleId}]` : "";
      lines.push(`  ⚠ ${w.message}${loc}${rule}`);
    });
  }

  return lines.join("\n");
}

/**
 * Validate GraphQL and compare with expected results fixture
 */
export async function validateAndLintGraphQL(
  schemaSDL: string,
  expectedResultsPath?: string,
  options?: {
    failOnUnexpectedErrors?: boolean; // Default: true
    failOnUnexpectedWarnings?: boolean; // Default: false
    acceptableWarnings?: string[]; // Rule IDs that are OK
  }
): Promise<{
  result: SchemaCheckResult;
  matches: boolean;
  differences: {
    unexpectedErrors: SchemaIssue[];
    unexpectedWarnings: SchemaIssue[];
    missingExpectedErrors: SchemaIssue[];
    missingExpectedWarnings: SchemaIssue[];
  };
}> {
  const result = await checkGraphQLSchema(schemaSDL);

  if (!expectedResultsPath) {
    // No fixture - just validate it's clean
    const errors = result.issues.filter((i) => i.severity === "error");
    return {
      result,
      matches: result.isValid && errors.length === 0,
      differences: {
        unexpectedErrors: errors,
        unexpectedWarnings: [],
        missingExpectedErrors: [],
        missingExpectedWarnings: [],
      },
    };
  }

  // Load expected results fixture
  const { loadFixtureJSON } = await import("./fixtures");
  const expected = loadFixtureJSON<ValidationResultFixture>(
    expectedResultsPath
  );

  // Compare actual vs expected
  const comparison = compareValidationResults(result, expected);

  return {
    result,
    ...comparison,
  };
}

/**
 * Normalize GraphQL AST by removing locations and sorting
 */
function normalizeAST(ast: DocumentNode): DocumentNode {
  // Create a deep copy without location information
  const normalized = visit(ast, {
    enter(node) {
      // Remove location information
      if ("loc" in node) {
        const { loc, ...rest } = node as any;
        return rest;
      }
      return node;
    },
  });

  return normalized as DocumentNode;
}

/**
 * Normalize string by removing extra whitespace and normalizing line endings
 */
function normalizeString(str: string): string {
  return str
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\r/g, "\n")
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Collapse multiple blank lines
    .replace(/[ \t]+/g, " ") // Normalize spaces
    .replace(/[ \t]*\n[ \t]*/g, "\n") // Remove trailing/leading whitespace from lines
    .trim();
}

/**
 * Deep equality check for AST nodes
 */
function deepEqualAST(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqualAST(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a).filter((k) => k !== "loc" && k !== "kind");
    const keysB = Object.keys(b).filter((k) => k !== "loc" && k !== "kind");

    // Check kind first (if present)
    if ("kind" in a && "kind" in b && a.kind !== b.kind) {
      return false;
    }

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqualAST(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
}

/**
 * Compare two GraphQL SDL strings semantically using AST comparison
 */
function compareGraphQLSchemas(
  actual: string,
  expected: string,
  mode: "exact" | "normalized" | "semantic" = "semantic"
): FixtureComparisonResult {
  if (mode === "exact") {
    if (actual === expected) {
      return { matches: true };
    }
    return {
      matches: false,
      diff: `Expected exact match but strings differ.\n\nExpected:\n${expected}\n\nActual:\n${actual}`,
    };
  }

  if (mode === "normalized") {
    const normalizedActual = normalizeString(actual);
    const normalizedExpected = normalizeString(expected);
    if (normalizedActual === normalizedExpected) {
      return { matches: true };
    }
    return {
      matches: false,
      diff: `Expected normalized match but strings differ.\n\nExpected:\n${normalizedExpected}\n\nActual:\n${normalizedActual}`,
    };
  }

  // Semantic comparison (mode === "semantic")
  try {
    const actualAST = parse(actual);
    const expectedAST = parse(expected);

    const normalizedActual = normalizeAST(actualAST);
    const normalizedExpected = normalizeAST(expectedAST);

    // Deep comparison of AST nodes
    const matches = deepEqualAST(normalizedActual, normalizedExpected);

    if (matches) {
      return { matches: true };
    }

    return {
      matches: false,
      diff: `AST structures differ. Expected and actual schemas are semantically different.`,
    };
  } catch (error) {
    // Fallback to normalized string comparison if parsing fails
    const normalizedActual = normalizeString(actual);
    const normalizedExpected = normalizeString(expected);
    const matches = normalizedActual === normalizedExpected;

    if (matches) {
      return { matches: true };
    }

    return {
      matches: false,
      error: error instanceof Error ? error.message : String(error),
      diff: `Failed to parse for semantic comparison, falling back to normalized string comparison.\n\nExpected:\n${normalizedExpected}\n\nActual:\n${normalizedActual}`,
    };
  }
}

/**
 * Assert GraphQL is valid and matches expected validation/linting results
 * This is the primary helper for tests that generate GraphQL
 */
export async function expectValidGraphQL(
  schemaSDL: string,
  expectedResultsPath?: string,
  options?: {
    failOnWarnings?: boolean;
    acceptableWarnings?: string[];
    failOnUnexpectedErrors?: boolean;
    failOnUnexpectedWarnings?: boolean;
    expectedFixture?: string;
    compareMode?: "exact" | "normalized" | "semantic";
  }
): Promise<SchemaCheckResult> {
  const {
    failOnWarnings = false,
    acceptableWarnings,
    failOnUnexpectedErrors = true,
    failOnUnexpectedWarnings = false,
    expectedFixture,
    compareMode = "semantic",
  } = options || {};

  const { result, matches, differences } = await validateAndLintGraphQL(
    schemaSDL,
    expectedResultsPath,
    {
      failOnUnexpectedErrors,
      failOnUnexpectedWarnings,
      acceptableWarnings,
    }
  );

  // Fail if validation errors exist
  if (!result.isValid) {
    throw new Error(
      `Schema is invalid:\n${formatSchemaIssues(result.issues)}`
    );
  }

  // Fail if doesn't match expected fixture
  if (expectedResultsPath && !matches) {
    const diffMessage = formatValidationDifferences(differences);
    throw new Error(
      `Schema validation/linting does not match expected results:\n${diffMessage}`
    );
  }

  // Compare with expected GraphQL SDL fixture if provided
  if (expectedFixture) {
    const comparison = compareGraphQLSchemas(
      schemaSDL,
      expectedFixture,
      compareMode
    );

    if (!comparison.matches) {
      const errorMessage = [
        `Generated GraphQL does not match expected fixture:`,
        comparison.diff || "",
        comparison.error ? `\nError: ${comparison.error}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      throw new Error(errorMessage);
    }
  }

  // Optionally fail on warnings
  if (failOnWarnings) {
    const warnings = result.issues.filter((i) => i.severity === "warning");
    if (warnings.length > 0) {
      throw new Error(
        `Schema has warnings:\n${formatSchemaIssues(warnings)}`
      );
    }
  }

  return result;
}

/**
 * Capture validation errors for regression testing
 * Creates/updates validation fixture with current results
 */
export async function captureValidationErrors(
  schemaSDL: string,
  fixturePath: string,
  options?: {
    updateFixture?: boolean; // Update fixture if errors change
    acceptableWarnings?: string[];
  }
): Promise<ValidationResultFixture> {
  const result = await checkGraphQLSchema(schemaSDL);

  // Filter acceptable warnings
  const errors = result.issues.filter((i) => i.severity === "error");
  const warnings = result.issues.filter(
    (i) =>
      i.severity === "warning" &&
      !options?.acceptableWarnings?.includes(i.ruleId || "")
  );

  const validationResults: ValidationResultFixture = {
    isValid: result.isValid,
    errors: errors.map((i) => ({
      message: i.message,
      line: i.line,
      column: i.column,
      ruleId: i.ruleId,
      source: i.source,
    })),
    warnings: warnings.map((i) => ({
      message: i.message,
      line: i.line,
      column: i.column,
      ruleId: i.ruleId,
    })),
    acceptableWarnings: options?.acceptableWarnings,
    timestamp: new Date().toISOString(),
  };

  if (options?.updateFixture) {
    const { saveFixtureJSON } = await import("./fixtures");
    saveFixtureJSON(fixturePath, validationResults);
  }

  return validationResults;
}

