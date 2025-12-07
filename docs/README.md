# Documentation

This directory contains comprehensive documentation for the GraphQL Grammar to Zod schema translation system.

## Documentation Index

- **[GraphQL to Zod Patterns](./graphql-to-zod-patterns.md)** - Complete guide demonstrating how to translate common GraphQL patterns into Zod GraphQL schemas
- **[GraphQL to ZodQL Conversion](./graphql-to-zodql-conversion.md)** - Step-by-step guide for converting GraphQL schema files to ZodQL Schema
- **[Plugin Naming Convention](./plugin-naming-convention.md)** - Explanation of the three plugin types: Parser, Transformer, and Generator

## Quick Start

1. **Understanding the Grammar Structure**: Read about the grammar types in `src/grammar.ts`
2. **Translation Patterns**: See `graphql-to-zod-patterns.md` for examples
3. **Plugin Architecture**: Check `src/plugins/README.md` for parser, transformer, and generator usage
4. **Naming Convention**: See `plugin-naming-convention.md` to understand why plugins are named as they are

## Key Concepts

### Grammar Elements

- **Terminal**: Lexical tokens (keywords, punctuators)
- **NonTerminal**: References to other rules
- **Sequence**: Ordered sequence of elements
- **OneOf**: Alternatives (OR)
- **Optional**: Optional elements
- **List**: One or more occurrences

### Translation Process

1. Start with GraphQL SDL
2. Break down into grammar elements
3. Represent using Zod grammar structure
4. Validate with Zod schemas
5. Transform or generate output as needed

## Examples

See `graphql-to-zod-patterns.md` for comprehensive examples covering:
- Basic types
- Object types
- Enums and unions
- Input types
- Queries and mutations
- Fragments and variables

