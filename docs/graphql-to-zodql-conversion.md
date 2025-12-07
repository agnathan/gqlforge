# Converting GraphQL Schema to ZodQL Schema

This guide demonstrates how to convert a GraphQL Schema Definition Language (SDL) file into a Zod GraphQL Schema using the parser plugin system.

## Overview

The conversion process uses a **Parser** plugin to read GraphQL SDL files and convert them into the structured Zod GraphQL Schema format. This allows you to:

- Parse GraphQL schema files programmatically
- Validate schema structure with Zod
- Transform schemas using transformer plugins
- Generate output in various formats using generator plugins

## Quick Start

```typescript
import { PluginRegistry } from "./src/plugins";
import { graphqlSDLParser } from "./src/plugins/parsers/graphql-sdl";
import { readFileSync } from "fs";

// Create registry and register parser
const registry = new PluginRegistry();
registry.registerParser("graphql-sdl", graphqlSDLParser);

// Read GraphQL schema file
const schemaFile = readFileSync("./schema.graphql", "utf-8");

// Parse GraphQL SDL into Zod GraphQL Schema
const result = registry.parse(schemaFile, "graphql-sdl", {
  strict: true,
  validate: true,
});

// Access the parsed grammar
const zodQLSchema = result.grammar;
```

## Step-by-Step Guide

### Step 1: Prepare Your GraphQL Schema File

Create a GraphQL schema file (e.g., `schema.graphql`):

```graphql
# schema.graphql
type Query {
  user(id: ID!): User
  users(limit: Int = 10): [User!]!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
  tags: [String!]!
}

scalar DateTime
```

### Step 2: Set Up the Parser

```typescript
import { PluginRegistry } from "./src/plugins";
import { graphqlSDLParser } from "./src/plugins/parsers/graphql-sdl";

const registry = new PluginRegistry();
registry.registerParser("graphql-sdl", graphqlSDLParser);
```

### Step 3: Read and Parse the Schema File

```typescript
import { readFileSync } from "fs";
import { join } from "path";

// Read the GraphQL schema file
const schemaPath = join(process.cwd(), "schema.graphql");
const graphQLSDL = readFileSync(schemaPath, "utf-8");

// Parse into Zod GraphQL Schema
const parseResult = registry.parse(graphQLSDL, "graphql-sdl", {
  strict: true,        // Throw errors on invalid input
  preserveComments: true,  // Keep comments/descriptions
  validate: true,      // Validate the parsed grammar
});
```

### Step 4: Access the ZodQL Schema

```typescript
const zodQLSchema = parseResult.grammar;

// The schema structure:
// {
//   root: "Document",
//   rules: {
//     Query: { name: "Query", definition: ... },
//     User: { name: "User", definition: ... },
//     // ... other rules
//   }
// }
```

### Step 5: Validate the Parsed Schema

```typescript
import { validateGrammar } from "./src/grammar-zod";

// Validate the parsed grammar structure
if (validateGrammar(zodQLSchema)) {
  console.log("✓ Schema parsed and validated successfully");
  
  // Access individual rules
  const queryRule = zodQLSchema.rules.Query;
  const userRule = zodQLSchema.rules.User;
  
  console.log(`Found ${Object.keys(zodQLSchema.rules).length} rules`);
} else {
  console.error("✗ Invalid grammar structure");
}
```

## Complete Example

Here's a complete example that reads a GraphQL schema file and converts it to ZodQL:

```typescript
import { PluginRegistry } from "./src/plugins";
import { graphqlSDLParser } from "./src/plugins/parsers/graphql-sdl";
import { validateGrammar } from "./src/grammar-zod";
import { readFileSync } from "fs";
import { join } from "path";

async function convertGraphQLToZodQL(schemaPath: string) {
  // 1. Create registry and register parser
  const registry = new PluginRegistry();
  registry.registerParser("graphql-sdl", graphqlSDLParser);

  // 2. Read GraphQL schema file
  console.log(`Reading schema from: ${schemaPath}`);
  const graphQLSDL = readFileSync(schemaPath, "utf-8");

  // 3. Parse GraphQL SDL into Zod GraphQL Schema
  console.log("Parsing GraphQL SDL...");
  const parseResult = registry.parse(graphQLSDL, "graphql-sdl", {
    strict: true,
    preserveComments: true,
    validate: true,
  });

  // 4. Validate the parsed grammar
  const zodQLSchema = parseResult.grammar;
  if (!validateGrammar(zodQLSchema)) {
    throw new Error("Parsed schema failed validation");
  }

  // 5. Return the ZodQL schema
  console.log(`✓ Successfully parsed ${Object.keys(zodQLSchema.rules).length} rules`);
  return zodQLSchema;
}

// Usage
const zodQLSchema = await convertGraphQLToZodQL("./schema.graphql");
```

## Using with Transformers

After parsing, you can transform the schema:

```typescript
import { normalizeTransformer, simplifyTransformer } from "./src/plugins/transformers";

const registry = new PluginRegistry();
registry.registerParser("graphql-sdl", graphqlSDLParser);
registry.registerTransformer("normalize", normalizeTransformer);
registry.registerTransformer("simplify", simplifyTransformer);

// Parse GraphQL SDL
const parseResult = registry.parse(graphQLSDL, "graphql-sdl");

// Transform the parsed schema
const transformed = registry.transform(
  parseResult.grammar,
  ["normalize", "simplify"],
  {
    normalize: { sortRules: true, removeDuplicateOptions: true },
    simplify: { flattenSequences: true },
  }
);

console.log("Transformed schema:", transformed.grammar);
```

## Using with Generators

Convert ZodQL schema back to other formats:

```typescript
import { jsonGenerator, typescriptGenerator } from "./src/plugins/generators";

const registry = new PluginRegistry();
registry.registerParser("graphql-sdl", graphqlSDLParser);
registry.registerGenerator("json", jsonGenerator);
registry.registerGenerator("typescript", typescriptGenerator);

// Parse GraphQL SDL
const parseResult = registry.parse(graphQLSDL, "graphql-sdl");

// Generate JSON output
const jsonOutput = registry.generate(parseResult.grammar, "json", {
  pretty: true,
  includeMetadata: true,
});

// Generate TypeScript types
const tsOutput = registry.generate(parseResult.grammar, "typescript", {
  exportTypes: true,
  includeComments: true,
});
```

## Complete Workflow Example

Here's a complete workflow: Parse → Transform → Generate:

```typescript
import { PluginRegistry } from "./src/plugins";
import { graphqlSDLParser } from "./src/plugins/parsers/graphql-sdl";
import { normalizeTransformer } from "./src/plugins/transformers/normalize";
import { jsonGenerator } from "./src/plugins/generators/json";
import { readFileSync } from "fs";

function processGraphQLSchema(schemaPath: string) {
  const registry = new PluginRegistry();

  // Register all plugins
  registry.registerParser("graphql-sdl", graphqlSDLParser);
  registry.registerTransformer("normalize", normalizeTransformer);
  registry.registerGenerator("json", jsonGenerator);

  // Step 1: Parse GraphQL SDL file
  const graphQLSDL = readFileSync(schemaPath, "utf-8");
  const parseResult = registry.parse(graphQLSDL, "graphql-sdl", {
    strict: true,
    validate: true,
  });

  console.log(`✓ Parsed ${Object.keys(parseResult.grammar.rules).length} rules`);

  // Step 2: Transform the schema
  const transformResult = registry.transform(
    parseResult.grammar,
    ["normalize"],
    {
      normalize: { sortRules: true },
    }
  );

  console.log(`✓ Transformed with: ${transformResult.transformer}`);

  // Step 3: Generate JSON output
  const generateResult = registry.generate(
    transformResult.grammar,
    "json",
    {
      pretty: true,
      includeMetadata: true,
    }
  );

  console.log(`✓ Generated ${generateResult.format} output`);

  return {
    parsed: parseResult.grammar,
    transformed: transformResult.grammar,
    json: generateResult.output,
  };
}

// Usage
const result = processGraphQLSchema("./schema.graphql");
console.log(result.json);
```

## Parser Options

The GraphQL SDL parser supports the following options:

```typescript
interface GraphQLSDLParserOptions {
  /**
   * Strict mode - throw on parsing errors
   * @default true
   */
  strict?: boolean;

  /**
   * Include comments/descriptions
   * @default true
   */
  preserveComments?: boolean;

  /**
   * Validate parsed grammar
   * @default true
   */
  validate?: boolean;
}
```

### Example with Options

```typescript
// Strict parsing with validation
const result1 = registry.parse(schema, "graphql-sdl", {
  strict: true,
  validate: true,
});

// Lenient parsing without validation
const result2 = registry.parse(schema, "graphql-sdl", {
  strict: false,
  validate: false,
  preserveComments: false,
});
```

## Error Handling

Handle parsing errors gracefully:

```typescript
import { PluginError } from "./src/plugins/types";

try {
  const result = registry.parse(schema, "graphql-sdl", {
    strict: true,
  });
} catch (error) {
  if (error instanceof PluginError) {
    console.error(`Parser error [${error.pluginId}]:`, error.message);
    if (error.cause) {
      console.error("Cause:", error.cause);
    }
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Validating Parsed Schema

Always validate the parsed schema:

```typescript
import { validateGrammar, validateProductionRule } from "./src/grammar-zod";

const parseResult = registry.parse(schema, "graphql-sdl");
const grammar = parseResult.grammar;

// Validate entire grammar
if (!validateGrammar(grammar)) {
  throw new Error("Invalid grammar structure");
}

// Validate individual rules
Object.entries(grammar.rules).forEach(([name, rule]) => {
  if (!validateProductionRule(rule)) {
    throw new Error(`Invalid rule: ${name}`);
  }
  console.log(`✓ Validated rule: ${name}`);
});
```

## Working with Multiple Schema Files

Parse and merge multiple schema files:

```typescript
import { PluginRegistry } from "./src/plugins";
import { graphqlSDLParser } from "./src/plugins/parsers/graphql-sdl";
import { readFileSync } from "fs";
import { glob } from "glob";

async function parseMultipleSchemas(pattern: string) {
  const registry = new PluginRegistry();
  registry.registerParser("graphql-sdl", graphqlSDLParser);

  const schemaFiles = glob.sync(pattern);
  const parsedSchemas: Grammar[] = [];

  for (const file of schemaFiles) {
    const sdl = readFileSync(file, "utf-8");
    const result = registry.parse(sdl, "graphql-sdl");
    parsedSchemas.push(result.grammar);
  }

  // Merge schemas (you would implement merge logic)
  return mergeGrammars(parsedSchemas);
}
```

## Best Practices

### 1. Always Validate

```typescript
const result = registry.parse(schema, "graphql-sdl", {
  validate: true, // Always validate parsed grammar
});
```

### 2. Use Strict Mode in Production

```typescript
const result = registry.parse(schema, "graphql-sdl", {
  strict: true, // Fail fast on errors
});
```

### 3. Preserve Comments for Documentation

```typescript
const result = registry.parse(schema, "graphql-sdl", {
  preserveComments: true, // Keep descriptions
});
```

### 4. Handle Errors Gracefully

```typescript
try {
  const result = registry.parse(schema, "graphql-sdl");
} catch (error) {
  // Log and handle errors appropriately
  console.error("Parsing failed:", error);
}
```

### 5. Use TypeScript Types

```typescript
import type { Grammar } from "./src/grammar";

const result = registry.parse(schema, "graphql-sdl");
const grammar: Grammar = result.grammar; // Fully typed
```

## Common Use Cases

### Use Case 1: Schema Validation Tool

```typescript
function validateSchemaFile(schemaPath: string): boolean {
  const registry = new PluginRegistry();
  registry.registerParser("graphql-sdl", graphqlSDLParser);

  const sdl = readFileSync(schemaPath, "utf-8");
  const result = registry.parse(sdl, "graphql-sdl", {
    strict: true,
    validate: true,
  });

  return validateGrammar(result.grammar);
}
```

### Use Case 2: Schema Converter

```typescript
function convertSchema(schemaPath: string, outputFormat: "json" | "typescript") {
  const registry = new PluginRegistry();
  registry.registerParser("graphql-sdl", graphqlSDLParser);
  registry.registerGenerator("json", jsonGenerator);
  registry.registerGenerator("typescript", typescriptGenerator);

  const sdl = readFileSync(schemaPath, "utf-8");
  const parseResult = registry.parse(sdl, "graphql-sdl");
  
  return registry.generate(parseResult.grammar, outputFormat);
}
```

### Use Case 3: Schema Transformation Pipeline

```typescript
function transformSchema(
  schemaPath: string,
  transformers: string[]
): Grammar {
  const registry = new PluginRegistry();
  registry.registerParser("graphql-sdl", graphqlSDLParser);
  registry.registerTransformer("normalize", normalizeTransformer);
  registry.registerTransformer("simplify", simplifyTransformer);

  const sdl = readFileSync(schemaPath, "utf-8");
  const parseResult = registry.parse(sdl, "graphql-sdl");

  return registry.transform(parseResult.grammar, transformers).grammar;
}
```

## Troubleshooting

### Issue: Parser Not Found

```typescript
// Make sure parser is registered
registry.registerParser("graphql-sdl", graphqlSDLParser);

// Check if parser exists
const parser = registry.getParser("graphql-sdl");
if (!parser) {
  throw new Error("Parser not registered");
}
```

### Issue: Invalid Schema Structure

```typescript
// Enable validation to catch issues early
const result = registry.parse(schema, "graphql-sdl", {
  validate: true,
  strict: true,
});

// Manually validate
if (!validateGrammar(result.grammar)) {
  throw new Error("Invalid grammar structure");
}
```

### Issue: Parsing Errors

```typescript
try {
  const result = registry.parse(schema, "graphql-sdl", {
    strict: true,
  });
} catch (error) {
  if (error instanceof PluginError) {
    // Handle parser-specific errors
    console.error(`Parser [${error.pluginId}] failed:`, error.message);
  }
}
```

## Next Steps

- See [GraphQL to Zod Patterns](./graphql-to-zod-patterns.md) for understanding the grammar structure
- Check [Plugin Architecture](../src/plugins/README.md) for advanced plugin usage
- Explore [Plugin Naming Convention](./plugin-naming-convention.md) to understand plugin types

## Summary

Converting a GraphQL schema file to ZodQL Schema involves:

1. **Reading** the GraphQL SDL file
2. **Parsing** it using the `graphqlSDLParser` plugin
3. **Validating** the parsed grammar structure
4. **Optionally transforming** the schema
5. **Optionally generating** output in other formats

The parser plugin provides a clean, type-safe way to convert GraphQL schemas into the structured Zod GraphQL Schema format, enabling programmatic manipulation and validation of GraphQL schemas.

