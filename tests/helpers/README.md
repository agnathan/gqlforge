# GraphQL Schema Validation Helper

A production-ready helper function for validating and linting GraphQL schemas in your test suite.

## Overview

This helper combines two complementary tools:

1. **`graphql-js`** - Strict specification validation (catches "won't work" errors)
2. **`@graphql-eslint/eslint-plugin`** - Best-practice linting (catches "messy/bad practice" errors)

## Features

- ✅ **Specification Validation**: Ensures schemas adhere to the GraphQL spec
- ✅ **Linting**: Enforces best practices and coding standards
- ✅ **Vitest Integration**: Works seamlessly with Vitest test framework
- ✅ **Detailed Error Reporting**: Returns structured issues with line/column information
- ✅ **Flexible Configuration**: Customizable ESLint rules and options
- ✅ **Graceful Degradation**: Works even if graphql-eslint isn't installed

## Usage

### Basic Example

```typescript
import { checkGraphQLSchema } from "./helpers/schema-validator";

const schema = `
  type User {
    id: ID!
    name: String!
  }
  
  type Query {
    me: User
  }
`;

const result = await checkGraphQLSchema(schema);

if (!result.isValid) {
  console.error("Schema validation failed:", result.issues);
}
```

### In Vitest Tests

```typescript
import { describe, it, expect } from "vitest";
import { checkGraphQLSchema, formatSchemaIssues } from "./helpers/schema-validator";

describe("My GraphQL Schema", () => {
  it("should be valid", async () => {
    const schema = `...`;
    const result = await checkGraphQLSchema(schema);
    
    expect(result.isValid).toBe(true);
    
    // Check for errors specifically (warnings don't fail validation)
    const errors = result.issues.filter(i => i.severity === "error");
    expect(errors).toHaveLength(0);
  });
  
  it("should have detailed error messages", async () => {
    const schema = `...`;
    const result = await checkGraphQLSchema(schema);
    
    if (!result.isValid) {
      console.error(formatSchemaIssues(result.issues));
    }
    
    expect(result.isValid).toBe(true);
  });
});
```

### Using the Assertion Helper

```typescript
import { checkGraphQLSchema, assertValidSchema } from "./helpers/schema-validator";

const result = await checkGraphQLSchema(schema);

// Throws with formatted error message if invalid
assertValidSchema(result);

// Or fail on warnings too
assertValidSchema(result, { failOnWarnings: true });
```

### Custom Linting Rules

```typescript
const result = await checkGraphQLSchema(schema, {
  eslintConfig: {
    rules: {
      "@graphql-eslint/require-description": ["error"],
      "@graphql-eslint/naming-convention": ["error", {
        FieldDefinition: "camelCase",
        ObjectTypeDefinition: "PascalCase",
      }],
    },
  },
});
```

## API Reference

### `checkGraphQLSchema(schemaSDL, options?)`

Validates and lints a GraphQL Schema Definition Language string.

**Parameters:**
- `schemaSDL` (string): GraphQL Schema Definition Language string
- `options` (SchemaCheckOptions, optional): Configuration options

**Returns:** `Promise<SchemaCheckResult>`

**Options:**
- `skipLintOnValidationError` (boolean, default: `true`): Skip linting if validation fails
- `eslintConfig` (Linter.Config, optional): Custom ESLint configuration
- `filePath` (string, default: `"schema.graphql"`): File path for ESLint

**Result:**
- `isValid` (boolean): Whether the schema is valid (no errors)
- `issues` (SchemaIssue[]): Array of validation and linting issues
- `schema` (GraphQLSchema, optional): The parsed GraphQL schema if valid

### `formatSchemaIssues(issues)`

Formats issues for human-readable output.

**Parameters:**
- `issues` (SchemaIssue[]): Array of schema issues

**Returns:** `string`

### `assertValidSchema(result, options?)`

TypeScript assertion helper that throws if schema is invalid.

**Parameters:**
- `result` (SchemaCheckResult): Result from `checkGraphQLSchema`
- `options` (object, optional):
  - `failOnWarnings` (boolean, default: `false`): Also fail on warnings

**Throws:** Error with formatted issues if validation fails

## Issue Types

### SchemaIssue

```typescript
interface SchemaIssue {
  message: string;           // Error or warning message
  line?: number;             // Line number (1-indexed)
  column?: number;           // Column number (1-indexed)
  ruleId?: string;          // ESLint rule ID (for linting issues)
  severity: "error" | "warning";
  source: "validation" | "lint";
}
```

## Best Practices

1. **Always check `isValid` first** - This tells you if the schema is technically valid
2. **Filter by severity** - Use `severity === "error"` to check for critical issues
3. **Use `formatSchemaIssues`** - Provides readable output for test failures
4. **Customize linting rules** - Adjust rules to match your team's standards
5. **Skip linting on validation errors** - Prevents noise when schema is fundamentally broken

## Dependencies

- `graphql` - GraphQL reference implementation
- `@graphql-eslint/eslint-plugin` - GraphQL ESLint plugin (optional, gracefully degrades)
- `eslint` - ESLint core (required for linting)

## See Also

- [GraphQL Specification](https://spec.graphql.org/)
- [graphql-eslint Documentation](https://the-guild.dev/graphql/eslint)
- [Vitest Documentation](https://vitest.dev/)

