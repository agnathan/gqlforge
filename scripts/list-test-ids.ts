#!/usr/bin/env node
/**
 * List all registered test IDs with their pass/fail status
 * 
 * Usage: tsx scripts/list-test-ids.ts
 * 
 * Note: This script scans test files for test IDs rather than importing them
 * to avoid Vitest initialization issues.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, extname } from "path";

interface TestIDInfo {
  id: string;
  file: string;
  description: string;
  status?: "PASSED" | "FAILED" | "UNKNOWN";
}

const TEST_REPORTS_ROOT = join(process.cwd(), "test-reports");
const testIDs: TestIDInfo[] = [];

/**
 * Find the most recent test report for a given test ID
 */
function findLatestTestReport(testId: string): "PASSED" | "FAILED" | "UNKNOWN" {
  if (!existsSync(TEST_REPORTS_ROOT)) {
    return "UNKNOWN";
  }
  
  const reports: Array<{ status: "PASSED" | "FAILED"; timestamp: string }> = [];
  
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
        try {
          const report = JSON.parse(readFileSync(filePath, "utf-8")) as { timestamp: string };
          reports.push({
            status,
            timestamp: report.timestamp,
          });
        } catch {
          // Skip invalid JSON files
        }
      }
    }
  }
  
  if (reports.length === 0) {
    return "UNKNOWN";
  }
  
  // Sort by timestamp descending and return the most recent status
  reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return reports[0].status;
}

/**
 * Extract test IDs from a test file
 */
function extractTestIDs(filePath: string, content: string): void {
  // Find all TEST_ID definitions and it() calls, then pair them
  const testIDRegex = /const\s+(\w+)\s*=\s*createTestID\(\s*["'](\w+)["'],\s*["']([^"']+)["'],\s*(\d+)\s*\)/g;
  const itRegex = /it\(`\[(\$\{(\w+)\})\]?\s*([^`]+)`/g;
  
  // Collect all matches with positions
  const testIDMatches: Array<{ varName: string; type: string; plugin: string; number: number; index: number }> = [];
  const itMatches: Array<{ varName: string; description: string; index: number }> = [];
  
  let match;
  while ((match = testIDRegex.exec(content)) !== null) {
    testIDMatches.push({
      varName: match[1],
      type: match[2],
      plugin: match[3],
      number: parseInt(match[4], 10),
      index: match.index!,
    });
  }
  
  while ((match = itRegex.exec(content)) !== null) {
    itMatches.push({
      varName: match[2],
      description: match[3],
      index: match.index!,
    });
  }
  
  // Pair each it() call with the closest TEST_ID definition before it
  for (const itMatch of itMatches) {
    // Find the TEST_ID definition that comes before this it() call
    const relevantTestIDs = testIDMatches
      .filter(tid => tid.index < itMatch.index && tid.varName === itMatch.varName)
      .sort((a, b) => b.index - a.index); // Get the closest one
    
    if (relevantTestIDs.length > 0) {
      const testID = relevantTestIDs[0];
      // Generate ID using same logic as createTestID
      const pluginShort = testID.plugin
        .replace(/graphql-sdl/g, "GSDL")
        .replace(/add-field/g, "AF")
        .replace(/json/g, "JSON")
        .replace(/[^A-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 8);
      const id = `${testID.type}-${pluginShort}-${testID.number.toString().padStart(3, "0")}`;
      const status = findLatestTestReport(id);
      testIDs.push({
        id,
        file: filePath,
        description: itMatch.description.trim(),
        status,
      });
    }
  }
}

/**
 * Recursively scan test files
 */
function scanTestFiles(dir: string): void {
  const entries = readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanTestFiles(fullPath);
    } else if (extname(entry) === ".ts" && entry.endsWith(".test.ts")) {
      try {
        const content = readFileSync(fullPath, "utf-8");
        extractTestIDs(fullPath.replace(process.cwd() + "\\", "").replace(process.cwd() + "/", ""), content);
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }
}

// Scan tests directory
const testsDir = join(process.cwd(), "tests");
scanTestFiles(testsDir);

console.log("\nTest IDs Found\n");
console.log("=".repeat(80));

if (testIDs.length === 0) {
  console.log("No test IDs found. Make sure test files use createTestID() and registerTestID().");
  process.exit(0);
}

// Group by type
const byType = new Map<string, TestIDInfo[]>();

for (const testInfo of testIDs) {
  const type = testInfo.id.split("-")[0];
  if (!byType.has(type)) {
    byType.set(type, []);
  }
  byType.get(type)!.push(testInfo);
}

// Print grouped by type
for (const [type, tests] of byType.entries()) {
  const typeName = {
    GEN: "Generators",
    TRANS: "Transformers",
    PARSE: "Parsers",
    VALID: "Validation",
  }[type] || type;

  console.log(`\n${typeName} (${type}):`);
  console.log("-".repeat(80));

  // Sort by ID
  tests.sort((a, b) => a.id.localeCompare(b.id));

  for (const testInfo of tests) {
    const statusSymbol = testInfo.status === "PASSED" ? "✓" : testInfo.status === "FAILED" ? "✗" : "?";
    console.log(`  ${statusSymbol} ${testInfo.id.padEnd(15)} ${testInfo.description}`);
    console.log(`    ${" ".repeat(15)} ${testInfo.file}`);
  }
}

console.log("\n" + "=".repeat(80));
console.log(`Total: ${testIDs.length} test IDs`);

// Summary
const passedCount = testIDs.filter(t => t.status === "PASSED").length;
const failedCount = testIDs.filter(t => t.status === "FAILED").length;
const unknownCount = testIDs.filter(t => t.status === "UNKNOWN" || !t.status).length;

console.log(`\nSummary:`);
console.log(`  ✓ Passed: ${passedCount}`);
console.log(`  ✗ Failed: ${failedCount}`);
console.log(`  ? Unknown: ${unknownCount} (no reports found)`);

