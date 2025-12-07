# Plugin Naming Convention

This document explains the naming convention for the three types of plugins in the system.

## Plugin Types

The plugin architecture uses three distinct plugin types, each with a specific purpose and data flow:

### 1. **Parser** 🔄
**Direction**: Input → Zod GraphQL Schema

**Purpose**: Converts external formats (like GraphQL SDL text) into the internal Zod GraphQL Schema representation.

**Example**:
```typescript
const parser: Parser<string> = {
  parse(sdl: string): Grammar {
    // Parse GraphQL SDL string into Grammar structure
    return grammar;
  }
};
```

**Why "Parser"?**
- Standard term in programming for converting text/structured data into an internal representation
- Clearly indicates parsing input (text) into structured format
- Inverse operation of a generator
- Well-understood concept: "parse" means to analyze and convert

### 2. **Transformer** 🔀
**Direction**: Zod GraphQL Schema → Zod GraphQL Schema

**Purpose**: Modifies the Zod GraphQL Schema structure while maintaining the same format.

**Example**:
```typescript
const transformer: Transformer = {
  transform(grammar: Grammar): Grammar {
    // Modify grammar structure
    return modifiedGrammar;
  }
};
```

**Why "Transformer"?**
- Clearly indicates transformation/modification
- Maintains same input/output type (Grammar → Grammar)
- Standard term for data transformation operations

### 3. **Generator** 📤
**Direction**: Zod GraphQL Schema → Output

**Purpose**: Converts the internal Zod GraphQL Schema into external formats (GraphQL SDL, JSON, TypeScript, etc.).

**Example**:
```typescript
const generator: Generator<string> = {
  generate(grammar: Grammar): string {
    // Generate GraphQL SDL from grammar
    return sdl;
  }
};
```

**Why "Generator"?**
- Standard term for producing output from structured data
- Clearly indicates generation of output
- Inverse operation of a parser
- Well-understood concept: "generate" means to create/produce

## Data Flow

```
┌─────────────┐
│ GraphQL SDL │
└──────┬──────┘
       │
       ▼
   ┌────────┐
   │ Parser │  ← Converts text to structure
   └───┬────┘
       │
       ▼
┌──────────────────┐
│ Zod GraphQL      │
│ Schema           │
└──────┬───────────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
  ┌─────────┐    ┌─────────┐
  │Transform│    │Transform│  ← Modifies structure
  └────┬────┘    └────┬────┘
       │              │
       └──────┬───────┘
              │
              ▼
       ┌──────────┐
       │Generator │  ← Converts structure to output
       └────┬─────┘
            │
            ▼
    ┌──────────────┐
    │ GraphQL SDL │
    │ JSON        │
    │ TypeScript  │
    │ etc.        │
    └──────────────┘
```

## Complete Workflow Example

```typescript
import { PluginRegistry } from "./plugins";
import { graphqlSDLParser } from "./plugins/parsers/graphql-sdl";
import { normalizeTransformer } from "./plugins/transformers/normalize";
import { jsonGenerator } from "./plugins/generators/json";

const registry = new PluginRegistry();

// Register plugins
registry.registerParser("graphql-sdl", graphqlSDLParser);
registry.registerTransformer("normalize", normalizeTransformer);
registry.registerGenerator("json", jsonGenerator);

// Complete workflow: Parse → Transform → Generate
const sdl = `
  type User {
    id: ID!
    name: String!
  }
`;

// 1. Parser: GraphQL SDL → Zod GraphQL Schema
const parsed = registry.parse(sdl, "graphql-sdl");

// 2. Transformer: Zod GraphQL Schema → Modified Zod GraphQL Schema
const transformed = registry.transform(parsed.grammar, ["normalize"]);

// 3. Generator: Zod GraphQL Schema → JSON
const json = registry.generate(transformed.grammar, "json");
```

## Alternative Names Considered

### For "Parser"
- **Loader**: Could work, but "parser" is more specific (parsing text)
- **Importer**: Suggests importing from external source, but less precise
- **Converter**: Too generic, doesn't indicate direction
- **Reader**: Less specific about the parsing operation

**Decision**: "Parser" is the most accurate and widely understood term.

### For "Transformer"
- **Modifier**: Less standard term
- **Mutator**: Implies mutation, but we return new structure
- **Processor**: Too generic

**Decision**: "Transformer" clearly indicates transformation while maintaining type.

### For "Generator"
- **Serializer**: Could work, but "generator" is more general
- **Exporter**: Suggests exporting, but less precise
- **Writer**: Less specific about generation

**Decision**: "Generator" is the standard term for producing output from structured data.

## Summary

| Plugin Type | Input | Output | Purpose | Name Rationale |
|------------|-------|--------|---------|----------------|
| **Parser** | GraphQL SDL (text) | Zod GraphQL Schema | Convert text to structure | Standard term for parsing text into structured format |
| **Transformer** | Zod GraphQL Schema | Zod GraphQL Schema | Modify structure | Standard term for transforming data |
| **Generator** | Zod GraphQL Schema | GraphQL SDL/JSON/etc. | Convert structure to output | Standard term for generating output from structured data |

The naming convention follows standard programming terminology and clearly indicates the direction and purpose of each plugin type.

