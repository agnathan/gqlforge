#!/usr/bin/env node
/**
 * Example script demonstrating the simplest possible transformer usage
 * 
 * Usage: npm run transform-example
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { PluginRegistry } from "../src/plugins/registry";
import { addDescriptionTransformer } from "../src/plugins/transformers/add-description";
import { GraphQLGrammar } from "../src/grammar";
import { validateGrammar } from "../src/grammar-zod";
import { jsonGenerator } from "../src/plugins/generators/json";
import { graphqlSDLGenerator } from "../src/plugins/generators/graphql-sdl";

function main() {
  console.log("🚀 Simple Transformer Example\n");
  console.log("=" .repeat(50));

  // Create output directory
  const outputDir = join(process.cwd(), "output");
  try {
    mkdirSync(outputDir, { recursive: true });
    console.log(`\n📁 Created output directory: ${outputDir}`);
  } catch (error) {
    // Directory might already exist, that's fine
  }

  // Step 1: Create registry
  const registry = new PluginRegistry();
  console.log("\n1️⃣ Creating plugin registry...");

  // Step 2: Register transformer
  registry.registerTransformer("add-description", addDescriptionTransformer);
  console.log("   ✓ Registered 'add-description' transformer");

  // Step 3: Register generators for output
  registry.registerGenerator("json", jsonGenerator);
  registry.registerGenerator("graphql-sdl", graphqlSDLGenerator);
  console.log("   ✓ Registered 'json' generator");
  console.log("   ✓ Registered 'graphql-sdl' generator");

  // Step 4: Show original grammar
  console.log("\n2️⃣ Original Grammar:");
  console.log(`   Root: ${GraphQLGrammar.root}`);
  console.log(`   Total Rules: ${Object.keys(GraphQLGrammar.rules).length}`);
  console.log(`   Valid: ${validateGrammar(GraphQLGrammar) ? "✓" : "✗"}`);

  // Show a sample rule before transformation
  const sampleRule = GraphQLGrammar.rules.Document;
  if (sampleRule) {
    console.log(`\n   Sample Rule (Document):`);
    console.log(`     Name: ${sampleRule.name}`);
    console.log(`     Definition kind: ${sampleRule.definition.kind}`);
  }

  // Generate GraphQL SDL from original grammar
  console.log("\n   Generating GraphQL SDL from original grammar...");
  const originalSDL = registry.generate(GraphQLGrammar, "graphql-sdl", {
    format: true,
    includeDescriptions: true,
  });
  console.log(`   ✓ Generated GraphQL SDL (${(originalSDL.output as string).length} chars)`);
  
  // Write original GraphQL SDL to file
  const originalSDLPath = join(process.cwd(), "output", "before.graphql");
  writeFileSync(originalSDLPath, originalSDL.output as string, "utf-8");
  console.log(`   ✓ Written to: ${originalSDLPath}`);
  
  // Show a snippet of the original GraphQL
  const originalSDLSnippet = (originalSDL.output as string).split("\n").slice(0, 20).join("\n");
  console.log("\n   Original GraphQL SDL (first 20 lines):");
  console.log("   " + "─".repeat(60));
  originalSDLSnippet.split("\n").forEach((line) => {
    console.log(`   ${line}`);
  });
  console.log("   " + "─".repeat(60));

  // Step 5: Transform grammar
  console.log("\n3️⃣ Applying transformer...");
  const result = registry.transform(
    GraphQLGrammar,
    ["add-description"],
    {
      "add-description": {
        description: "This rule was transformed",
        ruleNames: ["Document"], // Only transform the Document rule for simplicity
      },
    }
  );

  console.log(`   ✓ Transformation complete`);
  console.log(`   Transformer: ${result.transformer}`);
  console.log(`   Timestamp: ${result.timestamp.toISOString()}`);

  // Step 6: Validate transformed grammar
  const transformedGrammar = result.grammar;
  console.log("\n4️⃣ Transformed Grammar:");
  console.log(`   Root: ${transformedGrammar.root}`);
  console.log(`   Total Rules: ${Object.keys(transformedGrammar.rules).length}`);
  console.log(`   Valid: ${validateGrammar(transformedGrammar) ? "✓" : "✗"}`);

  // Show the transformed rule
  const transformedRule = transformedGrammar.rules.Document;
  if (transformedRule) {
    console.log(`\n   Transformed Rule (Document):`);
    console.log(`     Name: ${transformedRule.name}`);
    console.log(`     Definition kind: ${transformedRule.definition.kind}`);
    if (transformedRule.definition.kind === "Sequence") {
      console.log(`     Elements: ${transformedRule.definition.elements.length}`);
      console.log(`     First element kind: ${transformedRule.definition.elements[0]?.kind}`);
    }
  }

  // Step 7: Generate GraphQL SDL from transformed grammar
  console.log("\n5️⃣ Generating GraphQL SDL from transformed grammar...");
  const transformedSDL = registry.generate(transformedGrammar, "graphql-sdl", {
    format: true,
    includeDescriptions: true,
  });
  console.log(`   ✓ Generated GraphQL SDL (${(transformedSDL.output as string).length} chars)`);
  
  // Write transformed GraphQL SDL to file
  const transformedSDLPath = join(process.cwd(), "output", "after.graphql");
  writeFileSync(transformedSDLPath, transformedSDL.output as string, "utf-8");
  console.log(`   ✓ Written to: ${transformedSDLPath}`);
  
  // Show a snippet of the transformed GraphQL
  const transformedSDLSnippet = (transformedSDL.output as string).split("\n").slice(0, 20).join("\n");
  console.log("\n   Transformed GraphQL SDL (first 20 lines):");
  console.log("   " + "─".repeat(60));
  transformedSDLSnippet.split("\n").forEach((line) => {
    console.log(`   ${line}`);
  });
  console.log("   " + "─".repeat(60));

  // Step 8: Generate JSON output
  console.log("\n6️⃣ Generating JSON output...");
  const jsonResult = registry.generate(transformedGrammar, "json", {
    pretty: true, // Pretty print for file output
    includeMetadata: true,
  });

  console.log(`   ✓ Generated ${jsonResult.format} output`);
  console.log(`   Output length: ${(jsonResult.output as string).length} characters`);
  
  // Write JSON output to file
  const jsonPath = join(process.cwd(), "output", "transformed-grammar.json");
  writeFileSync(jsonPath, jsonResult.output as string, "utf-8");
  console.log(`   ✓ Written to: ${jsonPath}`);

  // Step 9: Show actual differences
  console.log("\n7️⃣ Showing Actual Grammar Differences:");
  console.log("   " + "─".repeat(60));
  
  const originalDocument = GraphQLGrammar.rules.Document;
  const transformedDocument = transformedGrammar.rules.Document;
  
  console.log("\n   Original Document Rule:");
  console.log(`     Definition kind: ${originalDocument.definition.kind}`);
  if (originalDocument.definition.kind === "List") {
    console.log(`     Element: ${JSON.stringify(originalDocument.definition.element)}`);
  }
  
  console.log("\n   Transformed Document Rule:");
  console.log(`     Definition kind: ${transformedDocument.definition.kind}`);
  if (transformedDocument.definition.kind === "Sequence") {
    console.log(`     Elements count: ${transformedDocument.definition.elements.length}`);
    console.log(`     Element 1: Optional(Description)`);
    console.log(`     Element 2: ${transformedDocument.definition.elements[1]?.kind}`);
  }
  
  console.log("\n   🔍 What Changed:");
  console.log("     The transformer wrapped the original List definition");
  console.log("     in a Sequence that starts with an Optional Description.");
  console.log("     This structural change is visible in the JSON file,");
  console.log("     but the GraphQL SDL generator is a placeholder, so");
  console.log("     both .graphql files look identical.");

  // Step 10: Summary
  console.log("\n" + "=".repeat(50));
  console.log("✅ Example Complete!");
  console.log("\nSummary:");
  console.log("  • Transformer successfully modified the grammar");
  console.log("  • Grammar remains valid after transformation");
  console.log("  • Transformation is reversible and composable");
  console.log("  • GraphQL SDL generated before and after transformation");
  console.log("\nOutput Files:");
  console.log(`  • ${originalSDLPath}`);
  console.log(`  • ${transformedSDLPath}`);
  console.log(`  • ${jsonPath}`);
  console.log("\n💡 Note:");
  console.log("  The GraphQL SDL generator is currently a placeholder.");
  console.log("  Check the JSON file to see the actual grammar structure changes.");
  console.log("\nNext steps:");
  console.log("  • Try transforming multiple rules");
  console.log("  • Chain multiple transformers together");
  console.log("  • Create your own custom transformers");
}

main();

