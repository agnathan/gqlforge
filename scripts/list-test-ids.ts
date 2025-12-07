#!/usr/bin/env node
/**
 * List all registered test IDs
 * 
 * Usage: tsx scripts/list-test-ids.ts
 * 
 * Note: This script scans test files for test IDs rather than importing them
 * to avoid Vitest initialization issues.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

interface TestIDInfo {
  id: string;
  file: string;
  description: string;
}

const testIDs: TestIDInfo[] = [];

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
      testIDs.push({
        id,
        file: filePath,
        description: itMatch.description.trim(),
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

console.log("Test IDs Found\n");
console.log("=" .repeat(80));

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
  console.log("-" .repeat(80));

  // Sort by ID
  tests.sort((a, b) => a.id.localeCompare(b.id));

  for (const testInfo of tests) {
    console.log(`  ${testInfo.id.padEnd(15)} ${testInfo.description}`);
    console.log(`  ${" ".repeat(15)} ${testInfo.file}`);
  }
}

console.log("\n" + "=" .repeat(80));
console.log(`Total: ${testIDs.length} test IDs`);

