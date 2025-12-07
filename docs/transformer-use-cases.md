# Transformer Use Cases

This document outlines potential use cases for transformers that can alter any element of the grammar in ZodQL. Transformers operate on the Zod GraphQL Schema structure, allowing programmatic modification of GraphQL schemas.

## Grammar Element Types & Transformation Use Cases

### 1. Terminal Transformations

Terminals represent lexical tokens (keywords, punctuators, patterns).

**Use Cases:**
- **[Pattern Modification](#pattern-modification)**: Change regex patterns for Name, IntValue, FloatValue, etc.
- **[Keyword Renaming](#keyword-renaming)**: Rename GraphQL keywords (e.g., `query` → `Query`, `type` → `Type`)
- **Punctuator Changes**: Modify syntax symbols (e.g., change `!` to `!!` for non-null)
- **Validation Rules**: Add or remove pattern constraints
- **Token Standardization**: Normalize token representations
- **Custom Token Addition**: Add new terminal tokens for custom syntax

### 2. NonTerminal Transformations

NonTerminals represent references to other grammar rules.

**Use Cases:**
- **[Rule Renaming](#rule-renaming)**: Rename grammar rules (e.g., `User` → `Account`, `Post` → `Article`)
- **[Reference Updates](#reference-updates)**: Update all references when a rule is renamed
- **Rule Aliasing**: Create aliases for existing rules
- **Rule Removal**: Remove unused rules and clean up references
- **Reference Validation**: Verify all NonTerminal references exist
- **[Circular Dependency Detection](#detect-circular-dependencies)**: Find and break circular references
- **Rule Extraction**: Extract frequently used NonTerminals into reusable rules

### 3. Sequence Transformations

Sequences represent ordered sequences of grammar elements.

**Use Cases:**
- **[Element Insertion](#element-insertion)**: Add elements at specific positions in a sequence
- **[Element Removal](#element-removal)**: Remove elements from sequences
- **[Element Reordering](#element-reordering)**: Change the order of elements
- **Element Replacement**: Swap one element for another
- **Sequence Flattening**: Flatten nested sequences
- **Sequence Splitting**: Split a sequence into multiple rules
- **Sequence Merging**: Combine multiple sequences
- **Conditional Elements**: Add elements based on conditions
- **Element Duplication**: Duplicate elements in sequences

### 4. OneOf (Alternatives) Transformations

OneOf represents alternatives (OR operations) in the grammar.

**Use Cases:**
- **[Option Addition](#option-addition)**: Add new alternatives to a OneOf
- **[Option Removal](#option-removal)**: Remove alternatives from a OneOf
- **Option Reordering**: Change priority/order of alternatives
- **Option Simplification**: Remove single-option OneOfs
- **Option Merging**: Combine similar options
- **Option Filtering**: Filter options based on criteria
- **Option Deduplication**: Remove duplicate options
- **Option Expansion**: Expand OneOf into separate rules
- **Conditional Options**: Add options conditionally

### 5. Optional Transformations

Optional represents optional elements in the grammar.

**Use Cases:**
- **[Make Required](#make-required)**: Convert Optional to required (remove Optional wrapper)
- **[Make Optional](#make-optional)**: Wrap elements in Optional
- **Optional Removal**: Remove Optional wrappers (make required)
- **Nested Optional Flattening**: Simplify nested Optionals
- **Optional Promotion**: Move Optional to different levels
- **Conditional Optional**: Make elements optional based on conditions
- **Default Value Addition**: Add default values when making optional

### 6. List Transformations

List represents one or more occurrences of an element.

**Use Cases:**
- **[List to Single](#list-to-single)**: Convert List to single element
- **[Single to List](#single-to-list)**: Wrap element in List
- **List Constraints**: Add min/max constraints to lists
- **List Flattening**: Flatten nested Lists
- **List Filtering**: Filter list elements
- **List Mapping**: Transform each element in a list
- **List Deduplication**: Remove duplicate list elements
- **List Reordering**: Change order of list elements
- **List Splitting**: Split list into multiple lists

### 7. ProductionRule Transformations

ProductionRules represent named grammar rules with definitions.

**Use Cases:**
- **[Rule Cloning](#rule-cloning)**: Duplicate rules with modifications
- **[Rule Merging](#rule-merging)**: Combine multiple rules into one
- **Rule Splitting**: Split complex rules into simpler ones
- **Rule Extraction**: Extract parts into new rules
- **Rule Inlining**: Inline rule definitions (replace NonTerminal with definition)
- **Rule Deprecation**: Mark rules as deprecated
- **Rule Documentation**: Add/update rule descriptions
- **Rule Validation**: Add validation rules to production rules
- **Rule Versioning**: Create versioned copies of rules
- **Rule Tagging**: Add metadata/tags to rules

### 8. Grammar-Level Transformations

Grammar represents the complete grammar structure with root and rules.

**Use Cases:**
- **[Schema Merging](#schema-merging)**: Combine multiple grammars into one
- **[Schema Splitting](#schema-splitting)**: Split grammar into multiple schemas
- **Schema Versioning**: Create versioned schemas
- **Schema Normalization**: Standardize structure across schema
- **Schema Validation**: Add validation rules to entire schema
- **Schema Documentation**: Add/update descriptions throughout schema
- **Schema Optimization**: Optimize entire schema structure
- **Schema Comparison**: Compare two schemas for differences
- **Schema Diff Generation**: Generate diff between schemas
- **Schema Migration**: Migrate schema between versions

## Practical Use Case Categories

### A. Schema Evolution & Migration

Transformations for evolving schemas over time.

**Use Cases:**
- **Add New Fields**: Add new fields to existing types
- **Remove Deprecated Fields**: Remove fields marked as deprecated
- **Rename Types/Fields**: Rename types and fields across entire schema
- **Change Field Types**: Modify field types (with compatibility checks)
- **Add/Remove Arguments**: Modify function arguments
- **Modify Default Values**: Change default values for arguments/inputs
- **Version Schema Changes**: Track schema versions and changes
- **Backward Compatibility**: Ensure transformations maintain compatibility
- **Breaking Change Detection**: Identify breaking changes
- **Migration Scripts**: Generate migration scripts from transformations

### B. Schema Optimization

Transformations to improve schema performance and maintainability.

**Use Cases:**
- **Remove Unused Types**: Remove types that are never referenced
- **Remove Unused Fields**: Remove fields that are never queried
- **Flatten Deeply Nested Structures**: Simplify complex nested types
- **Simplify Complex Unions**: Break down complex union types
- **Optimize List Types**: Optimize list representations
- **Remove Redundant Options**: Clean up redundant OneOf options
- **Merge Duplicate Definitions**: Combine duplicate type definitions
- **Reduce Grammar Complexity**: Simplify overall grammar structure
- **Cache Optimization**: Optimize for caching strategies
- **Query Optimization**: Optimize for query performance

### C. Schema Customization

Transformations to customize schemas for specific needs.

**Use Cases:**
- **Add Custom Directives**: Add custom directive definitions
- **Add Validation Rules**: Add validation constraints
- **Add Descriptions**: Add documentation/descriptions
- **Add Default Values**: Set default values for fields/arguments
- **Add Required Constraints**: Make fields/arguments required
- **Add Optional Fields**: Make fields optional
- **Add Authorization Directives**: Add auth-related directives
- **Add Rate Limiting**: Add rate limiting directives
- **Add Caching Directives**: Add caching-related directives
- **Add Logging Directives**: Add logging/monitoring directives
- **Add Custom Scalars**: Add custom scalar type definitions

### D. Schema Composition

Transformations for combining and decomposing schemas.

**Use Cases:**
- **Merge Multiple Schemas**: Combine schemas from different sources
- **Extract Sub-smcheas**: Extract parts of schema into separate schemas
- **Create Schema Views**: Create filtered views of schemas
- **Combine Fragments**: Merge fragment definitions
- **Merge Interfaces**: Combine interface definitions
- **Combine Unions**: Merge union type definitions
- **Schema Federation**: Prepare schemas for federation
- **Microservice Composition**: Compose schemas from microservices
- **API Gateway Composition**: Combine schemas for API gateways
- **Multi-tenant Schemas**: Create tenant-specific schema variants

### E. Schema Transformation Patterns

Common transformation patterns for GraphQL schemas.

**Use Cases:**
- **Add Pagination**: Add pagination to list fields
- **Add Filtering**: Add filtering capabilities to queries
- **Add Sorting**: Add sorting options to queries
- **Add Authorization**: Add authorization directives
- **Add Rate Limiting**: Add rate limiting to operations
- **Add Caching**: Add caching directives
- **Add Validation**: Add input validation rules
- **Add Monitoring**: Add monitoring/logging directives
- **Add Versioning**: Add versioning to types/fields
- **Add Deprecation**: Mark fields/types as deprecated
- **Add Documentation**: Generate comprehensive documentation

### F. Schema Analysis & Reporting

Transformations that analyze and report on schemas.

**Use Cases:**
- **Find All References**: Find all references to a specific type
- **Detect Circular Dependencies**: Identify circular type dependencies
- **Find Unused Types**: Identify types that are never used
- **Analyze Complexity**: Measure schema complexity metrics
- **Generate Dependency Graphs**: Create dependency visualization
- **Find Breaking Changes**: Detect breaking changes between versions
- **Schema Statistics**: Generate statistics about schema structure
- **Type Usage Analysis**: Analyze how types are used
- **Field Usage Analysis**: Analyze field usage patterns
- **Query Pattern Analysis**: Analyze common query patterns

## Specific Grammar Element Use Cases

### Field Definition Transformations

Transformations specific to field definitions in ObjectTypeDefinition.

**Use Cases:**
- **[Add Field](#add-field)**: Add new field to ObjectTypeDefinition
- **[Remove Field](#remove-field)**: Remove field from ObjectTypeDefinition
- **[Rename Field](#rename-field)**: Change field name
- **[Change Field Type](#change-field-type)**: Modify field return type
- **[Add Field Arguments](#add-field-arguments)**: Add arguments to field
- **[Remove Field Arguments](#remove-field-arguments)**: Remove arguments from field
- **[Add Field Directives](#add-field-directives)**: Add directives to field
- **[Remove Field Directives](#remove-field-directives)**: Remove directives from field
- **[Make Field Required](#make-field-required)**: Change field from optional to required
- **[Make Field Optional](#make-field-optional)**: Change field from required to optional
- **[Change to List](#change-to-list)**: Convert single field to list field
- **[Change from List](#change-from-list)**: Convert list field to single field
- **[Add Field Description](#add-field-description)**: Add documentation to field
- **[Modify Field Description](#modify-field-description)**: Update field documentation

### Type Definition Transformations

Transformations for GraphQL type definitions.

**Use Cases:**
- **[Add Implements Interface](#add-implements-interface)**: Add interface implementation
- **Remove Implements Interface**: Remove interface implementation
- **Add Directives**: Add directives to type
- **Remove Directives**: Remove directives from type
- **Add Fields**: Add fields to type
- **Remove Fields**: Remove fields from type
- **[Change to Interface](#change-to-interface)**: Convert type to interface
- **Change to Union**: Convert type to union
- **Change to Enum**: Convert type to enum
- **Add Enum Values**: Add values to enum
- **Remove Enum Values**: Remove values from enum
- **Rename Type**: Change type name
- **Add Type Description**: Add documentation to type

### Input Type Transformations

Transformations for input object type definitions.

**Use Cases:**
- **Add Input Field**: Add field to input type
- **Remove Input Field**: Remove field from input type
- **Change Field Type**: Modify input field type
- **Add Default Value**: Set default value for input field
- **Remove Default Value**: Remove default value
- **Make Field Required**: Make input field required
- **Make Field Optional**: Make input field optional
- **Add Validation Constraints**: Add validation rules
- **Remove Validation Constraints**: Remove validation rules
- **Rename Input Type**: Change input type name
- **Add Input Description**: Add documentation

### Query/Mutation Transformations

Transformations for root operation types.

**Use Cases:**
- **[Add Query Field](#add-query-field)**: Add field to Query type
- **Remove Query Field**: Remove field from Query type
- **Add Mutation Field**: Add field to Mutation type
- **Remove Mutation Field**: Remove field from Mutation type
- **Add Subscription Field**: Add field to Subscription type
- **Remove Subscription Field**: Remove field from Subscription type
- **Modify Field Arguments**: Change arguments of operation fields
- **Add Directives**: Add directives to operations
- **Remove Directives**: Remove directives from operations
- **Change Return Types**: Modify return types of operations
- **Add Operation Description**: Add documentation to operations

### Directive Transformations

Transformations for directive definitions and usage.

**Use Cases:**
- **[Add Directive to Type](#add-directive-to-type)**: Apply directive to type definition
- **Add Directive to Field**: Apply directive to field definition
- **Remove Directive**: Remove directive from element
- **Modify Directive Arguments**: Change directive arguments
- **Add Custom Directive**: Define new directive
- **Remove Custom Directive**: Remove directive definition
- **Apply Directives Conditionally**: Add directives based on conditions
- **Bulk Directive Application**: Apply directive to multiple elements
- **Directive Migration**: Migrate directives between versions
- **Directive Validation**: Validate directive usage

### Fragment Transformations

Transformations for GraphQL fragments.

**Use Cases:**
- **Add Fragment Fields**: Add fields to fragment
- **Remove Fragment Fields**: Remove fields from fragment
- **Merge Fragments**: Combine multiple fragments
- **Split Fragments**: Break fragment into multiple fragments
- **Rename Fragments**: Change fragment name
- **Inline Fragments**: Inline fragment into query
- **Extract Fragments**: Extract fragment from query
- **Fragment Optimization**: Optimize fragment structure
- **Fragment Reuse**: Identify reusable fragments

## Design Considerations

### 1. Granularity Levels

**Element-Level Transformations:**
- Transform individual grammar elements (Terminal, NonTerminal, etc.)
- Most granular, allows precise control
- Example: Change a single Terminal's pattern

**Rule-Level Transformations:**
- Transform entire ProductionRules
- Medium granularity, good for type-level changes
- Example: Rename a type and all its references

**Grammar-Level Transformations:**
- Transform entire Grammar structure
- Highest level, good for schema-wide operations
- Example: Merge two complete schemas

### 2. Composability

**Chained Transformations:**
- Can transformers be chained together?
- Should transformations be applied in sequence?
- How to handle dependencies between transformations?

**Pipeline Pattern:**
- Build transformation pipelines
- Each transformer operates on result of previous
- Example: Parse → Normalize → Simplify → Generate

### 3. Reversibility

**Undo Capabilities:**
- Can transformations be reversed?
- Track transformation history
- Generate inverse transformations
- Rollback capabilities

**Transformation Logging:**
- Log all transformations applied
- Enable replay of transformations
- Debug transformation issues

### 4. Validation

**Post-Transformation Validation:**
- Validate grammar after each transformation
- Ensure grammar remains valid
- Detect breaking changes early

**Pre-Transformation Validation:**
- Validate input before transformation
- Ensure transformation is safe to apply
- Check prerequisites

### 5. Selectors & Targeting

**Path-Based Selectors:**
- Target elements by path (e.g., `rules.User.definition.elements[0]`)
- Precise element targeting
- Example: `rules.User.fields.name`

**Pattern-Based Selectors:**
- Match elements by pattern
- More flexible targeting
- Example: All fields named `id`

**Query-Based Selectors:**
- Query grammar structure
- Find elements matching criteria
- Example: All optional fields

### 6. Conditional Transformations

**Conditional Application:**
- Apply transformations based on conditions
- Example: Only transform if field has certain directive
- Pattern matching for conditional logic

**Rule-Based Transformations:**
- Define transformation rules
- Apply rules to matching elements
- Example: If field is deprecated, remove it

### 7. Batch Operations

**Bulk Transformations:**
- Transform multiple elements at once
- Efficient batch processing
- Example: Add directive to all fields

**Parallel Transformations:**
- Apply independent transformations in parallel
- Improve performance
- Example: Add descriptions to all types simultaneously

### 8. Metadata & Tracking

**Transformation History:**
- Track all transformations applied
- Maintain audit trail
- Enable debugging and rollback

**Transformation Metadata:**
- Store metadata about transformations
- Track transformation source
- Record transformation parameters

## Potential Transformer Patterns

### 1. Selector-Based Transformers

Target specific elements using selectors.

**Example:**
```typescript
transformer.select("rules.User.fields.email")
  .rename("emailAddress")
  .addDirective("@deprecated")
```

### 2. Pattern-Based Transformers

Match and transform elements matching patterns.

**Example:**
```typescript
transformer.match({ kind: "Field", name: /^id$/i })
  .addDirective("@id")
```

### 3. Rule-Based Transformers

Apply transformation rules to matching elements.

**Example:**
```typescript
transformer.addRule({
  condition: (field) => field.name === "password",
  action: (field) => addDirective(field, "@sensitive")
})
```

### 4. Visitor Pattern Transformers

Traverse grammar structure and transform.

**Example:**
```typescript
transformer.visit((element) => {
  if (element.kind === "Field") {
    return addDescription(element, "Auto-generated");
  }
})
```

### 5. Builder Pattern Transformers

Build transformations declaratively.

**Example:**
```typescript
transformer
  .addField("User", "createdAt", "DateTime!")
  .addField("User", "updatedAt", "DateTime!")
  .addDirective("User", "@cache")
```

### 6. Pipeline Pattern Transformers

Chain transformations together.

**Example:**
```typescript
transformer
  .pipe(normalize)
  .pipe(simplify)
  .pipe(addDescriptions)
  .pipe(validate)
```

## Priority Use Cases

### High Priority

1. **Field-level transformations** (add/remove/rename fields)
2. **Type-level transformations** (rename types, add/remove types)
3. **Reference updates** (update all references when renaming)
4. **Schema merging** (combine multiple schemas)
5. **Validation** (ensure transformations maintain validity)

### Medium Priority

1. **Directive management** (add/remove directives)
2. **Optional/Required conversions** (make fields optional/required)
3. **List transformations** (convert between list and single)
4. **Schema optimization** (remove unused elements)
5. **Documentation** (add/update descriptions)

### Lower Priority

1. **Pattern matching** (advanced selector patterns)
2. **Transformation history** (audit trail)
3. **Reversibility** (undo transformations)
4. **Parallel processing** (batch operations)
5. **Advanced analysis** (complex dependency analysis)

## Next Steps

1. **Design Transformer API**: Create a flexible API for element-level transformations
2. **Implement Selectors**: Build selector system for targeting elements
3. **Create Base Transformers**: Implement common transformation patterns
4. **Add Validation**: Ensure transformations maintain grammar validity
5. **Build Examples**: Create example transformers for common use cases
6. **Documentation**: Document transformer patterns and best practices

## Related Documentation

- [GraphQL to Zod Patterns](./graphql-to-zod-patterns.md) - Understanding grammar structure
- [Plugin Architecture](../src/plugins/README.md) - Transformer plugin system
- [GraphQL to ZodQL Conversion](./graphql-to-zodql-conversion.md) - Converting schemas

## Implementation Guide

This section provides detailed, tool-agnostic implementation descriptions for each transformer use case. These descriptions are designed to be detailed enough for an AI or developer to implement using any GraphQL manipulation tool or library.

### Implementation Approach

Each use case description includes:
- **Objective**: What the transformation should achieve
- **Input**: What the transformer receives
- **Output**: What the transformer should produce
- **Algorithm**: Step-by-step process to implement
- **Validation**: What to verify after transformation
- **Edge Cases**: Special situations to handle

### Terminal Transformations

#### Pattern Modification

**Objective**: Change the regex pattern or validation rule for a terminal token (e.g., Name, IntValue, FloatValue).

**Input**: 
- Grammar structure containing terminal definitions
- Target terminal name (e.g., "Name")
- New pattern (regex string or validation function)

**Output**: 
- Modified grammar with updated terminal pattern
- All references to the terminal remain valid

**Before** (Grammar allows names starting with underscore or letter):
```graphql
type User {
  _id: ID!
  name: String!
}
```

**After** (Grammar modified to require names start with uppercase letter):
```graphql
type User {
  Name: String!  # Note: _id no longer valid due to pattern change
}
```

**Algorithm**:
1. Locate the terminal definition in the grammar rules
2. Verify the target exists and is a Terminal type
3. Replace the pattern property with the new pattern
4. Validate that the new pattern is syntactically correct
5. Ensure no breaking changes to dependent rules

**Validation**:
- Terminal definition still exists
- Pattern is valid (regex compiles or validation function is callable)
- Grammar structure remains valid
- No circular dependencies introduced

**Edge Cases**:
- Terminal may not exist (handle gracefully)
- Pattern may be invalid (validate before applying)
- Terminal may be referenced in multiple places (all references remain valid)

#### Keyword Renaming

**Objective**: Rename a GraphQL keyword terminal (e.g., change `query` to `Query`, `type` to `Type`).

**Input**:
- Grammar structure
- Old keyword name
- New keyword name

**Output**:
- Grammar with renamed keyword terminal
- All usages of the keyword updated

**Before**:
```graphql
type User {
  id: ID!
  name: String!
}

type Query {
  user(id: ID!): User
}
```

**After** (renaming `type` to `Type`):
```graphql
Type User {
  id: ID!
  name: String!
}

Type Query {
  user(id: ID!): User
}
```

**Algorithm**:
1. Find the terminal definition for the old keyword
2. Update the terminal's name property
3. Search grammar for all references to the old keyword
4. Replace all references with the new keyword name
5. Verify grammar structure integrity

**Validation**:
- Old keyword no longer exists
- New keyword exists and is properly defined
- All references updated
- Grammar remains valid

**Edge Cases**:
- Keyword may be used in multiple contexts
- Renaming may conflict with existing names
- Some keywords may be reserved

### NonTerminal Transformations

#### Rule Renaming

**Objective**: Rename a grammar rule (e.g., `User` → `Account`) and update all references throughout the grammar.

**Input**:
- Grammar structure
- Old rule name
- New rule name

**Output**:
- Grammar with renamed rule
- All NonTerminal references updated to use new name

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}
```

**After** (renaming `User` to `Account`):
```graphql
type Account {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: Account!
}
```

**Algorithm**:
1. Verify old rule exists in grammar rules
2. Verify new rule name doesn't conflict with existing rules
3. Update the rule's name property
4. Traverse entire grammar structure recursively
5. For each NonTerminal element found:
   - If name matches old rule name, update to new name
6. Update grammar rules map (remove old key, add new key)
7. Verify root rule reference if applicable

**Validation**:
- Old rule name no longer exists in rules map
- New rule name exists in rules map
- All NonTerminal references updated
- No orphaned references remain
- Grammar structure remains valid

**Edge Cases**:
- Rule may be the root rule (update root reference)
- Rule may reference itself (handle self-references)
- Rule may be referenced in multiple nested levels
- Renaming may create naming conflicts

#### Reference Updates

**Objective**: Update all NonTerminal references when a rule is renamed or moved.

**Input**:
- Grammar structure
- Mapping of old rule names to new rule names

**Output**:
- Grammar with all references updated

**Before** (after renaming User to Account, but references not updated):
```graphql
type Account {
  id: ID!
  name: String!
}

type Post {
  id: ID!
  author: User!  # Still references old name
}
```

**After** (references updated):
```graphql
type Account {
  id: ID!
  name: String!
}

type Post {
  id: ID!
  author: Account!  # References updated
}
```

**Algorithm**:
1. Create a mapping of old names to new names
2. Traverse grammar structure recursively:
   - For each ProductionRule
   - For each GrammarElement in the rule's definition
   - If element is NonTerminal:
     - Check if name exists in mapping
     - If yes, replace with mapped name
   - If element is Sequence/OneOf/List/Optional:
     - Recursively process nested elements
3. Verify all references resolve to existing rules

**Validation**:
- All mapped references updated
- No references point to non-existent rules
- Grammar structure remains valid
- No circular dependencies broken

**Edge Cases**:
- Multiple rules renamed simultaneously
- References may be deeply nested
- Some references may be optional (handle gracefully)

### Sequence Transformations

#### Element Insertion

**Objective**: Insert a new grammar element at a specific position in a Sequence.

**Input**:
- Grammar structure
- Target rule name containing Sequence
- Index position (or insertion strategy)
- New element to insert

**Output**:
- Grammar with element inserted into Sequence

**Before**:
```graphql
type User {
  id: ID!
  name: String!
}
```

**After** (inserting Description at the beginning):
```graphql
"""User account information"""
type User {
  id: ID!
  name: String!
}
```

**Algorithm**:
1. Locate target rule in grammar
2. Verify rule definition is a Sequence type
3. Validate insertion index is within bounds (0 to length)
4. Create new element structure
5. Insert element at specified index in Sequence.elements array
6. Verify Sequence structure remains valid

**Validation**:
- Sequence still exists and is valid
- Element count increased by 1
- Inserted element is at correct position
- Grammar structure remains valid

**Edge Cases**:
- Sequence may be empty (handle as special case)
- Index may be negative (use end of array)
- Index may exceed length (append to end)
- Element may need to be wrapped (e.g., Optional, List)

#### Element Removal

**Objective**: Remove an element from a Sequence at a specific position or matching criteria.

**Input**:
- Grammar structure
- Target rule name
- Element index or matching criteria

**Output**:
- Grammar with element removed from Sequence

**Before**:
```graphql
"""User account information"""
type User {
  id: ID!
  name: String!
}
```

**After** (removing Description):
```graphql
type User {
  id: ID!
  name: String!
}
```

**Algorithm**:
1. Locate target rule containing Sequence
2. If index provided:
   - Validate index is within bounds
   - Remove element at index
3. If criteria provided:
   - Traverse Sequence elements
   - Match elements against criteria
   - Remove matching elements
4. Handle empty Sequence (may need to convert to different type)
5. Verify grammar structure integrity

**Validation**:
- Element removed from Sequence
- Sequence structure remains valid
- No broken references
- Grammar remains valid

**Edge Cases**:
- Removing last element (may need to convert Sequence)
- Removing required element (may break grammar)
- Multiple elements match criteria (remove all or first?)

#### Element Reordering

**Objective**: Change the order of elements within a Sequence.

**Input**:
- Grammar structure
- Target rule name
- New order specification (indices mapping or sort criteria)

**Output**:
- Grammar with reordered Sequence elements

**Before**:
```graphql
type User {
  name: String!
  id: ID!
  email: String!
}
```

**After** (reordering to put id first):
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

**Algorithm**:
1. Locate target Sequence rule
2. Extract current elements array
3. Apply reordering:
   - If indices mapping: rearrange elements according to map
   - If sort criteria: sort elements according to criteria
4. Replace Sequence.elements with reordered array
5. Verify grammar structure

**Validation**:
- All original elements present
- Element count unchanged
- Order matches specification
- Grammar remains valid

**Edge Cases**:
- Order specification may be incomplete
- Some elements may be order-dependent
- Reordering may break semantic meaning

### OneOf Transformations

#### Option Addition

**Objective**: Add a new alternative option to a OneOf element.

**Input**:
- Grammar structure
- Target rule name containing OneOf
- New option element to add

**Output**:
- Grammar with new option added to OneOf

**Before**:
```graphql
type User {
  id: ID!
  name: String!
}
```

**After** (adding InputObjectTypeDefinition as alternative to ObjectTypeDefinition):
```graphql
# Now TypeDefinition can be either ObjectTypeDefinition or InputObjectTypeDefinition
type User {
  id: ID!
  name: String!
}

input UserInput {
  name: String!
}
```

**Algorithm**:
1. Locate target rule containing OneOf
2. Verify OneOf structure exists
3. Create new option element
4. Add to OneOf.options array
5. Check for duplicates (optional: deduplicate)
6. Verify grammar structure

**Validation**:
- OneOf.options count increased
- New option is valid grammar element
- No duplicate options (if deduplication enabled)
- Grammar remains valid

**Edge Cases**:
- OneOf may be empty
- New option may duplicate existing option
- Option may conflict with other options semantically

#### Option Removal

**Objective**: Remove an option from a OneOf element.

**Input**:
- Grammar structure
- Target rule name
- Option index or matching criteria

**Output**:
- Grammar with option removed from OneOf

**Before**:
```graphql
# TypeDefinition can be ObjectTypeDefinition or InputObjectTypeDefinition
type User {
  id: ID!
}

input UserInput {
  name: String!
}
```

**After** (removing InputObjectTypeDefinition option):
```graphql
# TypeDefinition now only ObjectTypeDefinition
type User {
  id: ID!
}
```

**Algorithm**:
1. Locate target OneOf rule
2. If index provided:
   - Validate index within bounds
   - Remove option at index
3. If criteria provided:
   - Match options against criteria
   - Remove matching options
4. Handle single-option OneOf (may convert to direct element)
5. Verify grammar structure

**Validation**:
- Option removed from OneOf
- OneOf structure remains valid
- No broken references
- Grammar remains valid

**Edge Cases**:
- Removing last option (may need to convert OneOf)
- Option may be referenced elsewhere
- Multiple options match criteria

### Optional Transformations

#### Make Required

**Objective**: Convert an Optional element to required by removing the Optional wrapper.

**Input**:
- Grammar structure
- Target rule name and path to Optional element

**Output**:
- Grammar with Optional wrapper removed

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String  # Optional field
}
```

**After** (making email required):
```graphql
type User {
  id: ID!
  name: String!
  email: String!  # Now required
}
```

**Algorithm**:
1. Locate target Optional element in grammar structure
2. Extract the wrapped element from Optional.element
3. Replace Optional with the extracted element
4. Verify grammar structure integrity
5. Check if removal breaks any dependencies

**Validation**:
- Optional wrapper removed
- Original element preserved
- Grammar structure valid
- No broken references

**Edge Cases**:
- Optional may be nested (handle recursively)
- Element may be required elsewhere (check consistency)
- Removal may break optional semantics

#### Make Optional

**Objective**: Wrap an element in an Optional wrapper to make it optional.

**Input**:
- Grammar structure
- Target element path
- Element to wrap

**Output**:
- Grammar with element wrapped in Optional

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String!  # Required field
}
```

**After** (making email optional):
```graphql
type User {
  id: ID!
  name: String!
  email: String  # Now optional
}
```

**Algorithm**:
1. Locate target element in grammar structure
2. Verify element is not already Optional
3. Create Optional wrapper structure
4. Set Optional.element to target element
5. Replace original element with Optional wrapper
6. Verify grammar structure

**Validation**:
- Element wrapped in Optional
- Original element preserved inside Optional
- Grammar structure valid
- No duplicate Optional wrappers

**Edge Cases**:
- Element may already be Optional (handle gracefully)
- Wrapping may affect semantics
- Element may be in multiple contexts

### List Transformations

#### List to Single

**Objective**: Convert a List element to a single element (remove list semantics).

**Input**:
- Grammar structure
- Target rule name containing List

**Output**:
- Grammar with List converted to single element

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  tags: [String!]!  # List field
}
```

**After** (converting to single):
```graphql
type User {
  id: ID!
  name: String!
  tag: String!  # Single field (no longer a list)
}
```

**Algorithm**:
1. Locate target List element
2. Extract the element from List.element
3. Replace List with extracted element
4. Verify grammar structure
5. Check for breaking changes (list semantics removed)

**Validation**:
- List wrapper removed
- Element preserved
- Grammar structure valid
- No broken references

**Edge Cases**:
- List may be required (single element may need to be required)
- Conversion may break list semantics
- Element may be used as list elsewhere

#### Single to List

**Objective**: Wrap an element in a List to allow multiple occurrences.

**Input**:
- Grammar structure
- Target element path

**Output**:
- Grammar with element wrapped in List

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  tag: String!  # Single field
}
```

**After** (converting to list):
```graphql
type User {
  id: ID!
  name: String!
  tags: [String!]!  # List field
}
```

**Algorithm**:
1. Locate target element
2. Verify element is not already List
3. Create List wrapper structure
4. Set List.element to target element
5. Replace original element with List wrapper
6. Verify grammar structure

**Validation**:
- Element wrapped in List
- Original element preserved
- Grammar structure valid
- List semantics applied correctly

**Edge Cases**:
- Element may already be List (handle gracefully)
- Wrapping may affect required/optional semantics
- List may need constraints (min/max)

### ProductionRule Transformations

#### Rule Cloning

**Objective**: Duplicate a rule with modifications to create a new rule.

**Input**:
- Grammar structure
- Source rule name
- New rule name
- Modifications to apply

**Output**:
- Grammar with new cloned rule added

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

**After** (cloning User to create Account with modifications):
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}

type Account {
  id: ID!
  name: String!
  email: String!
  # Cloned from User with potential modifications
}
```

**Algorithm**:
1. Locate source rule in grammar
2. Deep clone the rule structure
3. Apply modifications to cloned rule:
   - Update name property
   - Modify definition as specified
4. Add cloned rule to grammar rules map
5. Update any references if needed
6. Verify grammar structure

**Validation**:
- New rule exists in rules map
- Source rule unchanged
- Cloned rule is valid
- No naming conflicts
- Grammar structure valid

**Edge Cases**:
- New name may conflict with existing rule
- Cloned rule may reference other rules
- Modifications may break rule validity

#### Rule Merging

**Objective**: Combine multiple rules into a single rule.

**Input**:
- Grammar structure
- List of rule names to merge
- Merge strategy (union, intersection, etc.)

**Output**:
- Grammar with merged rule replacing originals

**Before**:
```graphql
type User {
  id: ID!
  name: String!
}

type Account {
  id: ID!
  email: String!
}
```

**After** (merging User and Account with union strategy):
```graphql
# Merged into single type with combined fields
type UserAccount {
  id: ID!
  name: String!
  email: String!
}
```

**Algorithm**:
1. Locate all source rules
2. Determine merge strategy:
   - Union: Combine definitions with OneOf
   - Intersection: Find common elements
   - Sequence: Combine in sequence
3. Create merged rule definition
4. Update all references to source rules to point to merged rule
5. Remove original rules from grammar
6. Verify grammar structure

**Validation**:
- Merged rule exists
- Original rules removed (or kept if strategy requires)
- All references updated
- Grammar structure valid
- No broken dependencies

**Edge Cases**:
- Rules may have conflicting definitions
- Rules may reference each other
- Merge may create circular dependencies
- Some rules may be root rules

### Grammar-Level Transformations

#### Schema Merging

**Objective**: Combine multiple grammars into a single unified grammar.

**Input**:
- Multiple grammar structures
- Merge strategy (conflict resolution)

**Output**:
- Single merged grammar

**Before** (Schema 1):
```graphql
type User {
  id: ID!
  name: String!
}
```

**Before** (Schema 2):
```graphql
type Post {
  id: ID!
  title: String!
}
```

**After** (merged):
```graphql
type User {
  id: ID!
  name: String!
}

type Post {
  id: ID!
  title: String!
}
```

**Algorithm**:
1. Start with first grammar as base
2. For each additional grammar:
   - Merge root rules (if multiple, use OneOf or strategy)
   - For each rule in additional grammar:
     - If rule doesn't exist in base: add it
     - If rule exists: apply merge strategy:
       - Replace: overwrite base rule
       - Merge: combine definitions
       - Skip: keep base rule
     - Update references to point to merged rules
3. Resolve naming conflicts
4. Verify merged grammar structure
5. Ensure all references resolve

**Validation**:
- All rules from all grammars present (or merged)
- No naming conflicts
- All references resolve
- Grammar structure valid
- Root rule properly defined

**Edge Cases**:
- Rules may have same names but different definitions
- Root rules may conflict
- References may point to rules in different grammars
- Circular dependencies may be introduced

#### Schema Splitting

**Objective**: Split a grammar into multiple smaller grammars.

**Input**:
- Grammar structure
- Split criteria (rule groups, dependencies, etc.)

**Output**:
- Multiple grammar structures

**Before** (single schema):
```graphql
type User {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}

type Query {
  user(id: ID!): User
  post(id: ID!): Post
}
```

**After** (split into User schema and Post schema):
```graphql
# Schema 1: User
type User {
  id: ID!
  name: String!
}

type Query {
  user(id: ID!): User
}

# Schema 2: Post
type Post {
  id: ID!
  title: String!
}

type Query {
  post(id: ID!): Post
}
```

**Algorithm**:
1. Analyze grammar structure:
   - Identify rule dependencies
   - Group related rules
   - Determine split boundaries
2. For each group:
   - Create new grammar structure
   - Copy relevant rules
   - Update references within group
   - Define root rule for group
3. Handle cross-group references:
   - Create import/export mechanism
   - Or duplicate referenced rules
   - Or create bridge rules
4. Verify each split grammar is valid

**Validation**:
- All original rules present in split grammars
- Each split grammar is valid
- References resolve within each grammar
- No rules lost in split
- Root rules properly defined

**Edge Cases**:
- Rules may have complex interdependencies
- Split may break circular dependencies
- Some rules may need to be duplicated
- Root rule selection may be ambiguous

### Field Definition Transformations

#### Add Field

**Objective**: Add a new field to an ObjectTypeDefinition.

**Input**:
- Grammar structure
- Target type name
- Field name
- Field type
- Optional: arguments, directives, description

**Output**:
- Grammar with new field added to type

**Before**:
```graphql
type User {
  id: ID!
  name: String!
}
```

**After** (adding email field):
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition in rule definition
3. Locate FieldDefinition list within FieldsDefinition
4. Create new FieldDefinition structure:
   - Name terminal
   - Optional ArgumentsDefinition
   - Type reference
   - Optional DirectivesConst
   - Optional Description
5. Add to FieldDefinition list
6. Verify grammar structure

**Validation**:
- Field added to type
- Field definition is valid
- No duplicate field names
- Type reference resolves
- Grammar structure valid

**Edge Cases**:
- Type may not exist
- Field name may conflict
- Field type may not exist
- Type may not have FieldsDefinition yet

#### Remove Field

**Objective**: Remove a field from an ObjectTypeDefinition.

**Input**:
- Grammar structure
- Target type name
- Field name or index

**Output**:
- Grammar with field removed

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

**After** (removing email field):
```graphql
type User {
  id: ID!
  name: String!
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Locate FieldDefinition list
4. Find field by name or index
5. Remove from list
6. Handle empty FieldsDefinition (may need to make optional)
7. Verify grammar structure

**Validation**:
- Field removed from type
- No broken references to field
- Grammar structure valid
- Type definition remains valid

**Edge Cases**:
- Field may not exist
- Field may be referenced elsewhere
- Removing last field (handle empty case)
- Field may be required (check dependencies)

#### Rename Field

**Objective**: Change the name of a field in an ObjectTypeDefinition.

**Input**:
- Grammar structure
- Target type name
- Old field name
- New field name

**Output**:
- Grammar with renamed field

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  emailAddress: String!
}
```

**After** (renaming emailAddress to email):
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with old name
4. Update Name terminal in FieldDefinition
5. Search for references to old field name
6. Update all references to new name
7. Verify grammar structure

**Validation**:
- Old field name no longer exists
- New field name exists
- All references updated
- No naming conflicts
- Grammar structure valid

**Edge Cases**:
- Field may not exist
- New name may conflict with existing field
- References may be in queries, fragments, etc.
- Field may be referenced in multiple contexts

#### Change Field Type

**Objective**: Modify the return type of a field in an ObjectTypeDefinition.

**Input**:
- Grammar structure
- Target type name
- Field name
- New field type

**Output**:
- Grammar with field type changed

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  age: Int!
}
```

**After** (changing age from Int to String):
```graphql
type User {
  id: ID!
  name: String!
  age: String!
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Locate Type reference in FieldDefinition
5. Update Type reference to new type
6. Verify new type exists in grammar
7. Check for breaking changes (type compatibility)
8. Verify grammar structure

**Validation**:
- Field type updated
- New type exists
- Grammar structure valid
- No broken references

**Edge Cases**:
- Field may not exist
- New type may not exist
- Type change may be incompatible
- Field may be referenced elsewhere (check compatibility)

#### Add Field Arguments

**Objective**: Add arguments to a field definition.

**Input**:
- Grammar structure
- Target type name
- Field name
- Arguments to add (name, type, optional: default value, directives)

**Output**:
- Grammar with arguments added to field

**Before**:
```graphql
type User {
  id: ID!
  name: String!
}

type Query {
  user: User
}
```

**After** (adding id argument to user field):
```graphql
type User {
  id: ID!
  name: String!
}

type Query {
  user(id: ID!): User
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule containing field
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Check if ArgumentsDefinition exists
5. If not exists:
   - Create ArgumentsDefinition structure
   - Insert into FieldDefinition sequence
6. Create InputValueDefinition for each argument
7. Add to ArgumentsDefinition list
8. Verify argument types exist
9. Verify grammar structure

**Validation**:
- Arguments added to field
- Argument definitions valid
- Argument types exist
- Grammar structure valid
- No duplicate argument names

**Edge Cases**:
- Field may not exist
- ArgumentsDefinition may not exist
- Argument name may conflict
- Argument type may not exist

#### Remove Field Arguments

**Objective**: Remove arguments from a field definition.

**Input**:
- Grammar structure
- Target type name
- Field name
- Argument names or indices to remove

**Output**:
- Grammar with arguments removed from field

**Before**:
```graphql
type Query {
  user(id: ID!, includeDeleted: Boolean): User
}
```

**After** (removing includeDeleted argument):
```graphql
type Query {
  user(id: ID!): User
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Locate ArgumentsDefinition
5. Find arguments by name or index
6. Remove from ArgumentsDefinition list
7. Handle empty ArgumentsDefinition (may need to remove)
8. Verify grammar structure

**Validation**:
- Arguments removed from field
- Field definition remains valid
- Grammar structure valid
- No broken references

**Edge Cases**:
- Field may not exist
- ArgumentsDefinition may not exist
- Argument may not exist
- Removing all arguments (handle empty case)

#### Add Field Directives

**Objective**: Add directives to a field definition.

**Input**:
- Grammar structure
- Target type name
- Field name
- Directive name
- Optional: directive arguments

**Output**:
- Grammar with directive added to field

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

**After** (adding @deprecated directive to email field):
```graphql
type User {
  id: ID!
  name: String!
  email: String! @deprecated(reason: "Use contactEmail instead")
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Check if DirectivesConst exists in FieldDefinition
5. If not exists:
   - Create DirectivesConst structure
   - Insert into FieldDefinition sequence
6. Create Directive structure with name and arguments
7. Add to DirectivesConst list
8. Verify directive definition exists
9. Verify grammar structure

**Validation**:
- Directive added to field
- Directive definition exists
- Directive arguments valid
- Grammar structure valid

**Edge Cases**:
- Field may not exist
- Directive may not be defined
- Directive may not be allowed on field
- DirectivesConst may not exist

#### Remove Field Directives

**Objective**: Remove directives from a field definition.

**Input**:
- Grammar structure
- Target type name
- Field name
- Directive name or index

**Output**:
- Grammar with directive removed from field

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String! @deprecated(reason: "Use contactEmail instead")
}
```

**After** (removing @deprecated directive):
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Locate DirectivesConst
5. Find directive by name or index
6. Remove from DirectivesConst list
7. Handle empty DirectivesConst (may need to remove)
8. Verify grammar structure

**Validation**:
- Directive removed from field
- Field definition remains valid
- Grammar structure valid

**Edge Cases**:
- Field may not exist
- DirectivesConst may not exist
- Directive may not exist
- Removing last directive (handle empty case)

#### Make Field Required

**Objective**: Change a field from optional to required by removing Optional wrapper or adding non-null modifier.

**Input**:
- Grammar structure
- Target type name
- Field name

**Output**:
- Grammar with field made required

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String  # Optional field
}
```

**After** (making email required):
```graphql
type User {
  id: ID!
  name: String!
  email: String!  # Now required
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Locate Type reference in FieldDefinition
5. Check if Type is wrapped in Optional or is nullable
6. If Optional:
   - Extract wrapped element
   - Replace Optional with element
7. If nullable:
   - Add non-null modifier (Bang terminal)
8. Verify grammar structure

**Validation**:
- Field is now required
- Grammar structure valid
- No broken references

**Edge Cases**:
- Field may not exist
- Field may already be required
- Making required may break existing queries
- Field may be optional in multiple places

#### Make Field Optional

**Objective**: Change a field from required to optional by adding Optional wrapper or removing non-null modifier.

**Input**:
- Grammar structure
- Target type name
- Field name

**Output**:
- Grammar with field made optional

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String!  # Required field
}
```

**After** (making email optional):
```graphql
type User {
  id: ID!
  name: String!
  email: String  # Now optional
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Locate Type reference in FieldDefinition
5. Check if Type has non-null modifier
6. If non-null:
   - Remove non-null modifier (Bang terminal)
7. If already optional:
   - Wrap in Optional if needed
8. Verify grammar structure

**Validation**:
- Field is now optional
- Grammar structure valid
- No broken references

**Edge Cases**:
- Field may not exist
- Field may already be optional
- Making optional may affect semantics
- Field may be required elsewhere

#### Change to List

**Objective**: Convert a single field to a list field.

**Input**:
- Grammar structure
- Target type name
- Field name

**Output**:
- Grammar with field converted to list

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  tag: String!  # Single field
}
```

**After** (converting tag to list):
```graphql
type User {
  id: ID!
  name: String!
  tags: [String!]!  # List field
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Locate Type reference in FieldDefinition
5. Wrap Type in List structure
6. Preserve non-null modifier if present
7. Verify grammar structure

**Validation**:
- Field converted to list
- List structure valid
- Grammar structure valid
- No broken references

**Edge Cases**:
- Field may not exist
- Field may already be a list
- Conversion may affect semantics
- Field may be referenced elsewhere

#### Change from List

**Objective**: Convert a list field to a single field.

**Input**:
- Grammar structure
- Target type name
- Field name

**Output**:
- Grammar with field converted from list to single

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  tags: [String!]!  # List field
}
```

**After** (converting tags to single):
```graphql
type User {
  id: ID!
  name: String!
  tag: String!  # Single field
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Locate Type reference in FieldDefinition
5. Verify Type is wrapped in List
6. Extract element from List
7. Replace List with extracted element
8. Preserve non-null modifier if needed
9. Verify grammar structure

**Validation**:
- Field converted from list to single
- Grammar structure valid
- No broken references

**Edge Cases**:
- Field may not exist
- Field may not be a list
- Conversion may break existing queries
- Field may be used as list elsewhere

#### Add Field Description

**Objective**: Add a description/documentation to a field definition.

**Input**:
- Grammar structure
- Target type name
- Field name
- Description text

**Output**:
- Grammar with description added to field

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

**After** (adding description to email field):
```graphql
type User {
  id: ID!
  name: String!
  """User's email address"""
  email: String!
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Check if Description exists in FieldDefinition sequence
5. If not exists:
   - Create Description element (Optional StringValue)
   - Insert at beginning of FieldDefinition sequence
6. Set description value
7. Verify grammar structure

**Validation**:
- Description added to field
- Description is valid
- Grammar structure valid

**Edge Cases**:
- Field may not exist
- Description may already exist (update vs add)
- Description may need to be optional

#### Modify Field Description

**Objective**: Update an existing description on a field definition.

**Input**:
- Grammar structure
- Target type name
- Field name
- New description text

**Output**:
- Grammar with field description updated

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  """Old email description"""
  email: String!
}
```

**After** (updating description):
```graphql
type User {
  id: ID!
  name: String!
  """User's primary email address for account notifications"""
  email: String!
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Navigate to FieldsDefinition
3. Find FieldDefinition with target field name
4. Locate Description element in FieldDefinition sequence
5. If Description exists:
   - Update description value
6. If Description doesn't exist:
   - Create and add Description (see Add Field Description)
7. Verify grammar structure

**Validation**:
- Description updated
- Description is valid
- Grammar structure valid

**Edge Cases**:
- Field may not exist
- Description may not exist (may need to add instead)
- Description may be optional (handle gracefully)

### Type Definition Transformations

#### Add Implements Interface

**Objective**: Add an interface implementation to an ObjectTypeDefinition.

**Input**:
- Grammar structure
- Target type name
- Interface name to implement

**Output**:
- Grammar with interface added to ImplementsInterfaces

**Before**:
```graphql
interface Node {
  id: ID!
}

type User {
  id: ID!
  name: String!
}
```

**After** (adding Node interface to User):
```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Check if ImplementsInterfaces exists in definition
3. If not exists:
   - Create ImplementsInterfaces structure
   - Insert into definition sequence
4. Add interface name to ImplementsInterfaces list
5. Verify interface type exists
6. Verify grammar structure

**Validation**:
- Interface added to type
- Interface type exists
- ImplementsInterfaces structure valid
- Grammar structure valid
- No duplicate interfaces

**Edge Cases**:
- Type may not exist
- Interface may not exist
- Type may already implement interface
- ImplementsInterfaces may not exist in definition

#### Change to Interface

**Objective**: Convert an ObjectTypeDefinition to an InterfaceTypeDefinition.

**Input**:
- Grammar structure
- Target type name

**Output**:
- Grammar with type converted to interface

**Before**:
```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

**After** (converting to interface):
```graphql
interface User {
  id: ID!
  name: String!
  email: String!
}
```

**Algorithm**:
1. Locate ObjectTypeDefinition rule
2. Extract type definition structure
3. Create new InterfaceTypeDefinition structure:
   - Preserve Description, Name, FieldsDefinition
   - Convert type keyword to interface keyword
   - Preserve ImplementsInterfaces (if applicable)
   - Preserve DirectivesConst
4. Replace ObjectTypeDefinition with InterfaceTypeDefinition
5. Update all references to type
6. Verify grammar structure

**Validation**:
- ObjectTypeDefinition removed
- InterfaceTypeDefinition created
- All references updated
- Grammar structure valid
- No broken dependencies

**Edge Cases**:
- Type may not exist
- Type may have implementations (handle dependencies)
- References may need updating
- Type may be root type

### Query/Mutation Transformations

#### Add Query Field

**Objective**: Add a new field to the Query type.

**Input**:
- Grammar structure
- Field name
- Field type
- Optional: arguments, directives, description

**Output**:
- Grammar with new query field added

**Before**:
```graphql
type Query {
  user(id: ID!): User
}
```

**After** (adding users field):
```graphql
type Query {
  user(id: ID!): User
  users: [User!]!
}
```

**Algorithm**:
1. Locate Query type definition (may be in SchemaDefinition or direct)
2. Navigate to FieldsDefinition
3. Create FieldDefinition structure
4. Add to FieldsDefinition list
5. Verify grammar structure

**Validation**:
- Field added to Query type
- Field definition valid
- Return type exists
- Grammar structure valid

**Edge Cases**:
- Query type may not exist (may need to create)
- Field name may conflict
- SchemaDefinition may need updating

### Directive Transformations

#### Add Directive to Type

**Objective**: Add a directive to a type definition.

**Input**:
- Grammar structure
- Target type name
- Directive name
- Optional: directive arguments

**Output**:
- Grammar with directive added to type

**Before**:
```graphql
type User {
  id: ID!
  name: String!
}
```

**After** (adding @cache directive):
```graphql
type User @cache {
  id: ID!
  name: String!
}
```

**Algorithm**:
1. Locate target type definition
2. Check if DirectivesConst exists in definition
3. If not exists:
   - Create DirectivesConst structure
   - Insert into definition sequence
4. Create Directive structure with name and arguments
5. Add to DirectivesConst list
6. Verify directive definition exists
7. Verify grammar structure

**Validation**:
- Directive added to type
- Directive definition exists
- Directive arguments valid
- Grammar structure valid

**Edge Cases**:
- Type may not exist
- Directive may not be defined
- Directive may not be allowed on type
- DirectivesConst may not exist

### Schema Composition Transformations

#### Merge Multiple Schemas

**Objective**: Combine schemas from different sources into one unified schema.

**Input**:
- Multiple complete grammar structures
- Conflict resolution strategy

**Output**:
- Single unified grammar

**Before** (Schema 1):
```graphql
type User {
  id: ID!
  name: String!
}

type Query {
  user(id: ID!): User
}
```

**Before** (Schema 2):
```graphql
type Post {
  id: ID!
  title: String!
}

type Query {
  post(id: ID!): Post
}
```

**After** (merged):
```graphql
type User {
  id: ID!
  name: String!
}

type Post {
  id: ID!
  title: String!
}

type Query {
  user(id: ID!): User
  post(id: ID!): Post
}
```

**Algorithm**:
1. Analyze all input grammars:
   - Identify all rules in each grammar
   - Map rule names across grammars
   - Identify conflicts
2. Create unified grammar structure
3. For each rule:
   - If unique: add to unified grammar
   - If duplicate: apply conflict resolution:
     - Merge: combine definitions
     - Replace: use one definition
     - Rename: create variants
4. Resolve cross-schema references
5. Merge root rules appropriately
6. Verify unified grammar

**Validation**:
- All rules from all schemas present
- Conflicts resolved appropriately
- All references resolve
- Grammar structure valid
- Root rule properly defined

**Edge Cases**:
- Schemas may have conflicting root rules
- Rules may have same names but different semantics
- References may span schemas
- Circular dependencies may be introduced

### Schema Analysis Transformations

#### Find All References

**Objective**: Identify all places where a specific rule is referenced.

**Input**:
- Grammar structure
- Target rule name

**Output**:
- List of all reference locations (paths)

**Algorithm**:
1. Initialize empty references list
2. Traverse grammar structure recursively:
   - For each ProductionRule
   - For each GrammarElement:
     - If NonTerminal and name matches target:
       - Record path to this element
     - If Sequence/OneOf/List/Optional:
       - Recursively search nested elements
3. Return all found reference paths

**Validation**:
- All references found
- Paths are accurate
- No false positives
- References are actual uses

**Edge Cases**:
- Rule may not exist
- Rule may reference itself
- References may be deeply nested
- Some references may be optional

#### Detect Circular Dependencies

**Objective**: Identify circular dependencies between rules.

**Input**:
- Grammar structure

**Output**:
- List of circular dependency chains

**Algorithm**:
1. Build dependency graph:
   - For each rule, find all NonTerminal references
   - Create directed graph of dependencies
2. Detect cycles using graph algorithms:
   - Use depth-first search (DFS)
   - Track visited nodes and recursion stack
   - Identify back edges indicating cycles
3. Extract circular chains
4. Return all found cycles

**Validation**:
- All cycles detected
- Cycles are actual dependencies
- No false positives
- Chains are complete

**Edge Cases**:
- Self-references (rule references itself)
- Complex multi-rule cycles
- Optional references (may not be true cycles)
- Indirect cycles through multiple rules

### Implementation Notes

#### General Transformation Pattern

Most transformations follow this general pattern:

1. **Locate**: Find the target element(s) in the grammar structure
2. **Validate**: Verify the transformation is safe and valid
3. **Transform**: Apply the modification to the structure
4. **Update**: Update related references and dependencies
5. **Verify**: Validate the resulting grammar structure

#### Grammar Structure Navigation

When implementing transformations, you'll need to:

- **Traverse recursively**: Grammar elements can be nested deeply
- **Handle all element types**: Terminal, NonTerminal, Sequence, OneOf, Optional, List
- **Preserve structure**: Maintain grammar validity throughout
- **Track paths**: Know where you are in the structure for precise modifications

#### Validation Requirements

After any transformation:

- **Structure validity**: Grammar conforms to schema
- **Reference integrity**: All NonTerminal references resolve
- **No cycles**: No circular dependencies introduced (unless intentional)
- **Semantic correctness**: Transformation makes semantic sense

#### Error Handling

Consider:

- **Missing elements**: Target may not exist
- **Invalid operations**: Transformation may not be applicable
- **Conflicts**: Changes may conflict with existing structure
- **Breaking changes**: Transformation may break dependent code

#### Performance Considerations

For large grammars:

- **Efficient traversal**: Use appropriate algorithms
- **Incremental updates**: Only modify what's necessary
- **Caching**: Cache lookups and computations
- **Batch operations**: Group related transformations

#### Testing Strategy

When implementing:

- **Unit tests**: Test each transformation in isolation
- **Integration tests**: Test transformations together
- **Edge cases**: Test boundary conditions
- **Validation**: Verify grammar validity after each transformation
- **Regression**: Ensure no breaking changes to existing functionality

