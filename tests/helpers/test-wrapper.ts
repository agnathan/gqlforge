/**
 * Test Wrapper Helper
 * 
 * Wraps test execution to capture context and write detailed reports
 */

import { afterEach } from "vitest";
import { writeTestReport, createTestReport, type TestReport } from "./test-reporter";
import type { SchemaCheckResult } from "./schema-validator";

interface TestContext {
  testId?: string;
  description?: string;
  input?: unknown;
  expectedOutput?: string;
  actualOutput?: string;
  validationResult?: SchemaCheckResult;
  error?: Error;
}

// Store test context for each test
const testContexts = new Map<string, TestContext>();

/**
 * Get current test file path
 */
function getCurrentTestFile(): string {
  // Try to get from vitest context or error stack
  const stack = new Error().stack;
  if (stack) {
    const lines = stack.split("\n");
    for (const line of lines) {
      // Match various path formats
      const patterns = [
        /\((.+[\\/]tests[\\/].+\.test\.ts[^:)]*)/,  // Paths with tests/ directory
        /at (.+[\\/].+\.test\.ts[^:)]*)/,           // at filepath
        /\((.+\.test\.ts[^:)]*)/,                    // (filepath)
      ];
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          let fullPath = match[1];
          
          // Clean up the path
          fullPath = fullPath.replace(/^file:\/\//, "").replace(/^\//, "");
          
          // Convert to relative path
          const cwd = process.cwd().replace(/\\/g, "/");
          const normalizedPath = fullPath.replace(/\\/g, "/");
          
          if (normalizedPath.includes(cwd)) {
            const relativePath = normalizedPath.slice(normalizedPath.indexOf(cwd) + cwd.length + 1);
            if (relativePath.includes("tests/")) {
              return relativePath;
            }
          }
          
          // If it's already a relative path starting with tests/
          if (normalizedPath.includes("tests/")) {
            const parts = normalizedPath.split("tests/");
            return `tests/${parts[parts.length - 1]}`;
          }
        }
      }
    }
  }
  return "unknown.test.ts";
}

/**
 * Set test context for current test
 */
export function setTestContext(context: Partial<TestContext>): void {
  const testFile = getCurrentTestFile();
  const key = `${testFile}-${context.testId || "unknown"}`;
  
  const existing = testContexts.get(key) || {};
  testContexts.set(key, { ...existing, ...context });
}

/**
 * Get test context for current test
 */
export function getTestContext(testId: string): TestContext | undefined {
  const testFile = getCurrentTestFile();
  const key = `${testFile}-${testId}`;
  return testContexts.get(key);
}

/**
 * Write test report after test execution
 */
export function writeTestReportForTest(
  testId: string,
  description: string,
  status: "PASSED" | "FAILED",
  options?: {
    input?: unknown;
    expectedOutput?: string;
    actualOutput?: string;
    error?: Error;
    validationResult?: SchemaCheckResult;
  }
): void {
  const testFile = getCurrentTestFile();
  
  const report = createTestReport(
    testId,
    description,
    testFile,
    status,
    options
  );
  
  writeTestReport(report);
}

/**
 * Wrap a test function to automatically capture and report
 */
export function withTestReporting<T extends (...args: any[]) => any>(
  testId: string,
  description: string,
  testFn: T
): T {
  return ((...args: Parameters<T>) => {
    const testFile = getCurrentTestFile();
    let status: "PASSED" | "FAILED" = "PASSED";
    let error: Error | undefined;
    let context: TestContext = {};
    
    try {
      // Set initial context
      setTestContext({ testId, description });
      
      // Execute test
      const result = testFn(...args);
      
      // Handle async tests
      if (result && typeof result.then === "function") {
        return result
          .then((value: any) => {
            context = getTestContext(testId) || {};
            writeTestReportForTest(testId, description, "PASSED", {
              input: context.input,
              expectedOutput: context.expectedOutput,
              actualOutput: context.actualOutput,
              validationResult: context.validationResult,
            });
            return value;
          })
          .catch((err: Error) => {
            context = getTestContext(testId) || {};
            writeTestReportForTest(testId, description, "FAILED", {
              input: context.input,
              expectedOutput: context.expectedOutput,
              actualOutput: context.actualOutput,
              error: err,
              validationResult: context.validationResult,
            });
            throw err;
          });
      }
      
      // Sync test passed
      context = getTestContext(testId) || {};
      writeTestReportForTest(testId, description, "PASSED", {
        input: context.input,
        expectedOutput: context.expectedOutput,
        actualOutput: context.actualOutput,
        validationResult: context.validationResult,
      });
      
      return result;
    } catch (err) {
      // Sync test failed
      context = getTestContext(testId) || {};
      writeTestReportForTest(testId, description, "FAILED", {
        input: context.input,
        expectedOutput: context.expectedOutput,
        actualOutput: context.actualOutput,
        error: err instanceof Error ? err : new Error(String(err)),
        validationResult: context.validationResult,
      });
      throw err;
    }
  }) as T;
}

