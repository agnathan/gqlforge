# Plugin Architecture

A flexible plugin system for parsing, transforming, and generating output from GraphQL grammar schemas.

## Overview

The plugin architecture consists of three main types of plugins:

1. **Parsers** - Parse input (e.g., GraphQL SDL) into a Grammar (Zod schema)
2. **Transformers** - Transform a Grammar (Zod schema) into another Grammar
3. **Generators** - Generate output from a Grammar (Zod schema) in various formats

## Data Flow

```
GraphQL SDL → [Parser] → Zod GraphQL Schema → [Transformer] → Zod GraphQL Schema → [Generator] → Output
```

- **Parser**: Converts GraphQL SDL text into structured Zod GraphQL Schema
- **Transformer**: Modifies the Zod GraphQL Schema structure
- **Generator**: Converts Zod GraphQL Schema into output formats (GraphQL SDL, JSON, TypeScript, etc.)

## Core Concepts

### Plugin Registry

The `PluginRegistry` manages registration and execution of plugins:

```typescript
import { PluginRegistry } from "./plugins";
import { GraphQLGrammar } from "./grammar";

const registry = new PluginRegistry();

// Register parsers
registry.registerParser("graphql-sdl", graphqlSDLParser);

// Register transformers
registry.registerTransformer("normalize", normalizeTransformer);
registry.registerTransformer("simplify", simplifyTransformer);

// Register generators
registry.registerGenerator("json", jsonGenerator);
registry.registerGenerator("typescript", typescriptGenerator);
```

### Parsers

Parsers convert input (like GraphQL SDL) into grammar structure:

```typescript
import { graphqlSDLParser } from "./plugins/parsers/graphql-sdl";

const sdl = `
  type User {
    id: ID!
    name: String!
  }
`;

// Parse GraphQL SDL into Zod GraphQL Grammar
const grammar = graphqlSDLParser.parse(sdl, {
  strict: true,
  validate: true,
});
```

### Transformers

Transformers modify the grammar structure:

```typescript
import { normalizeTransformer } from "./plugins/transformers/normalize";

// Transform grammar
const transformed = normalizeTransformer.transform(GraphQLGrammar, {
  sortRules: true,
  removeDuplicateOptions: true,
});
```

### Generators

Generators produce output from the grammar:

```typescript
import { jsonGenerator } from "./plugins/generators/json";

// Generate JSON output
const json = jsonGenerator.generate(GraphQLGrammar, {
  pretty: true,
  includeMetadata: true,
});
```

## Built-in Plugins

### Transformers

#### `normalizeTransformer`

Normalizes grammar structure:
- Sorts rules alphabetically
- Removes duplicate options in OneOf
- Removes empty sequences

```typescript
registry.registerTransformer("normalize", normalizeTransformer);
const result = registry.transform(grammar, ["normalize"], {
  normalize: {
    sortRules: true,
    removeDuplicateOptions: true,
  },
});
```

#### `simplifyTransformer`

Simplifies grammar structure:
- Flattens nested sequences
- Removes single-element sequences
- Removes single-option OneOf

```typescript
registry.registerTransformer("simplify", simplifyTransformer);
const result = registry.transform(grammar, ["simplify"]);
```

#### `validateTransformer`

Validates grammar structure:
- Checks for missing references
- Checks for unreferenced rules
- Optionally throws on validation errors

```typescript
registry.registerTransformer("validate", validateTransformer);
const result = registry.transform(grammar, ["validate"], {
  validate: {
    throwOnError: false,
    checkMissingReferences: true,
  },
});
```

### Generators

#### `jsonGenerator`

Generates JSON representation:

```typescript
registry.registerGenerator("json", jsonGenerator);
const result = registry.generate(grammar, "json", {
  pretty: true,
  includeMetadata: true,
});
```

#### `typescriptGenerator`

Generates TypeScript type definitions:

```typescript
registry.registerGenerator("typescript", typescriptGenerator);
const result = registry.generate(grammar, "typescript", {
  exportTypes: true,
  includeComments: true,
});
```

#### `graphqlSDLGenerator`

Generates GraphQL Schema Definition Language:

```typescript
registry.registerGenerator("graphql-sdl", graphqlSDLGenerator);
const result = registry.generate(grammar, "graphql-sdl", {
  format: true,
  includeDescriptions: true,
});
```

## Creating Custom Plugins

### Custom Parser

```typescript
import type { Parser, PluginOptions } from "./plugins/types";
import type { Grammar } from "../grammar";

interface MyParserOptions extends PluginOptions {
  customOption?: boolean;
}

export const myParser: Parser<string> = {
  metadata: {
    name: "my-parser",
    version: "1.0.0",
    description: "My custom parser",
  },

  validateOptions(options: unknown): options is MyParserOptions {
    return typeof options === "object" && options !== null;
  },

  getInputFormat(): string {
    return "custom-format";
  },

  parse(input: string, options?: MyParserOptions): Grammar {
    // Parse input into grammar
    return {
      root: "Document",
      rules: {},
    };
  },
};
```

### Custom Transformer

```typescript
import type { Transformer, PluginOptions } from "./plugins/types";
import type { Grammar } from "../grammar";

interface MyTransformerOptions extends PluginOptions {
  customOption?: boolean;
}

export const myTransformer: Transformer = {
  metadata: {
    name: "my-transformer",
    version: "1.0.0",
    description: "My custom transformer",
  },

  validateOptions(options: unknown): options is MyTransformerOptions {
    // Validate options
    return typeof options === "object" && options !== null;
  },

  transform(grammar: Grammar, options?: MyTransformerOptions): Grammar {
    // Transform grammar
    return {
      ...grammar,
      // ... modifications
    };
  },
};
```

### Custom Generator

```typescript
import type { Generator, PluginOptions } from "./plugins/types";
import type { Grammar } from "../grammar";

interface MyGeneratorOptions extends PluginOptions {
  format?: boolean;
}

export const myGenerator: Generator<string> = {
  metadata: {
    name: "my-generator",
    version: "1.0.0",
    description: "My custom generator",
  },

  validateOptions(options: unknown): options is MyGeneratorOptions {
    return typeof options === "object" && options !== null;
  },

  getOutputFormat(): string {
    return "custom-format";
  },

  generate(grammar: Grammar, options?: MyGeneratorOptions): string {
    // Generate output
    return "generated output";
  },
};
```

## Complete Workflow

Parse → Transform → Generate:

```typescript
// 1. Parse GraphQL SDL into Zod GraphQL Schema
const parsed = registry.parse(graphQLSDL, "graphql-sdl");

// 2. Transform the schema
const transformed = registry.transform(
  parsed.grammar,
  ["normalize", "simplify"],
  {
    normalize: { sortRules: true },
    simplify: { flattenSequences: true },
  }
);

// 3. Generate output
const json = registry.generate(transformed.grammar, "json", {
  pretty: true,
});
```

## Transformer Pipeline

Execute multiple transformers in sequence:

```typescript
const result = registry.transform(
  GraphQLGrammar,
  ["normalize", "simplify", "validate"],
  {
    normalize: { sortRules: true },
    simplify: { flattenSequences: true },
    validate: { throwOnError: false },
  }
);

console.log(result.grammar);
console.log(result.transformer); // "normalize -> simplify -> validate"
```

## Error Handling

Plugins throw `PluginError` for better error tracking:

```typescript
import { PluginError } from "./plugins/types";

try {
  registry.transform(grammar, ["nonexistent"]);
} catch (error) {
  if (error instanceof PluginError) {
    console.error(`Plugin ${error.pluginId} failed:`, error.message);
    console.error("Cause:", error.cause);
  }
}
```

## Default Registry

Use the default registry instance:

```typescript
import { defaultRegistry } from "./plugins";

defaultRegistry.registerTransformer("normalize", normalizeTransformer);
defaultRegistry.registerGenerator("json", jsonGenerator);
```

