/**
 * Test Reporter
 * 
 * Writes detailed test reports to test-reports/{datetime}/{test-file}/{test-id}-{status}.json
 * 
 * Each report includes:
 * - Test ID
 * - Test description
 * - Input
 * - Expected output
 * - Actual output
 * - Errors (validation and linting)
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import type { SchemaCheckResult } from "./schema-validator";

export interface TestReport {
  testId: string;
  description: string;
  status: "PASSED" | "FAILED";
  timestamp: string;
  testFile: string;
  input?: unknown;
  expectedOutput?: string;
  actualOutput?: string;
  errors?: string[];
  validationErrors?: Array<{
    message: string;
    line?: number;
    column?: number;
    ruleId?: string;
    severity: "error" | "warning";
    source: "validation" | "lint";
  }>;
  validationWarnings?: Array<{
    message: string;
    line?: number;
    column?: number;
    ruleId?: string;
    severity: "warning";
    source: "validation" | "lint";
  }>;
  validationResult?: {
    isValid: boolean;
    issues: Array<{
      message: string;
      line?: number;
      column?: number;
      ruleId?: string;
      severity: "error" | "warning";
      source: "validation" | "lint";
    }>;
  };
}

const TEST_REPORTS_ROOT = join(process.cwd(), "test-reports");

/**
 * Get the current datetime directory name
 */
function getDateTimeDir(): string {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, "-").slice(0, -5); // Format: 2024-01-15T10-30-45
}

/**
 * Get the test file directory name (without .test.ts extension)
 */
function getTestFileDir(testFile: string): string {
  const fileName = basename(testFile, ".test.ts");
  return fileName;
}

/**
 * Get the report file path
 */
function getReportPath(testId: string, status: "PASSED" | "FAILED", testFile: string): string {
  const dateTimeDir = getDateTimeDir();
  const testFileDir = getTestFileDir(testFile);
  const fileName = `${testId}-${status}.json`;
  
  return join(TEST_REPORTS_ROOT, dateTimeDir, testFileDir, fileName);
}

/**
 * Write a test report
 */
export function writeTestReport(report: TestReport): void {
  const reportPath = getReportPath(report.testId, report.status, report.testFile);
  const reportDir = dirname(reportPath);
  
  // Create directory if it doesn't exist
  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true });
  }
  
  // Write report as JSON
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
}

/**
 * Create a test report from test execution
 */
export function createTestReport(
  testId: string,
  description: string,
  testFile: string,
  status: "PASSED" | "FAILED",
  options?: {
    input?: unknown;
    expectedOutput?: string;
    actualOutput?: string;
    error?: Error | string;
    validationResult?: SchemaCheckResult;
  }
): TestReport {
  const report: TestReport = {
    testId,
    description,
    status,
    timestamp: new Date().toISOString(),
    testFile,
  };
  
  if (options?.input !== undefined) {
    report.input = options.input;
  }
  
  if (options?.expectedOutput !== undefined) {
    report.expectedOutput = options.expectedOutput;
  }
  
  if (options?.actualOutput !== undefined) {
    report.actualOutput = options.actualOutput;
  }
  
  if (options?.error) {
    const errorMessage = options.error instanceof Error ? options.error.message : options.error;
    report.errors = [errorMessage];
    
    // Extract validation errors from error message if present
    if (options.error instanceof Error && options.error.message.includes("Validation Errors")) {
      // Parse validation errors from error message
      const validationErrorLines = options.error.message
        .split("\n")
        .filter(line => line.trim().startsWith("✗"))
        .map(line => ({
          message: line.trim().replace(/^✗\s*/, ""),
          severity: "error" as const,
          source: "validation" as const,
        }));
      
      if (validationErrorLines.length > 0) {
        report.validationErrors = validationErrorLines;
      }
    }
  }
  
  if (options?.validationResult) {
    // Store simplified validation result (without large schema object)
    report.validationResult = {
      isValid: options.validationResult.isValid,
      issues: options.validationResult.issues.map(issue => ({
        message: issue.message,
        line: issue.line,
        column: issue.column,
        ruleId: issue.ruleId,
        severity: issue.severity,
        source: issue.source,
      })),
    };
    
    // Separate errors and warnings
    report.validationErrors = options.validationResult.issues
      .filter(issue => issue.severity === "error")
      .map(issue => ({
        message: issue.message,
        line: issue.line,
        column: issue.column,
        ruleId: issue.ruleId,
        severity: issue.severity,
        source: issue.source,
      }));
    
    report.validationWarnings = options.validationResult.issues
      .filter(issue => issue.severity === "warning")
      .map(issue => ({
        message: issue.message,
        line: issue.line,
        column: issue.column,
        ruleId: issue.ruleId,
        severity: issue.severity,
        source: issue.source,
      }));
  }
  
  return report;
}

/**
 * Get the test reports root directory
 */
export function getTestReportsRoot(): string {
  return TEST_REPORTS_ROOT;
}

