# Test Helpers

Helper utilities for testing GraphQL generators, transformers, and parsers.

## Schema Validator (`schema-validator.ts`)

Provides validation and linting helpers for GraphQL schemas.

### `expectValidGraphQL()`

The primary helper for tests that generate GraphQL. Validates, lints, and optionally compares against expected fixtures.

```typescript
import { expectValidGraphQL } from "../helpers/schema-validator";

await expectValidGraphQL(generatedSDL, undefined, {
  failOnWarnings: false,
  expectedFixture: expected,
  compareMode: "semantic",
  saveOutput: true, // Save generated output for review
  pluginType: "generators",
  pluginName: "graphql-sdl",
});
```

### Saving Generated Outputs for Review

To save generated GraphQL outputs for manual review and comparison:

**Option 1: Environment Variable (Recommended)**
```bash
# Save outputs for all tests
SAVE_TEST_OUTPUTS=true npm test

# Save outputs for specific test
SAVE_TEST_OUTPUTS=true npm test -- tests/generators/graphql-sdl.test.ts
```

**Option 2: Per-Test Option**
```typescript
await expectValidGraphQL(output, undefined, {
  saveOutput: true, // or a custom filename string
  pluginType: "generators",
  pluginName: "graphql-sdl",
  // ... other options
});
```

Generated outputs are saved to:
```
tests/fixtures/{pluginType}/{pluginName}/generated/{outputName}
```

For example:
- `tests/fixtures/generators/graphql-sdl/generated/schema-definition-grammar.graphql`
- `tests/fixtures/generators/graphql-sdl/generated/scalar-type-grammar.graphql`

You can then compare these files with the expected fixtures in:
```
tests/fixtures/{pluginType}/{pluginName}/expected/{outputName}
```

**Note:** The `generated/` directory is gitignored, so generated outputs won't be committed to the repository.

## Test IDs (`test-ids.ts`)

Provides unique identifiers for tests to enable easy reference in documentation and when communicating with AI agents.

### Test ID Format

**Format**: `{TYPE}-{PLUGIN}-{NUMBER}`
- **TYPE**: `GEN` (generator), `TRANS` (transformer), `PARSE` (parser), `VALID` (validation)
- **PLUGIN**: Short plugin identifier (e.g., `GSDL` for graphql-sdl, `AF` for add-field)
- **NUMBER**: Sequential test number within the plugin (001, 002, etc.)

### Creating Test IDs

```typescript
import { createTestID, registerTestID } from "../helpers/test-ids";

describe("my plugin", () => {
  const TEST_ID = createTestID("GEN", "graphql-sdl", 1);
  registerTestID(TEST_ID, "tests/generators/graphql-sdl.test.ts", "test description");

  it(`[${TEST_ID}] test description`, () => {
    // test code
  });
});
```

### Listing All Test IDs

```bash
npm run test:ids
```

### Finding Tests by ID

```bash
# Run specific test by ID
npm test -- -t GEN-GSDL-001

# Run all tests for a plugin
npm test -- -t GEN-GSDL
```

## Fixtures (`fixtures.ts`)

Provides utilities for loading and saving test fixtures.

### Loading Fixtures

```typescript
import { loadGeneratorFixtures } from "../helpers/fixtures";

const fixtures = loadGeneratorFixtures("graphql-sdl");
const input = fixtures.input("schema-definition-grammar.json");
const expected = fixtures.expected("schema-definition-grammar.graphql");
```

### Saving Generated Outputs

```typescript
import { saveGeneratedOutput } from "../helpers/fixtures";

saveGeneratedOutput(
  "generators",
  "graphql-sdl",
  "schema-definition-grammar.graphql",
  generatedSDL
);
```

## Test Reporter (`test-reporter.ts`)

Provides detailed test reporting to `test-reports/{datetime}/{test-file}/{test-id}-{status}.json`.

### Test Report Structure

Each test report includes:
- **testId**: Unique test identifier (e.g., `GEN-GSDL-001`)
- **description**: Test description
- **status**: `PASSED` or `FAILED`
- **timestamp**: ISO timestamp
- **testFile**: Path to test file
- **input**: Test input data
- **expectedOutput**: Expected output
- **actualOutput**: Actual output
- **errors**: Array of error messages (if failed)
- **validationErrors**: Array of validation/linting errors
- **validationWarnings**: Array of validation/linting warnings
- **validationResult**: Simplified validation result

### Using Test Reporter

```typescript
import { setTestContext, writeTestReportForTest } from "../helpers/test-wrapper";
import { expectValidGraphQL } from "../helpers/schema-validator";

it(`[${TEST_ID}] test description`, async () => {
  const input = fixtures.input("input.json");
  const expected = fixtures.expected("expected.graphql");
  
  // Set test context
  setTestContext({
    testId: TEST_ID,
    description: "test description",
    input,
    expectedOutput: expected,
  });
  
  const output = generator.generate(input);
  setTestContext({ actualOutput: output });
  
  try {
    const validationResult = await expectValidGraphQL(output, undefined, {
      expectedFixture: expected,
      testId: TEST_ID,
    });
    
    setTestContext({ validationResult });
    
    // Write report for passed test
    writeTestReportForTest(TEST_ID, "test description", "PASSED", {
      input,
      expectedOutput: expected,
      actualOutput: output,
      validationResult,
    });
  } catch (error) {
    // Write report for failed test
    writeTestReportForTest(TEST_ID, "test description", "FAILED", {
      input,
      expectedOutput: expected,
      actualOutput: output,
      error: error instanceof Error ? error : new Error(String(error)),
    });
    throw error;
  }
});
```

### Report Directory Structure

```
test-reports/
  {datetime}/                    # e.g., 2025-12-07T21-04-32
    {test-file}/                # e.g., graphql-sdl
      {test-id}-PASSED.json     # e.g., GEN-GSDL-001-PASSED.json
      {test-id}-FAILED.json     # e.g., GEN-GSDL-002-FAILED.json
```

**Note:** The `test-reports/` directory is gitignored, so reports won't be committed to the repository.

### Viewing Test Reports

Use the `test:report` script to view a pretty-printed test report:

```bash
npm run test:report <TEST_ID>
```

**Example:**
```bash
npm run test:report GEN-GSDL-001
```

The script will:
- Find the most recent report for the test ID
- Pretty print all report sections:
  - Test ID, description, status, timestamp
  - Input data
  - Expected output
  - Actual output
  - Errors (if failed)
  - Validation errors and warnings
  - Validation summary
- Show other reports if multiple exist for the same test ID
