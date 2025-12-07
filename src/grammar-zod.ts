/**
 * Zod schemas for GraphQL Grammar types
 * Validates that the grammar structure can be represented with Zod
 */

import { z } from "zod";
import type {
  Terminal,
  NonTerminal,
  Sequence,
  OneOf,
  Optional,
  List,
  GrammarElement,
  ProductionRule,
  Grammar,
} from "./grammar";

// ==========================================
// Zod Schemas for Grammar Types
// ==========================================

/**
 * Terminal schema - represents lexical tokens
 */
export const TerminalSchema: z.ZodType<Terminal> = z.object({
  kind: z.literal("Terminal"),
  name: z.string(),
  pattern: z.union([z.instanceof(RegExp), z.string()]).optional(),
});

/**
 * NonTerminal schema - represents references to other rules
 */
export const NonTerminalSchema: z.ZodType<NonTerminal> = z.object({
  kind: z.literal("NonTerminal"),
  name: z.string(),
});

/**
 * GrammarElement schema - union of all element types
 * Defined first to allow circular references
 */
export const GrammarElementSchema: z.ZodType<GrammarElement> = z.lazy(() =>
  z.discriminatedUnion("kind", [
    TerminalSchema as unknown as z.ZodObject<any>,
    NonTerminalSchema as unknown as z.ZodObject<any>,
    SequenceSchema as unknown as z.ZodObject<any>,
    OneOfSchema as unknown as z.ZodObject<any>,
    OptionalSchema as unknown as z.ZodObject<any>,
    ListSchema as unknown as z.ZodObject<any>,
  ])
) as unknown as z.ZodType<GrammarElement>;

/**
 * Sequence schema - represents ordered sequences of elements
 */
export const SequenceSchema: z.ZodType<Sequence> = z.object({
  kind: z.literal("Sequence"),
  elements: z.array(GrammarElementSchema),
});

/**
 * OneOf schema - represents alternatives (OR)
 */
export const OneOfSchema: z.ZodType<OneOf> = z.object({
  kind: z.literal("OneOf"),
  options: z.array(GrammarElementSchema),
});

/**
 * Optional schema - represents optional elements
 */
export const OptionalSchema: z.ZodType<Optional> = z.object({
  kind: z.literal("Optional"),
  element: GrammarElementSchema,
});

/**
 * List schema - represents one or more occurrences
 */
export const ListSchema: z.ZodType<List> = z.object({
  kind: z.literal("List"),
  element: GrammarElementSchema,
});

/**
 * ProductionRule schema - represents a grammar rule
 */
export const ProductionRuleSchema: z.ZodType<ProductionRule> = z.object({
  name: z.string(),
  definition: GrammarElementSchema,
});

/**
 * Grammar schema - represents the complete grammar
 */
export const GrammarSchema: z.ZodType<Grammar> = z.object({
  root: z.string(),
  rules: z.record(z.string(), ProductionRuleSchema),
});

// ==========================================
// Helper function to validate grammar
// ==========================================

/**
 * Validates that a grammar object conforms to the Zod schema
 */
export function validateGrammar(grammar: unknown): grammar is Grammar {
  return GrammarSchema.safeParse(grammar).success;
}

/**
 * Validates a grammar element
 */
export function validateGrammarElement(
  element: unknown
): element is GrammarElement {
  return GrammarElementSchema.safeParse(element).success;
}

/**
 * Validates a production rule
 */
export function validateProductionRule(
  rule: unknown
): rule is ProductionRule {
  return ProductionRuleSchema.safeParse(rule).success;
}

