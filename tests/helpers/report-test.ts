/**
 * Test Reporting Helper
 * 
 * Simplified helper for writing test reports with automatic context capture
 */

import { setTestContext, writeTestReportForTest } from "./test-wrapper";
import type { SchemaCheckResult } from "./schema-validator";

export interface TestReportOptions {
  testId: string;
  description: string;
  input?: unknown;
  expectedOutput?: string;
  actualOutput?: string;
  validationResult?: SchemaCheckResult;
}

/**
 * Report a passed test
 */
export function reportTestPassed(options: TestReportOptions): void {
  writeTestReportForTest(
    options.testId,
    options.description,
    "PASSED",
    {
      input: options.input,
      expectedOutput: options.expectedOutput,
      actualOutput: options.actualOutput,
      validationResult: options.validationResult,
    }
  );
}

/**
 * Report a failed test
 */
export function reportTestFailed(
  options: TestReportOptions,
  error: Error | string
): void {
  writeTestReportForTest(
    options.testId,
    options.description,
    "FAILED",
    {
      input: options.input,
      expectedOutput: options.expectedOutput,
      actualOutput: options.actualOutput,
      error: error instanceof Error ? error : new Error(error),
      validationResult: options.validationResult,
    }
  );
}

/**
 * Initialize test context for reporting
 */
export function initTestReport(options: {
  testId: string;
  description: string;
  input?: unknown;
  expectedOutput?: string;
}): void {
  setTestContext({
    testId: options.testId,
    description: options.description,
    input: options.input,
    expectedOutput: options.expectedOutput,
  });
}

/**
 * Update test context with actual output
 */
export function updateTestReport(options: {
  actualOutput?: string;
  validationResult?: SchemaCheckResult;
}): void {
  setTestContext(options);
}

