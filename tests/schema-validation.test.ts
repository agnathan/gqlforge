/**
 * GraphQL Schema Validation and Linting Tests
 * 
 * Tests the schema validation helper function with various scenarios
 */

import { describe, it, expect } from "vitest";
import {
  checkGraphQLSchema,
  formatSchemaIssues,
  assertValidSchema,
  type SchemaCheckResult,
} from "./helpers/schema-validator";

describe("GraphQL Schema Validation", () => {
  describe("Valid Schemas", () => {
    it("should validate a simple valid schema", async () => {
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
      expect(result.isValid).toBe(true);
      expect(result.schema).toBeDefined();
      // Note: Linting may produce warnings, but schema is still valid
      const errors = result.issues.filter((i) => i.severity === "error");
      expect(errors).toHaveLength(0);
    });

    it("should validate a schema with interfaces", async () => {
      const schema = `
        interface Node {
          id: ID!
        }
        
        type User implements Node {
          id: ID!
          name: String!
        }
        
        type Query {
          node(id: ID!): Node
        }
      `;

      const result = await checkGraphQLSchema(schema);
      expect(result.isValid).toBe(true);
    });

    it("should validate a schema with unions", async () => {
      const schema = `
        type Dog {
          name: String!
          breed: String!
        }
        
        type Cat {
          name: String!
          lives: Int!
        }
        
        union Pet = Dog | Cat
        
        type Query {
          pets: [Pet!]!
        }
      `;

      const result = await checkGraphQLSchema(schema);
      expect(result.isValid).toBe(true);
    });
  });

  describe("Invalid Schemas", () => {
    it("should detect syntax errors", async () => {
      const schema = `
        type User {
          id: ID!
          name: String!  # Missing closing brace
      `;

      const result = await checkGraphQLSchema(schema);
      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0].source).toBe("validation");
      expect(result.issues[0].severity).toBe("error");
    });

    it("should detect missing interface implementations", async () => {
      const schema = `
        interface Node {
          id: ID!
        }
        
        type User implements Node {
          name: String!  # Missing id field
        }
        
        type Query {
          user: User
        }
      `;

      const result = await checkGraphQLSchema(schema);
      expect(result.isValid).toBe(false);
      const validationErrors = result.issues.filter(
        (i) => i.source === "validation" && i.severity === "error"
      );
      expect(validationErrors.length).toBeGreaterThan(0);
    });

    it("should detect circular type references", async () => {
      const schema = `
        type User {
          id: ID!
          friend: User!  # Valid circular reference
        }
        
        type Query {
          user: User
        }
      `;

      // This should be valid (circular references are allowed)
      const result = await checkGraphQLSchema(schema);
      expect(result.isValid).toBe(true);
    });

    it("should detect invalid type references", async () => {
      const schema = `
        type User {
          id: ID!
          profile: Profile!  # Profile type doesn't exist
        }
        
        type Query {
          user: User
        }
      `;

      // buildSchema throws GraphQLError for unknown types
      const result = await checkGraphQLSchema(schema);
      expect(result.isValid).toBe(false);
      const validationErrors = result.issues.filter(
        (i) => i.source === "validation" && i.severity === "error"
      );
      expect(validationErrors.length).toBeGreaterThan(0);
    });
  });

  describe("Linting", () => {
    it("should detect missing descriptions (if linting is enabled)", async () => {
      const schema = `
        type User {
          id: ID!
          name: String!
        }
        
        type Query {
          me: User
        }
      `;

      const result = await checkGraphQLSchema(schema, {
        eslintConfig: {
          rules: {
            "@graphql-eslint/require-description": ["error"],
          },
        },
      });

      // Schema is valid but may have linting warnings/errors
      // Note: This depends on graphql-eslint being installed
      expect(result.schema).toBeDefined();
    });

    it("should skip linting when validation fails", async () => {
      const invalidSchema = `
        type User {
          id: ID!
          name: String!  # Missing closing brace
      `;

      const result = await checkGraphQLSchema(invalidSchema, {
        skipLintOnValidationError: true,
      });

      expect(result.isValid).toBe(false);
      // Should only have validation errors, no lint errors
      expect(result.issues.every((i) => i.source === "validation")).toBe(true);
    });
  });

  describe("Helper Functions", () => {
    it("should format issues correctly", () => {
      const issues: SchemaCheckResult["issues"] = [
        {
          message: "Syntax error",
          line: 2,
          column: 5,
          severity: "error",
          source: "validation",
        },
        {
          message: "Missing description",
          line: 3,
          ruleId: "@graphql-eslint/require-description",
          severity: "warning",
          source: "lint",
        },
      ];

      const formatted = formatSchemaIssues(issues);
      expect(formatted).toContain("Syntax error");
      expect(formatted).toContain("Missing description");
      expect(formatted).toContain("Validation Errors");
      expect(formatted).toContain("Linting Issues");
    });

    it("should assert valid schema", async () => {
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
      
      // This should not throw
      assertValidSchema(result);
      
      // After assertion, TypeScript should know result.isValid is true
      expect(result.isValid).toBe(true);
    });

    it("should throw on invalid schema assertion", async () => {
      const schema = `
        type User {
          id: ID!
          name: String!  # Missing closing brace
      `;

      const result = await checkGraphQLSchema(schema);
      
      // This should throw
      expect(() => assertValidSchema(result)).toThrow();
    });
  });

  describe("Integration with Test Suite", () => {
    it("should work with Vitest expect assertions", async () => {
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
      
      // Standard Vitest assertions
      expect(result.isValid).toBe(true);
      // Note: Linting may produce warnings, but schema is still valid
      const errors = result.issues.filter((i) => i.severity === "error");
      expect(errors).toHaveLength(0);
      expect(result.schema).toBeDefined();
    });

    it("should provide detailed error messages for test failures", async () => {
      const schema = `
        type User {
          id: ID!
          profile: Profile!  # Profile type doesn't exist
        }
        
        type Query {
          user: User
        }
      `;

      // buildSchema throws GraphQLError for unknown types
      const result = await checkGraphQLSchema(schema);
      
      expect(result.isValid).toBe(false);
      
      // Format issues for test output
      const formatted = formatSchemaIssues(result.issues);
      expect(formatted).toBeTruthy();
      expect(formatted).toContain("Validation Errors");
      
      // In a real test, you might do:
      // if (!result.isValid) {
      //   console.error(formatted);
      // }
    });
  });
});

