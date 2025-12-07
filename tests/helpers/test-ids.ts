/**
 * Test ID System
 * 
 * Provides unique identifiers for tests to enable easy reference in documentation
 * and when communicating with AI agents.
 * 
 * Format: {TYPE}-{PLUGIN}-{NUMBER}
 * - TYPE: GEN (generator), TRANS (transformer), PARSE (parser), VALID (validation)
 * - PLUGIN: Short plugin identifier (e.g., GSDL for graphql-sdl, AF for add-field)
 * - NUMBER: Sequential test number within the plugin
 * 
 * Examples:
 * - GEN-GSDL-001: Generator graphql-sdl test #1
 * - TRANS-AF-001: Transformer add-field test #1
 * - PARSE-GSDL-001: Parser graphql-sdl test #1
 */

export type TestID = string;

/**
 * Create a test ID
 */
export function createTestID(
  type: "GEN" | "TRANS" | "PARSE" | "VALID",
  plugin: string,
  number: number
): TestID {
  const pluginShort = plugin
    .replace(/graphql-sdl/g, "GSDL")
    .replace(/add-field/g, "AF")
    .replace(/json/g, "JSON")
    .replace(/[^A-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 8); // Limit to 8 chars

  return `${type}-${pluginShort}-${number.toString().padStart(3, "0")}`;
}

/**
 * Parse a test ID to extract components
 */
export function parseTestID(id: TestID): {
  type: string;
  plugin: string;
  number: number;
} {
  const match = id.match(/^([A-Z]+)-([A-Z0-9]+)-(\d+)$/);
  if (!match) {
    throw new Error(`Invalid test ID format: ${id}`);
  }

  return {
    type: match[1],
    plugin: match[2],
    number: parseInt(match[3], 10),
  };
}

/**
 * Test ID registry - tracks assigned IDs to ensure uniqueness
 */
const testIDRegistry = new Map<TestID, { file: string; description: string }>();

/**
 * Register a test ID
 */
export function registerTestID(
  id: TestID,
  file: string,
  description: string
): void {
  if (testIDRegistry.has(id)) {
    const existing = testIDRegistry.get(id);
    throw new Error(
      `Test ID ${id} is already registered:\n` +
        `  Existing: ${existing?.file} - ${existing?.description}\n` +
        `  New: ${file} - ${description}`
    );
  }
  testIDRegistry.set(id, { file, description });
}

/**
 * Get all registered test IDs
 */
export function getAllTestIDs(): Map<TestID, { file: string; description: string }> {
  return new Map(testIDRegistry);
}

/**
 * Find test ID by description pattern
 */
export function findTestID(pattern: string): TestID[] {
  const matches: TestID[] = [];
  for (const [id, info] of testIDRegistry.entries()) {
    if (
      id.includes(pattern.toUpperCase()) ||
      info.description.toLowerCase().includes(pattern.toLowerCase())
    ) {
      matches.push(id);
    }
  }
  return matches;
}

