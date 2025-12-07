#!/usr/bin/env node
/**
 * Minimal example: Add field to schema and write JSON
 */

import { GraphQLGrammar } from "../src/grammar";
import { PluginRegistry } from "../src/plugins/registry";
import { addFieldTransformer } from "../src/plugins/transformers/add-field";
import { jsonGenerator } from "../src/plugins/generators/json";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const registry = new PluginRegistry();
registry.registerTransformer("add-field", addFieldTransformer);
registry.registerGenerator("json", jsonGenerator);

const result = registry.transform(GraphQLGrammar, ["add-field"], {
  "add-field": {
    targetTypeName: "User",
    fieldName: "email",
    fieldType: "String!",
  },
});

const jsonResult = registry.generate(result.grammar, "json", {
  pretty: true,
});

mkdirSync("output", { recursive: true });
writeFileSync(join("output", "add-field-result.json"), jsonResult.output as string);
