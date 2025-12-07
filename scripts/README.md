# Example Scripts

This directory contains example scripts demonstrating how to use the plugin system.

## transform-example.ts

A simple example demonstrating the basic transformer usage.

### What it does:

1. Creates a plugin registry
2. Registers a simple transformer (`add-description`)
3. Applies the transformer to the GraphQL grammar
4. Validates the transformed grammar
5. Generates JSON output

### Usage:

```bash
npm run transform-example
```

### The Transformer:

The `add-description` transformer is the simplest possible transformer. It:
- Takes a grammar and options
- Wraps rule definitions in a Sequence with an Optional Description
- Returns the transformed grammar

This demonstrates:
- How to create a transformer
- How to register it
- How to use it through the registry
- How transformations maintain grammar validity

### Output:

The script shows:
- Original grammar stats
- Transformation results
- Transformed grammar stats
- Validation status

### Next Steps:

- Modify the transformer to do more complex transformations
- Chain multiple transformers together
- Create your own custom transformers
- See [Transformer Use Cases](../docs/transformer-use-cases.md) for more ideas

