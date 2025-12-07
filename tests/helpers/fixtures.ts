/**
 * Fixture Loading Utilities
 * 
 * Provides helpers for loading test fixtures organized by plugin type.
 * Supports parsers, transformers, and generators.
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURES_ROOT = join(__dirname, "..", "fixtures");

/**
 * Load a fixture file as string
 */
export function loadFixture(relativePath: string): string {
  const fullPath = join(FIXTURES_ROOT, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Fixture not found: ${fullPath}`);
  }
  return readFileSync(fullPath, "utf-8");
}

/**
 * Load a fixture file as JSON
 */
export function loadFixtureJSON<T = unknown>(relativePath: string): T {
  const content = loadFixture(relativePath);
  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON fixture ${relativePath}: ${error}`);
  }
}

/**
 * Save a fixture file
 */
export function saveFixture(relativePath: string, content: string): void {
  const fullPath = join(FIXTURES_ROOT, relativePath);
  const dir = dirname(fullPath);
  
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  writeFileSync(fullPath, content, "utf-8");
}

/**
 * Save a fixture file as JSON
 */
export function saveFixtureJSON(relativePath: string, data: unknown): void {
  saveFixture(relativePath, JSON.stringify(data, null, 2));
}

/**
 * Parser fixture loader
 */
export function loadParserFixtures(parserName: string) {
  const basePath = `parsers/${parserName}`;
  
  return {
    valid: (name: string) => loadFixture(`${basePath}/valid/${name}`),
    invalid: (name: string) => loadFixture(`${basePath}/invalid/${name}`),
    expected: (name: string) => loadFixtureJSON(`${basePath}/expected/${name}`),
    validation: (name: string) => loadFixtureJSON(`${basePath}/validation/${name}`),
    linting: (name: string) => loadFixtureJSON(`${basePath}/linting/${name}`),
  };
}

/**
 * Transformer fixture loader
 */
export function loadTransformerFixtures(transformerName: string) {
  const basePath = `transformers/${transformerName}`;
  
  return {
    input: (name: string) => loadFixture(`${basePath}/input/${name}`),
    expected: (name: string) => loadFixtureJSON(`${basePath}/expected/${name}`),
    config: (name: string) => loadFixtureJSON(`${basePath}/config/${name}`),
    validation: (name: string) => loadFixtureJSON(`${basePath}/validation/${name}`),
    linting: (name: string) => loadFixtureJSON(`${basePath}/linting/${name}`),
  };
}

/**
 * Generator fixture loader
 */
export function loadGeneratorFixtures(generatorName: string) {
  const basePath = `generators/${generatorName}`;
  
  return {
    input: (name: string) => loadFixtureJSON(`${basePath}/input/${name}`),
    expected: (name: string) => loadFixture(`${basePath}/expected/${name}`),
    config: (name: string) => loadFixtureJSON(`${basePath}/config/${name}`),
    validation: (name: string) => loadFixtureJSON(`${basePath}/validation/${name}`),
    linting: (name: string) => loadFixtureJSON(`${basePath}/linting/${name}`),
  };
}

/**
 * Check if a fixture exists
 */
export function fixtureExists(relativePath: string): boolean {
  const fullPath = join(FIXTURES_ROOT, relativePath);
  return existsSync(fullPath);
}

/**
 * Get fixture directory path
 */
export function getFixturePath(relativePath: string): string {
  return join(FIXTURES_ROOT, relativePath);
}

