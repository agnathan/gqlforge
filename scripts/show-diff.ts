#!/usr/bin/env node
/**
 * Script to show the actual differences in grammar structure
 */

import { GraphQLGrammar } from "../src/grammar";
import { PluginRegistry } from "../src/plugins/registry";
import { addDescriptionTransformer } from "../src/plugins/transformers/add-description";
import { jsonGenerator } from "../src/plugins/generators/json";

function main() {
  console.log("🔍 Showing Grammar Structure Differences\n");
  console.log("=".repeat(60));

  const registry = new PluginRegistry();
  registry.registerTransformer("add-description", addDescriptionTransformer);
  registry.registerGenerator("json", jsonGenerator);

  // Get original Document rule
  const originalDocument = GraphQLGrammar.rules.Document;
  
  // Transform
  const result = registry.transform(
    GraphQLGrammar,
    ["add-description"],
    {
      "add-description": {
        description: "This rule was transformed",
        ruleNames: ["Document"],
      },
    }
  );
  
  const transformedDocument = result.grammar.rules.Document;

  console.log("\n📋 Original Document Rule Structure:");
  console.log(JSON.stringify(originalDocument, null, 2));

  console.log("\n📋 Transformed Document Rule Structure:");
  console.log(JSON.stringify(transformedDocument, null, 2));

  console.log("\n🔍 Key Differences:");
  console.log("  Original:");
  console.log(`    - Definition kind: ${originalDocument.definition.kind}`);
  if (originalDocument.definition.kind === "List") {
    console.log(`    - Element: ${JSON.stringify(originalDocument.definition.element)}`);
  }

  console.log("\n  Transformed:");
  console.log(`    - Definition kind: ${transformedDocument.definition.kind}`);
  if (transformedDocument.definition.kind === "Sequence") {
    console.log(`    - Elements count: ${transformedDocument.definition.elements.length}`);
    console.log(`    - First element (Optional Description):`);
    console.log(`      ${JSON.stringify(transformedDocument.definition.elements[0], null, 6)}`);
    console.log(`    - Second element (original List):`);
    console.log(`      ${JSON.stringify(transformedDocument.definition.elements[1], null, 6)}`);
  }

  console.log("\n✅ Summary:");
  console.log("  The transformer wrapped the original List definition");
  console.log("  in a Sequence that starts with an Optional Description.");
  console.log("  This change is visible in the grammar structure (JSON),");
  console.log("  but the GraphQL SDL generator is a placeholder, so");
  console.log("  both .graphql files look the same.");
}

main();

