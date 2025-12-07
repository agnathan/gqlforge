#!/usr/bin/env node
/**
 * Show Test Report
 * 
 * Pretty prints a test report for a given test ID
 * 
 * Usage: tsx scripts/show-test-report.ts <TEST_ID>
 * Example: tsx scripts/show-test-report.ts GEN-GSDL-001
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

const TEST_REPORTS_ROOT = join(process.cwd(), "test-reports");

interface TestReport {
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

/**
 * Find test report files for a given test ID
 */
function findTestReports(testId: string): Array<{ path: string; status: "PASSED" | "FAILED"; timestamp: string }> {
  const reports: Array<{ path: string; status: "PASSED" | "FAILED"; timestamp: string }> = [];
  
  if (!existsSync(TEST_REPORTS_ROOT)) {
    return reports;
  }
  
  // Scan all datetime directories
  const datetimeDirs = readdirSync(TEST_REPORTS_ROOT)
    .filter(name => {
      const fullPath = join(TEST_REPORTS_ROOT, name);
      return statSync(fullPath).isDirectory();
    })
    .sort()
    .reverse(); // Most recent first
  
  for (const datetimeDir of datetimeDirs) {
    const datetimePath = join(TEST_REPORTS_ROOT, datetimeDir);
    const testFileDirs = readdirSync(datetimePath)
      .filter(name => {
        const fullPath = join(datetimePath, name);
        return statSync(fullPath).isDirectory();
      });
    
    for (const testFileDir of testFileDirs) {
      const testFilePath = join(datetimePath, testFileDir);
      const files = readdirSync(testFilePath)
        .filter(name => name.startsWith(`${testId}-`) && name.endsWith(".json"));
      
      for (const file of files) {
        const filePath = join(testFilePath, file);
        const status = file.includes("PASSED") ? "PASSED" : "FAILED";
        const report = JSON.parse(readFileSync(filePath, "utf-8")) as TestReport;
        reports.push({
          path: filePath,
          status,
          timestamp: report.timestamp,
        });
      }
    }
  }
  
  return reports;
}

/**
 * Pretty print a test report
 */
function printReport(report: TestReport, reportPath: string): void {
  const statusColor = report.status === "PASSED" ? "✓" : "✗";
  const statusText = report.status === "PASSED" ? "PASSED" : "FAILED";
  
  console.log("\n" + "=".repeat(80));
  console.log(`TEST REPORT: ${report.testId}`);
  console.log("=".repeat(80));
  console.log(`\n${statusColor} Status: ${statusText}`);
  console.log(`📝 Description: ${report.description}`);
  console.log(`📅 Timestamp: ${new Date(report.timestamp).toLocaleString()}`);
  console.log(`📁 Test File: ${report.testFile}`);
  console.log(`📄 Report Path: ${reportPath}`);
  
  // Input
  if (report.input) {
    console.log("\n" + "-".repeat(80));
    console.log("INPUT:");
    console.log("-".repeat(80));
    if (typeof report.input === "string") {
      console.log(report.input);
    } else {
      console.log(JSON.stringify(report.input, null, 2));
    }
  }
  
  // Expected Output
  if (report.expectedOutput) {
    console.log("\n" + "-".repeat(80));
    console.log("EXPECTED OUTPUT:");
    console.log("-".repeat(80));
    console.log(report.expectedOutput);
  }
  
  // Actual Output
  if (report.actualOutput) {
    console.log("\n" + "-".repeat(80));
    console.log("ACTUAL OUTPUT:");
    console.log("-".repeat(80));
    console.log(report.actualOutput);
  }
  
  // Errors
  if (report.errors && report.errors.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("ERRORS:");
    console.log("-".repeat(80));
    report.errors.forEach((error, index) => {
      console.log(`\n${index + 1}. ${error}`);
    });
  }
  
  // Validation Errors
  if (report.validationErrors && report.validationErrors.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("VALIDATION ERRORS:");
    console.log("-".repeat(80));
    report.validationErrors.forEach((error, index) => {
      console.log(`\n${index + 1}. [${error.source.toUpperCase()}] ${error.message}`);
      if (error.line) {
        console.log(`   Line: ${error.line}${error.column ? `, Column: ${error.column}` : ""}`);
      }
      if (error.ruleId) {
        console.log(`   Rule: ${error.ruleId}`);
      }
    });
  }
  
  // Validation Warnings
  if (report.validationWarnings && report.validationWarnings.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("VALIDATION WARNINGS:");
    console.log("-".repeat(80));
    report.validationWarnings.forEach((warning, index) => {
      console.log(`\n${index + 1}. [${warning.source.toUpperCase()}] ${warning.message}`);
      if (warning.line) {
        console.log(`   Line: ${warning.line}${warning.column ? `, Column: ${warning.column}` : ""}`);
      }
      if (warning.ruleId) {
        console.log(`   Rule: ${warning.ruleId}`);
      }
    });
  }
  
  // Validation Summary
  if (report.validationResult) {
    console.log("\n" + "-".repeat(80));
    console.log("VALIDATION SUMMARY:");
    console.log("-".repeat(80));
    console.log(`Valid: ${report.validationResult.isValid ? "✓ Yes" : "✗ No"}`);
    console.log(`Total Issues: ${report.validationResult.issues.length}`);
    const errorCount = report.validationResult.issues.filter(i => i.severity === "error").length;
    const warningCount = report.validationResult.issues.filter(i => i.severity === "warning").length;
    console.log(`  - Errors: ${errorCount}`);
    console.log(`  - Warnings: ${warningCount}`);
  }
  
  console.log("\n" + "=".repeat(80) + "\n");
}

/**
 * Main function
 */
function main(): void {
  const testId = process.argv[2];
  
  if (!testId) {
    console.error("Error: Test ID is required");
    console.error("\nUsage: npm run test:report <TEST_ID>");
    console.error("Example: npm run test:report GEN-GSDL-001");
    process.exit(1);
  }
  
  // Validate test ID format
  if (!/^[A-Z]+-[A-Z0-9]+-\d+$/.test(testId)) {
    console.error(`Error: Invalid test ID format: ${testId}`);
    console.error("Expected format: {TYPE}-{PLUGIN}-{NUMBER}");
    console.error("Example: GEN-GSDL-001");
    process.exit(1);
  }
  
  const reports = findTestReports(testId);
  
  if (reports.length === 0) {
    console.error(`No test reports found for test ID: ${testId}`);
    console.error("\nMake sure:");
    console.error("  1. The test has been run at least once");
    console.error("  2. The test ID is correct");
    console.error("  3. Test reports exist in test-reports/ directory");
    process.exit(1);
  }
  
  // Show most recent report by default
  const mostRecent = reports[0];
  const report = JSON.parse(readFileSync(mostRecent.path, "utf-8")) as TestReport;
  
  printReport(report, mostRecent.path);
  
  // If there are multiple reports, mention them
  if (reports.length > 1) {
    console.log(`\nNote: Found ${reports.length} report(s) for this test ID.`);
    console.log("Showing the most recent one. Other reports:");
    reports.slice(1).forEach((r, index) => {
      console.log(`  ${index + 2}. ${r.path} (${r.status})`);
    });
  }
}

main();

