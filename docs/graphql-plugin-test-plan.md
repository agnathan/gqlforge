# GraphQL Plugin Test Plan

This document provides a comprehensive test plan for both the GraphQL SDL **Generator** and **Parser** plugins. Since these are inverse operations following the same grammar, tests are organized by grammar sections from `src/grammar.ts`.

## Test Status Legend

- ✅ PASSED - Test implemented and passing
- ⏳ PENDING - Test planned but not yet implemented
- ❌ FAILED - Test implemented but currently failing
- ⏸️ SKIPPED - Test skipped (not applicable or deferred)

## Test Organization

Tests are organized by GraphQL Grammar Specification sections, matching the structure in `src/grammar.ts`. Each section includes:
- **Generator Tests** (GEN-*): Tests for generating GraphQL SDL from grammar
- **Parser Tests** (PARSE-*): Tests for parsing GraphQL SDL into grammar

Since generator and parser are inverse operations, they share the same grammar structure and test coverage.

---

## C.1-C.3 Lexical Tokens (Terminals)

### Name Token

**Generator Tests:**
- [ ] **GEN-NAME-001**: Generate Name terminal with valid identifier pattern
- [ ] **GEN-NAME-002**: Generate Name in type definition context
- [ ] **GEN-NAME-003**: Generate Name in field definition context
- [ ] **GEN-NAME-004**: Generate Name in argument definition context
- [ ] **GEN-NAME-005**: Generate Name in directive context
- [ ] **GEN-NAME-006**: Generate Name in enum value context

**Parser Tests:**
- [ ] **PARSE-NAME-001**: Parse Name terminal with valid identifier pattern
- [ ] **PARSE-NAME-002**: Parse Name in type definition context
- [ ] **PARSE-NAME-003**: Parse Name in field definition context
- [ ] **PARSE-NAME-004**: Parse Name in argument definition context
- [ ] **PARSE-NAME-005**: Parse Name in directive context
- [ ] **PARSE-NAME-006**: Parse Name in enum value context
- [ ] **PARSE-NAME-007**: Parse Name with invalid characters (should fail)
- [ ] **PARSE-NAME-008**: Parse Name starting with number (should fail)

### Value Tokens

**Generator Tests:**
- [ ] **GEN-VALUE-001**: Generate IntValue terminal
- [ ] **GEN-VALUE-002**: Generate FloatValue terminal
- [ ] **GEN-VALUE-003**: Generate StringValue terminal (single-line)
- [ ] **GEN-VALUE-004**: Generate StringValue terminal (block string)
- [ ] **GEN-VALUE-005**: Generate BooleanValue terminal (true)
- [ ] **GEN-VALUE-006**: Generate BooleanValue terminal (false)
- [ ] **GEN-VALUE-007**: Generate NullValue terminal
- [ ] **GEN-VALUE-008**: Generate EnumValue terminal

**Parser Tests:**
- [ ] **PARSE-VALUE-001**: Parse IntValue terminal
- [ ] **PARSE-VALUE-002**: Parse FloatValue terminal
- [ ] **PARSE-VALUE-003**: Parse StringValue terminal (single-line)
- [ ] **PARSE-VALUE-004**: Parse StringValue terminal (block string)
- [ ] **PARSE-VALUE-005**: Parse BooleanValue terminal (true)
- [ ] **PARSE-VALUE-006**: Parse BooleanValue terminal (false)
- [ ] **PARSE-VALUE-007**: Parse NullValue terminal
- [ ] **PARSE-VALUE-008**: Parse EnumValue terminal
- [ ] **PARSE-VALUE-009**: Parse invalid IntValue (should fail)
- [ ] **PARSE-VALUE-010**: Parse invalid StringValue (should fail)

### Punctuators

**Generator Tests:**
- [ ] **GEN-PUNC-001**: Generate all punctuator terminals correctly
- [ ] **GEN-PUNC-002**: Generate Bang (!) for non-null types
- [ ] **GEN-PUNC-003**: Generate Colon (:) in type references
- [ ] **GEN-PUNC-004**: Generate BraceL/BraceR for blocks
- [ ] **GEN-PUNC-005**: Generate BracketL/BracketR for lists
- [ ] **GEN-PUNC-006**: Generate ParenL/ParenR for arguments

**Parser Tests:**
- [ ] **PARSE-PUNC-001**: Parse all punctuator terminals correctly
- [ ] **PARSE-PUNC-002**: Parse Bang (!) for non-null types
- [ ] **PARSE-PUNC-003**: Parse Colon (:) in type references
- [ ] **PARSE-PUNC-004**: Parse BraceL/BraceR for blocks
- [ ] **PARSE-PUNC-005**: Parse BracketL/BracketR for lists
- [ ] **PARSE-PUNC-006**: Parse ParenL/ParenR for arguments
- [ ] **PARSE-PUNC-007**: Parse mismatched braces (should fail)
- [ ] **PARSE-PUNC-008**: Parse mismatched brackets (should fail)

---

## C.4 Document Syntax

### Document

**Generator Tests:**
- [ ] **GEN-DOC-001**: Generate empty Document (empty list)
- [ ] **GEN-DOC-002**: Generate Document with single Definition
- [ ] **GEN-DOC-003**: Generate Document with multiple Definitions
- [ ] **GEN-DOC-004**: Generate Document with mixed Definition types

**Parser Tests:**
- [ ] **PARSE-DOC-001**: Parse empty Document
- [ ] **PARSE-DOC-002**: Parse Document with single Definition
- [ ] **PARSE-DOC-003**: Parse Document with multiple Definitions
- [ ] **PARSE-DOC-004**: Parse Document with mixed Definition types
- [ ] **PARSE-DOC-005**: Round-trip: Parse → Generate → Parse (should match)

### Definition

**Generator Tests:**
- [ ] **GEN-DEF-001**: Generate ExecutableDefinition
- [ ] **GEN-DEF-002**: Generate TypeSystemDefinition
- [ ] **GEN-DEF-003**: Generate TypeSystemExtension

**Parser Tests:**
- [ ] **PARSE-DEF-001**: Parse ExecutableDefinition
- [ ] **PARSE-DEF-002**: Parse TypeSystemDefinition
- [ ] **PARSE-DEF-003**: Parse TypeSystemExtension
- [ ] **PARSE-DEF-004**: Round-trip: Parse → Generate → Parse (should match)

---

## 2.4 Operations

### OperationDefinition

**Generator Tests:**
- [ ] **GEN-OP-001**: Generate explicit OperationDefinition (query)
- [ ] **GEN-OP-002**: Generate explicit OperationDefinition (mutation)
- [ ] **GEN-OP-003**: Generate explicit OperationDefinition (subscription)
- [ ] **GEN-OP-004**: Generate shorthand Query (implicit SelectionSet)
- [ ] **GEN-OP-005**: Generate OperationDefinition with Name
- [ ] **GEN-OP-006**: Generate OperationDefinition with VariablesDefinition
- [ ] **GEN-OP-007**: Generate OperationDefinition with Directives
- [ ] **GEN-OP-008**: Generate OperationDefinition with Description

**Parser Tests:**
- [ ] **PARSE-OP-001**: Parse explicit OperationDefinition (query)
- [ ] **PARSE-OP-002**: Parse explicit OperationDefinition (mutation)
- [ ] **PARSE-OP-003**: Parse explicit OperationDefinition (subscription)
- [ ] **PARSE-OP-004**: Parse shorthand Query (implicit SelectionSet)
- [ ] **PARSE-OP-005**: Parse OperationDefinition with Name
- [ ] **PARSE-OP-006**: Parse OperationDefinition with VariablesDefinition
- [ ] **PARSE-OP-007**: Parse OperationDefinition with Directives
- [ ] **PARSE-OP-008**: Parse OperationDefinition with Description
- [ ] **PARSE-OP-009**: Round-trip: Parse → Generate → Parse (should match)

### OperationType

**Generator Tests:**
- [ ] **GEN-OPTYPE-001**: Generate query operation type
- [ ] **GEN-OPTYPE-002**: Generate mutation operation type
- [ ] **GEN-OPTYPE-003**: Generate subscription operation type

**Parser Tests:**
- [ ] **PARSE-OPTYPE-001**: Parse query operation type
- [ ] **PARSE-OPTYPE-002**: Parse mutation operation type
- [ ] **PARSE-OPTYPE-003**: Parse subscription operation type
- [ ] **PARSE-OPTYPE-004**: Parse invalid operation type (should fail)

---

## 2.5 Selection Sets

### SelectionSet

**Generator Tests:**
- [ ] **GEN-SEL-001**: Generate empty SelectionSet
- [ ] **GEN-SEL-002**: Generate SelectionSet with single Selection
- [ ] **GEN-SEL-003**: Generate SelectionSet with multiple Selections
- [ ] **GEN-SEL-004**: Generate nested SelectionSets

**Parser Tests:**
- [ ] **PARSE-SEL-001**: Parse empty SelectionSet
- [ ] **PARSE-SEL-002**: Parse SelectionSet with single Selection
- [ ] **PARSE-SEL-003**: Parse SelectionSet with multiple Selections
- [ ] **PARSE-SEL-004**: Parse nested SelectionSets
- [ ] **PARSE-SEL-005**: Round-trip: Parse → Generate → Parse (should match)

### Selection

**Generator Tests:**
- [ ] **GEN-SEL-FIELD-001**: Generate Field Selection
- [ ] **GEN-SEL-FRAG-001**: Generate FragmentSpread Selection
- [ ] **GEN-SEL-INLINE-001**: Generate InlineFragment Selection

**Parser Tests:**
- [ ] **PARSE-SEL-FIELD-001**: Parse Field Selection
- [ ] **PARSE-SEL-FRAG-001**: Parse FragmentSpread Selection
- [ ] **PARSE-SEL-INLINE-001**: Parse InlineFragment Selection
- [ ] **PARSE-SEL-ROUND-001**: Round-trip: Parse → Generate → Parse (should match)

---

## 2.6 Fields

### Field

**Generator Tests:**
- [ ] **GEN-FIELD-001**: Generate Field with Name only
- [ ] **GEN-FIELD-002**: Generate Field with Alias
- [ ] **GEN-FIELD-003**: Generate Field with Arguments
- [ ] **GEN-FIELD-004**: Generate Field with Directives
- [ ] **GEN-FIELD-005**: Generate Field with SelectionSet
- [ ] **GEN-FIELD-006**: Generate Field with all optional elements

**Parser Tests:**
- [ ] **PARSE-FIELD-001**: Parse Field with Name only
- [ ] **PARSE-FIELD-002**: Parse Field with Alias
- [ ] **PARSE-FIELD-003**: Parse Field with Arguments
- [ ] **PARSE-FIELD-004**: Parse Field with Directives
- [ ] **PARSE-FIELD-005**: Parse Field with SelectionSet
- [ ] **PARSE-FIELD-006**: Parse Field with all optional elements
- [ ] **PARSE-FIELD-007**: Round-trip: Parse → Generate → Parse (should match)

### Alias

**Generator Tests:**
- [ ] **GEN-ALIAS-001**: Generate Alias (Name:)

**Parser Tests:**
- [ ] **PARSE-ALIAS-001**: Parse Alias (Name:)
- [ ] **PARSE-ALIAS-002**: Round-trip: Parse → Generate → Parse (should match)

---

## 2.7 Arguments

### Arguments

**Generator Tests:**
- [ ] **GEN-ARGS-001**: Generate empty Arguments
- [ ] **GEN-ARGS-002**: Generate Arguments with single Argument
- [ ] **GEN-ARGS-003**: Generate Arguments with multiple Arguments

**Parser Tests:**
- [ ] **PARSE-ARGS-001**: Parse empty Arguments
- [ ] **PARSE-ARGS-002**: Parse Arguments with single Argument
- [ ] **PARSE-ARGS-003**: Parse Arguments with multiple Arguments
- [ ] **PARSE-ARGS-004**: Round-trip: Parse → Generate → Parse (should match)

### Argument

**Generator Tests:**
- [ ] **GEN-ARG-001**: Generate Argument (Name: Value)
- [ ] **GEN-ARG-002**: Generate Argument with Variable Value
- [ ] **GEN-ARG-003**: Generate Argument with IntValue
- [ ] **GEN-ARG-004**: Generate Argument with StringValue
- [ ] **GEN-ARG-005**: Generate Argument with BooleanValue
- [ ] **GEN-ARG-006**: Generate Argument with EnumValue
- [ ] **GEN-ARG-007**: Generate Argument with ListValue
- [ ] **GEN-ARG-008**: Generate Argument with ObjectValue

**Parser Tests:**
- [ ] **PARSE-ARG-001**: Parse Argument (Name: Value)
- [ ] **PARSE-ARG-002**: Parse Argument with Variable Value
- [ ] **PARSE-ARG-003**: Parse Argument with IntValue
- [ ] **PARSE-ARG-004**: Parse Argument with StringValue
- [ ] **PARSE-ARG-005**: Parse Argument with BooleanValue
- [ ] **PARSE-ARG-006**: Parse Argument with EnumValue
- [ ] **PARSE-ARG-007**: Parse Argument with ListValue
- [ ] **PARSE-ARG-008**: Parse Argument with ObjectValue
- [ ] **PARSE-ARG-009**: Round-trip: Parse → Generate → Parse (should match)

### ArgumentsConst

**Generator Tests:**
- [ ] **GEN-ARGSCONST-001**: Generate ArgumentsConst with constant values

**Parser Tests:**
- [ ] **PARSE-ARGSCONST-001**: Parse ArgumentsConst with constant values
- [ ] **PARSE-ARGSCONST-002**: Round-trip: Parse → Generate → Parse (should match)

---

## 2.9 Fragments

### FragmentSpread

**Generator Tests:**
- [ ] **GEN-FRAG-SPREAD-001**: Generate FragmentSpread
- [ ] **GEN-FRAG-SPREAD-002**: Generate FragmentSpread with Directives

**Parser Tests:**
- [ ] **PARSE-FRAG-SPREAD-001**: Parse FragmentSpread
- [ ] **PARSE-FRAG-SPREAD-002**: Parse FragmentSpread with Directives
- [ ] **PARSE-FRAG-SPREAD-003**: Round-trip: Parse → Generate → Parse (should match)

### InlineFragment

**Generator Tests:**
- [ ] **GEN-INLINE-FRAG-001**: Generate InlineFragment
- [ ] **GEN-INLINE-FRAG-002**: Generate InlineFragment with TypeCondition
- [ ] **GEN-INLINE-FRAG-003**: Generate InlineFragment with Directives

**Parser Tests:**
- [ ] **PARSE-INLINE-FRAG-001**: Parse InlineFragment
- [ ] **PARSE-INLINE-FRAG-002**: Parse InlineFragment with TypeCondition
- [ ] **PARSE-INLINE-FRAG-003**: Parse InlineFragment with Directives
- [ ] **PARSE-INLINE-FRAG-004**: Round-trip: Parse → Generate → Parse (should match)

### FragmentDefinition

**Generator Tests:**
- [ ] **GEN-FRAG-DEF-001**: Generate FragmentDefinition
- [ ] **GEN-FRAG-DEF-002**: Generate FragmentDefinition with Description
- [ ] **GEN-FRAG-DEF-003**: Generate FragmentDefinition with Directives

**Parser Tests:**
- [ ] **PARSE-FRAG-DEF-001**: Parse FragmentDefinition
- [ ] **PARSE-FRAG-DEF-002**: Parse FragmentDefinition with Description
- [ ] **PARSE-FRAG-DEF-003**: Parse FragmentDefinition with Directives
- [ ] **PARSE-FRAG-DEF-004**: Round-trip: Parse → Generate → Parse (should match)

### FragmentName

**Generator Tests:**
- [ ] **GEN-FRAG-NAME-001**: Generate FragmentName (not 'on')

**Parser Tests:**
- [ ] **PARSE-FRAG-NAME-001**: Parse FragmentName (not 'on')
- [ ] **PARSE-FRAG-NAME-002**: Parse FragmentName 'on' (should fail)

### TypeCondition

**Generator Tests:**
- [ ] **GEN-TYPE-COND-001**: Generate TypeCondition (on NamedType)

**Parser Tests:**
- [ ] **PARSE-TYPE-COND-001**: Parse TypeCondition (on NamedType)
- [ ] **PARSE-TYPE-COND-002**: Round-trip: Parse → Generate → Parse (should match)

---

## 2.10 Input Values

### Value

**Generator Tests:**
- [ ] **GEN-VAL-001**: Generate Variable Value
- [ ] **GEN-VAL-002**: Generate IntValue
- [ ] **GEN-VAL-003**: Generate FloatValue
- [ ] **GEN-VAL-004**: Generate StringValue
- [ ] **GEN-VAL-005**: Generate BooleanValue
- [ ] **GEN-VAL-006**: Generate NullValue
- [ ] **GEN-VAL-007**: Generate EnumValue
- [ ] **GEN-VAL-008**: Generate ListValue (empty)
- [ ] **GEN-VAL-009**: Generate ListValue (with elements)
- [ ] **GEN-VAL-010**: Generate ObjectValue (empty)
- [ ] **GEN-VAL-011**: Generate ObjectValue (with fields)

**Parser Tests:**
- [ ] **PARSE-VAL-001**: Parse Variable Value
- [ ] **PARSE-VAL-002**: Parse IntValue
- [ ] **PARSE-VAL-003**: Parse FloatValue
- [ ] **PARSE-VAL-004**: Parse StringValue
- [ ] **PARSE-VAL-005**: Parse BooleanValue
- [ ] **PARSE-VAL-006**: Parse NullValue
- [ ] **PARSE-VAL-007**: Parse EnumValue
- [ ] **PARSE-VAL-008**: Parse ListValue (empty)
- [ ] **PARSE-VAL-009**: Parse ListValue (with elements)
- [ ] **PARSE-VAL-010**: Parse ObjectValue (empty)
- [ ] **PARSE-VAL-011**: Parse ObjectValue (with fields)
- [ ] **PARSE-VAL-012**: Round-trip: Parse → Generate → Parse (should match)

### ValueConst

**Generator Tests:**
- [ ] **GEN-VALCONST-001**: Generate ValueConst (no variables)

**Parser Tests:**
- [ ] **PARSE-VALCONST-001**: Parse ValueConst (no variables)
- [ ] **PARSE-VALCONST-002**: Parse ValueConst with variable (should fail)
- [ ] **PARSE-VALCONST-003**: Round-trip: Parse → Generate → Parse (should match)

### EnumValue

**Generator Tests:**
- [ ] **GEN-ENUMVAL-001**: Generate EnumValue (not true/false/null)

**Parser Tests:**
- [ ] **PARSE-ENUMVAL-001**: Parse EnumValue (not true/false/null)
- [ ] **PARSE-ENUMVAL-002**: Parse EnumValue 'true' (should fail or handle)
- [ ] **PARSE-ENUMVAL-003**: Parse EnumValue 'false' (should fail or handle)
- [ ] **PARSE-ENUMVAL-004**: Parse EnumValue 'null' (should fail or handle)

### ListValue

**Generator Tests:**
- [ ] **GEN-LISTVAL-001**: Generate empty ListValue
- [ ] **GEN-LISTVAL-002**: Generate ListValue with Value elements

**Parser Tests:**
- [ ] **PARSE-LISTVAL-001**: Parse empty ListValue
- [ ] **PARSE-LISTVAL-002**: Parse ListValue with Value elements
- [ ] **PARSE-LISTVAL-003**: Round-trip: Parse → Generate → Parse (should match)

### ListValueConst

**Generator Tests:**
- [ ] **GEN-LISTVALCONST-001**: Generate ListValueConst with constant values

**Parser Tests:**
- [ ] **PARSE-LISTVALCONST-001**: Parse ListValueConst with constant values
- [ ] **PARSE-LISTVALCONST-002**: Round-trip: Parse → Generate → Parse (should match)

### ObjectValue

**Generator Tests:**
- [ ] **GEN-OBJVAL-001**: Generate empty ObjectValue
- [ ] **GEN-OBJVAL-002**: Generate ObjectValue with ObjectField elements

**Parser Tests:**
- [ ] **PARSE-OBJVAL-001**: Parse empty ObjectValue
- [ ] **PARSE-OBJVAL-002**: Parse ObjectValue with ObjectField elements
- [ ] **PARSE-OBJVAL-003**: Round-trip: Parse → Generate → Parse (should match)

### ObjectValueConst

**Generator Tests:**
- [ ] **GEN-OBJVALCONST-001**: Generate ObjectValueConst with constant fields

**Parser Tests:**
- [ ] **PARSE-OBJVALCONST-001**: Parse ObjectValueConst with constant fields
- [ ] **PARSE-OBJVALCONST-002**: Round-trip: Parse → Generate → Parse (should match)

### ObjectField

**Generator Tests:**
- [ ] **GEN-OBJFIELD-001**: Generate ObjectField (Name: Value)

**Parser Tests:**
- [ ] **PARSE-OBJFIELD-001**: Parse ObjectField (Name: Value)
- [ ] **PARSE-OBJFIELD-002**: Round-trip: Parse → Generate → Parse (should match)

### ObjectFieldConst

**Generator Tests:**
- [ ] **GEN-OBJFIELDCONST-001**: Generate ObjectFieldConst (Name: ValueConst)

**Parser Tests:**
- [ ] **PARSE-OBJFIELDCONST-001**: Parse ObjectFieldConst (Name: ValueConst)
- [ ] **PARSE-OBJFIELDCONST-002**: Round-trip: Parse → Generate → Parse (should match)

---

## 2.11 Variables

### VariablesDefinition

**Generator Tests:**
- [ ] **GEN-VARDEF-001**: Generate VariablesDefinition with single VariableDefinition
- [ ] **GEN-VARDEF-002**: Generate VariablesDefinition with multiple VariableDefinitions

**Parser Tests:**
- [ ] **PARSE-VARDEF-001**: Parse VariablesDefinition with single VariableDefinition
- [ ] **PARSE-VARDEF-002**: Parse VariablesDefinition with multiple VariableDefinitions
- [ ] **PARSE-VARDEF-003**: Round-trip: Parse → Generate → Parse (should match)

### VariableDefinition

**Generator Tests:**
- [ ] **GEN-VARDEF-ITEM-001**: Generate VariableDefinition (Variable: Type)
- [ ] **GEN-VARDEF-ITEM-002**: Generate VariableDefinition with Description
- [ ] **GEN-VARDEF-ITEM-003**: Generate VariableDefinition with DefaultValue
- [ ] **GEN-VARDEF-ITEM-004**: Generate VariableDefinition with DirectivesConst

**Parser Tests:**
- [ ] **PARSE-VARDEF-ITEM-001**: Parse VariableDefinition (Variable: Type)
- [ ] **PARSE-VARDEF-ITEM-002**: Parse VariableDefinition with Description
- [ ] **PARSE-VARDEF-ITEM-003**: Parse VariableDefinition with DefaultValue
- [ ] **PARSE-VARDEF-ITEM-004**: Parse VariableDefinition with DirectivesConst
- [ ] **PARSE-VARDEF-ITEM-005**: Round-trip: Parse → Generate → Parse (should match)

### Variable

**Generator Tests:**
- [ ] **GEN-VAR-001**: Generate Variable ($Name)

**Parser Tests:**
- [ ] **PARSE-VAR-001**: Parse Variable ($Name)
- [ ] **PARSE-VAR-002**: Parse Variable without $ (should fail)
- [ ] **PARSE-VAR-003**: Round-trip: Parse → Generate → Parse (should match)

### DefaultValue

**Generator Tests:**
- [ ] **GEN-DEFAULTVAL-001**: Generate DefaultValue (= ValueConst)

**Parser Tests:**
- [ ] **PARSE-DEFAULTVAL-001**: Parse DefaultValue (= ValueConst)
- [ ] **PARSE-DEFAULTVAL-002**: Round-trip: Parse → Generate → Parse (should match)

---

## 2.12 Type References

### Type

**Generator Tests:**
- [ ] **GEN-TYPE-001**: Generate NamedType
- [ ] **GEN-TYPE-002**: Generate ListType
- [ ] **GEN-TYPE-003**: Generate NonNullType (NamedType!)
- [ ] **GEN-TYPE-004**: Generate NonNullType (ListType!)
- [ ] **GEN-TYPE-005**: Generate nested ListType ([Type!]!)
- [ ] **GEN-TYPE-006**: Generate complex nested types

**Parser Tests:**
- [ ] **PARSE-TYPE-001**: Parse NamedType
- [ ] **PARSE-TYPE-002**: Parse ListType
- [ ] **PARSE-TYPE-003**: Parse NonNullType (NamedType!)
- [ ] **PARSE-TYPE-004**: Parse NonNullType (ListType!)
- [ ] **PARSE-TYPE-005**: Parse nested ListType ([Type!]!)
- [ ] **PARSE-TYPE-006**: Parse complex nested types
- [ ] **PARSE-TYPE-007**: Round-trip: Parse → Generate → Parse (should match)

### NamedType

**Generator Tests:**
- [ ] **GEN-NAMEDTYPE-001**: Generate NamedType (Name)

**Parser Tests:**
- [ ] **PARSE-NAMEDTYPE-001**: Parse NamedType (Name)
- [ ] **PARSE-NAMEDTYPE-002**: Round-trip: Parse → Generate → Parse (should match)

### ListType

**Generator Tests:**
- [ ] **GEN-LISTTYPE-001**: Generate ListType ([Type])

**Parser Tests:**
- [ ] **PARSE-LISTTYPE-001**: Parse ListType ([Type])
- [ ] **PARSE-LISTTYPE-002**: Round-trip: Parse → Generate → Parse (should match)

### NonNullType

**Generator Tests:**
- [ ] **GEN-NONNULL-001**: Generate NonNullType (NamedType!)
- [ ] **GEN-NONNULL-002**: Generate NonNullType (ListType!)

**Parser Tests:**
- [ ] **PARSE-NONNULL-001**: Parse NonNullType (NamedType!)
- [ ] **PARSE-NONNULL-002**: Parse NonNullType (ListType!)
- [ ] **PARSE-NONNULL-003**: Round-trip: Parse → Generate → Parse (should match)

---

## 2.13 Directives

### Directives

**Generator Tests:**
- [ ] **GEN-DIRS-001**: Generate Directives with single Directive
- [ ] **GEN-DIRS-002**: Generate Directives with multiple Directives

**Parser Tests:**
- [ ] **PARSE-DIRS-001**: Parse Directives with single Directive
- [ ] **PARSE-DIRS-002**: Parse Directives with multiple Directives
- [ ] **PARSE-DIRS-003**: Round-trip: Parse → Generate → Parse (should match)

### Directive

**Generator Tests:**
- [ ] **GEN-DIR-001**: Generate Directive (@Name)
- [ ] **GEN-DIR-002**: Generate Directive with Arguments

**Parser Tests:**
- [ ] **PARSE-DIR-001**: Parse Directive (@Name)
- [ ] **PARSE-DIR-002**: Parse Directive with Arguments
- [ ] **PARSE-DIR-003**: Parse Directive without @ (should fail)
- [ ] **PARSE-DIR-004**: Round-trip: Parse → Generate → Parse (should match)

### DirectivesConst

**Generator Tests:**
- [ ] **GEN-DIRSCONST-001**: Generate DirectivesConst with constant arguments

**Parser Tests:**
- [ ] **PARSE-DIRSCONST-001**: Parse DirectivesConst with constant arguments
- [ ] **PARSE-DIRSCONST-002**: Round-trip: Parse → Generate → Parse (should match)

### DirectiveConst

**Generator Tests:**
- [ ] **GEN-DIRCONST-001**: Generate DirectiveConst (@Name ArgumentsConst)

**Parser Tests:**
- [ ] **PARSE-DIRCONST-001**: Parse DirectiveConst (@Name ArgumentsConst)
- [ ] **PARSE-DIRCONST-002**: Round-trip: Parse → Generate → Parse (should match)

---

## 3. Type System

### TypeSystemDefinitionOrExtension

**Generator Tests:**
- [ ] **GEN-TSD-001**: Generate TypeSystemDefinition
- [ ] **GEN-TSD-002**: Generate TypeSystemExtension

**Parser Tests:**
- [ ] **PARSE-TSD-001**: Parse TypeSystemDefinition
- [ ] **PARSE-TSD-002**: Parse TypeSystemExtension
- [ ] **PARSE-TSD-003**: Round-trip: Parse → Generate → Parse (should match)

### TypeSystemDefinition

**Generator Tests:**
- [ ] **GEN-TSD-SCHEMA-001**: Generate SchemaDefinition
- [ ] **GEN-TSD-TYPE-001**: Generate TypeDefinition
- [ ] **GEN-TSD-DIR-001**: Generate DirectiveDefinition

**Parser Tests:**
- [ ] **PARSE-TSD-SCHEMA-001**: Parse SchemaDefinition
- [ ] **PARSE-TSD-TYPE-001**: Parse TypeDefinition
- [ ] **PARSE-TSD-DIR-001**: Parse DirectiveDefinition
- [ ] **PARSE-TSD-ROUND-001**: Round-trip: Parse → Generate → Parse (should match)

### TypeSystemExtension

**Generator Tests:**
- [ ] **GEN-TSE-001**: Generate SchemaExtension
- [ ] **GEN-TSE-002**: Generate TypeExtension

**Parser Tests:**
- [ ] **PARSE-TSE-001**: Parse SchemaExtension
- [ ] **PARSE-TSE-002**: Parse TypeExtension
- [ ] **PARSE-TSE-003**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.2 Description

### Description

**Generator Tests:**
- [ ] **GEN-DESC-001**: Generate Description (StringValue)
- [ ] **GEN-DESC-002**: Generate Description in type definition
- [ ] **GEN-DESC-003**: Generate Description in field definition
- [ ] **GEN-DESC-004**: Generate Description in argument definition
- [ ] **GEN-DESC-005**: Skip Description when includeDescriptions=false ✅ **GEN-GSDL-006**

**Parser Tests:**
- [ ] **PARSE-DESC-001**: Parse Description (StringValue)
- [ ] **PARSE-DESC-002**: Parse Description in type definition
- [ ] **PARSE-DESC-003**: Parse Description in field definition
- [ ] **PARSE-DESC-004**: Parse Description in argument definition
- [ ] **PARSE-DESC-005**: Parse Description (single-line string)
- [ ] **PARSE-DESC-006**: Parse Description (block string)
- [ ] **PARSE-DESC-007**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.3 Schema

### SchemaDefinition

**Generator Tests:**
- [ ] **GEN-SCHEMA-001**: Generate SchemaDefinition with root operation types ✅ **GEN-GSDL-001**
- [ ] **GEN-SCHEMA-002**: Generate SchemaDefinition with Description
- [ ] **GEN-SCHEMA-003**: Generate SchemaDefinition with DirectivesConst
- [ ] **GEN-SCHEMA-004**: Generate SchemaDefinition with query only
- [ ] **GEN-SCHEMA-005**: Generate SchemaDefinition with query and mutation
- [ ] **GEN-SCHEMA-006**: Generate SchemaDefinition with all three operations

**Parser Tests:**
- [ ] **PARSE-SCHEMA-001**: Parse SchemaDefinition with root operation types
- [ ] **PARSE-SCHEMA-002**: Parse SchemaDefinition with Description
- [ ] **PARSE-SCHEMA-003**: Parse SchemaDefinition with DirectivesConst
- [ ] **PARSE-SCHEMA-004**: Parse SchemaDefinition with query only
- [ ] **PARSE-SCHEMA-005**: Parse SchemaDefinition with query and mutation
- [ ] **PARSE-SCHEMA-006**: Parse SchemaDefinition with all three operations
- [ ] **PARSE-SCHEMA-007**: Round-trip: Parse → Generate → Parse (should match)

### RootOperationTypeDefinition

**Generator Tests:**
- [ ] **GEN-ROOT-OP-001**: Generate RootOperationTypeDefinition (query: Query)
- [ ] **GEN-ROOT-OP-002**: Generate RootOperationTypeDefinition (mutation: Mutation)
- [ ] **GEN-ROOT-OP-003**: Generate RootOperationTypeDefinition (subscription: Subscription)
- [ ] **GEN-ROOT-OP-004**: Generate RootOperationTypeDefinition with custom type names

**Parser Tests:**
- [ ] **PARSE-ROOT-OP-001**: Parse RootOperationTypeDefinition (query: Query)
- [ ] **PARSE-ROOT-OP-002**: Parse RootOperationTypeDefinition (mutation: Mutation)
- [ ] **PARSE-ROOT-OP-003**: Parse RootOperationTypeDefinition (subscription: Subscription)
- [ ] **PARSE-ROOT-OP-004**: Parse RootOperationTypeDefinition with custom type names
- [ ] **PARSE-ROOT-OP-005**: Round-trip: Parse → Generate → Parse (should match)

### SchemaExtension

**Generator Tests:**
- [ ] **GEN-SCHEMA-EXT-001**: Generate SchemaExtension
- [ ] **GEN-SCHEMA-EXT-002**: Generate SchemaExtension with DirectivesConst
- [ ] **GEN-SCHEMA-EXT-003**: Generate SchemaExtension with RootOperationTypeDefinitions

**Parser Tests:**
- [ ] **PARSE-SCHEMA-EXT-001**: Parse SchemaExtension
- [ ] **PARSE-SCHEMA-EXT-002**: Parse SchemaExtension with DirectivesConst
- [ ] **PARSE-SCHEMA-EXT-003**: Parse SchemaExtension with RootOperationTypeDefinitions
- [ ] **PARSE-SCHEMA-EXT-004**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.4 Types

### TypeDefinition

**Generator Tests:**
- [ ] **GEN-TYPEDEF-001**: Generate ScalarTypeDefinition
- [ ] **GEN-TYPEDEF-002**: Generate ObjectTypeDefinition
- [ ] **GEN-TYPEDEF-003**: Generate InterfaceTypeDefinition
- [ ] **GEN-TYPEDEF-004**: Generate UnionTypeDefinition
- [ ] **GEN-TYPEDEF-005**: Generate EnumTypeDefinition
- [ ] **GEN-TYPEDEF-006**: Generate InputObjectTypeDefinition

**Parser Tests:**
- [ ] **PARSE-TYPEDEF-001**: Parse ScalarTypeDefinition
- [ ] **PARSE-TYPEDEF-002**: Parse ObjectTypeDefinition
- [ ] **PARSE-TYPEDEF-003**: Parse InterfaceTypeDefinition
- [ ] **PARSE-TYPEDEF-004**: Parse UnionTypeDefinition
- [ ] **PARSE-TYPEDEF-005**: Parse EnumTypeDefinition
- [ ] **PARSE-TYPEDEF-006**: Parse InputObjectTypeDefinition
- [ ] **PARSE-TYPEDEF-007**: Round-trip: Parse → Generate → Parse (should match)

### TypeExtension

**Generator Tests:**
- [ ] **GEN-TYPEEXT-001**: Generate ScalarTypeExtension
- [ ] **GEN-TYPEEXT-002**: Generate ObjectTypeExtension
- [ ] **GEN-TYPEEXT-003**: Generate InterfaceTypeExtension
- [ ] **GEN-TYPEEXT-004**: Generate UnionTypeExtension
- [ ] **GEN-TYPEEXT-005**: Generate EnumTypeExtension
- [ ] **GEN-TYPEEXT-006**: Generate InputObjectTypeExtension

**Parser Tests:**
- [ ] **PARSE-TYPEEXT-001**: Parse ScalarTypeExtension
- [ ] **PARSE-TYPEEXT-002**: Parse ObjectTypeExtension
- [ ] **PARSE-TYPEEXT-003**: Parse InterfaceTypeExtension
- [ ] **PARSE-TYPEEXT-004**: Parse UnionTypeExtension
- [ ] **PARSE-TYPEEXT-005**: Parse EnumTypeExtension
- [ ] **PARSE-TYPEEXT-006**: Parse InputObjectTypeExtension
- [ ] **PARSE-TYPEEXT-007**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.5 Scalars

### ScalarTypeDefinition

**Generator Tests:**
- [ ] **GEN-SCALAR-001**: Generate ScalarTypeDefinition ✅ **GEN-GSDL-002**
- [ ] **GEN-SCALAR-002**: Generate ScalarTypeDefinition with Description
- [ ] **GEN-SCALAR-003**: Generate ScalarTypeDefinition with DirectivesConst
- [ ] **GEN-SCALAR-004**: Generate multiple ScalarTypeDefinitions

**Parser Tests:**
- [ ] **PARSE-SCALAR-001**: Parse ScalarTypeDefinition
- [ ] **PARSE-SCALAR-002**: Parse ScalarTypeDefinition with Description
- [ ] **PARSE-SCALAR-003**: Parse ScalarTypeDefinition with DirectivesConst
- [ ] **PARSE-SCALAR-004**: Parse multiple ScalarTypeDefinitions
- [ ] **PARSE-SCALAR-005**: Round-trip: Parse → Generate → Parse (should match)

### ScalarTypeExtension

**Generator Tests:**
- [ ] **GEN-SCALAR-EXT-001**: Generate ScalarTypeExtension
- [ ] **GEN-SCALAR-EXT-002**: Generate ScalarTypeExtension with DirectivesConst

**Parser Tests:**
- [ ] **PARSE-SCALAR-EXT-001**: Parse ScalarTypeExtension
- [ ] **PARSE-SCALAR-EXT-002**: Parse ScalarTypeExtension with DirectivesConst
- [ ] **PARSE-SCALAR-EXT-003**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.6 Objects

### ObjectTypeDefinition

**Generator Tests:**
- [ ] **GEN-OBJECT-001**: Generate ObjectTypeDefinition with Name only
- [ ] **GEN-OBJECT-002**: Generate ObjectTypeDefinition with FieldsDefinition ✅ **GEN-GSDL-003**
- [ ] **GEN-OBJECT-003**: Generate ObjectTypeDefinition with Description
- [ ] **GEN-OBJECT-004**: Generate ObjectTypeDefinition with ImplementsInterfaces
- [ ] **GEN-OBJECT-005**: Generate ObjectTypeDefinition with DirectivesConst
- [ ] **GEN-OBJECT-006**: Generate ObjectTypeDefinition with all optional elements
- [ ] **GEN-OBJECT-007**: Generate ObjectTypeDefinition with multiple fields
- [ ] **GEN-OBJECT-008**: Generate ObjectTypeDefinition with nested field types

**Parser Tests:**
- [ ] **PARSE-OBJECT-001**: Parse ObjectTypeDefinition with Name only
- [ ] **PARSE-OBJECT-002**: Parse ObjectTypeDefinition with FieldsDefinition
- [ ] **PARSE-OBJECT-003**: Parse ObjectTypeDefinition with Description
- [ ] **PARSE-OBJECT-004**: Parse ObjectTypeDefinition with ImplementsInterfaces
- [ ] **PARSE-OBJECT-005**: Parse ObjectTypeDefinition with DirectivesConst
- [ ] **PARSE-OBJECT-006**: Parse ObjectTypeDefinition with all optional elements
- [ ] **PARSE-OBJECT-007**: Parse ObjectTypeDefinition with multiple fields
- [ ] **PARSE-OBJECT-008**: Parse ObjectTypeDefinition with nested field types
- [ ] **PARSE-OBJECT-009**: Round-trip: Parse → Generate → Parse (should match)

### ImplementsInterfaces

**Generator Tests:**
- [ ] **GEN-IMPL-001**: Generate ImplementsInterfaces (single interface)
- [ ] **GEN-IMPL-002**: Generate ImplementsInterfaces (multiple interfaces with &)
- [ ] **GEN-IMPL-003**: Generate ImplementsInterfaces (implements & Interface1 & Interface2)

**Parser Tests:**
- [ ] **PARSE-IMPL-001**: Parse ImplementsInterfaces (single interface)
- [ ] **PARSE-IMPL-002**: Parse ImplementsInterfaces (multiple interfaces with &)
- [ ] **PARSE-IMPL-003**: Parse ImplementsInterfaces (implements & Interface1 & Interface2)
- [ ] **PARSE-IMPL-004**: Round-trip: Parse → Generate → Parse (should match)

### FieldsDefinition

**Generator Tests:**
- [ ] **GEN-FIELDS-001**: Generate empty FieldsDefinition
- [ ] **GEN-FIELDS-002**: Generate FieldsDefinition with single FieldDefinition
- [ ] **GEN-FIELDS-003**: Generate FieldsDefinition with multiple FieldDefinitions
- [ ] **GEN-FIELDS-004**: Generate FieldsDefinition with proper formatting/indentation

**Parser Tests:**
- [ ] **PARSE-FIELDS-001**: Parse empty FieldsDefinition
- [ ] **PARSE-FIELDS-002**: Parse FieldsDefinition with single FieldDefinition
- [ ] **PARSE-FIELDS-003**: Parse FieldsDefinition with multiple FieldDefinitions
- [ ] **PARSE-FIELDS-004**: Round-trip: Parse → Generate → Parse (should match)

### FieldDefinition

**Generator Tests:**
- [ ] **GEN-FIELDDEF-001**: Generate FieldDefinition (Name: Type)
- [ ] **GEN-FIELDDEF-002**: Generate FieldDefinition with Description
- [ ] **GEN-FIELDDEF-003**: Generate FieldDefinition with ArgumentsDefinition
- [ ] **GEN-FIELDDEF-004**: Generate FieldDefinition with DirectivesConst
- [ ] **GEN-FIELDDEF-005**: Generate FieldDefinition with all optional elements
- [ ] **GEN-FIELDDEF-006**: Generate FieldDefinition with non-null Type
- [ ] **GEN-FIELDDEF-007**: Generate FieldDefinition with ListType
- [ ] **GEN-FIELDDEF-008**: Generate FieldDefinition with nested ListType ([Type!]!)

**Parser Tests:**
- [ ] **PARSE-FIELDDEF-001**: Parse FieldDefinition (Name: Type)
- [ ] **PARSE-FIELDDEF-002**: Parse FieldDefinition with Description
- [ ] **PARSE-FIELDDEF-003**: Parse FieldDefinition with ArgumentsDefinition
- [ ] **PARSE-FIELDDEF-004**: Parse FieldDefinition with DirectivesConst
- [ ] **PARSE-FIELDDEF-005**: Parse FieldDefinition with all optional elements
- [ ] **PARSE-FIELDDEF-006**: Parse FieldDefinition with non-null Type
- [ ] **PARSE-FIELDDEF-007**: Parse FieldDefinition with ListType
- [ ] **PARSE-FIELDDEF-008**: Parse FieldDefinition with nested ListType ([Type!]!)
- [ ] **PARSE-FIELDDEF-009**: Round-trip: Parse → Generate → Parse (should match)

### ArgumentsDefinition

**Generator Tests:**
- [ ] **GEN-ARGSDEF-001**: Generate empty ArgumentsDefinition
- [ ] **GEN-ARGSDEF-002**: Generate ArgumentsDefinition with single InputValueDefinition
- [ ] **GEN-ARGSDEF-003**: Generate ArgumentsDefinition with multiple InputValueDefinitions

**Parser Tests:**
- [ ] **PARSE-ARGSDEF-001**: Parse empty ArgumentsDefinition
- [ ] **PARSE-ARGSDEF-002**: Parse ArgumentsDefinition with single InputValueDefinition
- [ ] **PARSE-ARGSDEF-003**: Parse ArgumentsDefinition with multiple InputValueDefinitions
- [ ] **PARSE-ARGSDEF-004**: Round-trip: Parse → Generate → Parse (should match)

### InputValueDefinition

**Generator Tests:**
- [ ] **GEN-INPVAL-001**: Generate InputValueDefinition (Name: Type)
- [ ] **GEN-INPVAL-002**: Generate InputValueDefinition with Description
- [ ] **GEN-INPVAL-003**: Generate InputValueDefinition with DefaultValue
- [ ] **GEN-INPVAL-004**: Generate InputValueDefinition with DirectivesConst
- [ ] **GEN-INPVAL-005**: Generate InputValueDefinition with non-null Type
- [ ] **GEN-INPVAL-006**: Generate InputValueDefinition with ListType

**Parser Tests:**
- [ ] **PARSE-INPVAL-001**: Parse InputValueDefinition (Name: Type)
- [ ] **PARSE-INPVAL-002**: Parse InputValueDefinition with Description
- [ ] **PARSE-INPVAL-003**: Parse InputValueDefinition with DefaultValue
- [ ] **PARSE-INPVAL-004**: Parse InputValueDefinition with DirectivesConst
- [ ] **PARSE-INPVAL-005**: Parse InputValueDefinition with non-null Type
- [ ] **PARSE-INPVAL-006**: Parse InputValueDefinition with ListType
- [ ] **PARSE-INPVAL-007**: Round-trip: Parse → Generate → Parse (should match)

### ObjectTypeExtension

**Generator Tests:**
- [ ] **GEN-OBJECT-EXT-001**: Generate ObjectTypeExtension (Fields)
- [ ] **GEN-OBJECT-EXT-002**: Generate ObjectTypeExtension (Implements & Directives)
- [ ] **GEN-OBJECT-EXT-003**: Generate ObjectTypeExtension (Implements only)

**Parser Tests:**
- [ ] **PARSE-OBJECT-EXT-001**: Parse ObjectTypeExtension (Fields)
- [ ] **PARSE-OBJECT-EXT-002**: Parse ObjectTypeExtension (Implements & Directives)
- [ ] **PARSE-OBJECT-EXT-003**: Parse ObjectTypeExtension (Implements only)
- [ ] **PARSE-OBJECT-EXT-004**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.7 Interfaces

### InterfaceTypeDefinition

**Generator Tests:**
- [ ] **GEN-INTERFACE-001**: Generate InterfaceTypeDefinition with Name only
- [ ] **GEN-INTERFACE-002**: Generate InterfaceTypeDefinition with FieldsDefinition ✅ **GEN-GSDL-004**
- [ ] **GEN-INTERFACE-003**: Generate InterfaceTypeDefinition with Description
- [ ] **GEN-INTERFACE-004**: Generate InterfaceTypeDefinition with ImplementsInterfaces
- [ ] **GEN-INTERFACE-005**: Generate InterfaceTypeDefinition with DirectivesConst
- [ ] **GEN-INTERFACE-006**: Generate InterfaceTypeDefinition with all optional elements
- [ ] **GEN-INTERFACE-007**: Generate InterfaceTypeDefinition with multiple fields

**Parser Tests:**
- [ ] **PARSE-INTERFACE-001**: Parse InterfaceTypeDefinition with Name only
- [ ] **PARSE-INTERFACE-002**: Parse InterfaceTypeDefinition with FieldsDefinition
- [ ] **PARSE-INTERFACE-003**: Parse InterfaceTypeDefinition with Description
- [ ] **PARSE-INTERFACE-004**: Parse InterfaceTypeDefinition with ImplementsInterfaces
- [ ] **PARSE-INTERFACE-005**: Parse InterfaceTypeDefinition with DirectivesConst
- [ ] **PARSE-INTERFACE-006**: Parse InterfaceTypeDefinition with all optional elements
- [ ] **PARSE-INTERFACE-007**: Parse InterfaceTypeDefinition with multiple fields
- [ ] **PARSE-INTERFACE-008**: Round-trip: Parse → Generate → Parse (should match)

### InterfaceTypeExtension

**Generator Tests:**
- [ ] **GEN-INTERFACE-EXT-001**: Generate InterfaceTypeExtension (Fields)
- [ ] **GEN-INTERFACE-EXT-002**: Generate InterfaceTypeExtension (Implements & Directives)
- [ ] **GEN-INTERFACE-EXT-003**: Generate InterfaceTypeExtension (Implements only)

**Parser Tests:**
- [ ] **PARSE-INTERFACE-EXT-001**: Parse InterfaceTypeExtension (Fields)
- [ ] **PARSE-INTERFACE-EXT-002**: Parse InterfaceTypeExtension (Implements & Directives)
- [ ] **PARSE-INTERFACE-EXT-003**: Parse InterfaceTypeExtension (Implements only)
- [ ] **PARSE-INTERFACE-EXT-004**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.8 Unions

### UnionTypeDefinition

**Generator Tests:**
- [ ] **GEN-UNION-001**: Generate UnionTypeDefinition with Name only
- [ ] **GEN-UNION-002**: Generate UnionTypeDefinition with UnionMemberTypes
- [ ] **GEN-UNION-003**: Generate UnionTypeDefinition with Description
- [ ] **GEN-UNION-004**: Generate UnionTypeDefinition with DirectivesConst
- [ ] **GEN-UNION-005**: Generate UnionTypeDefinition with single member type
- [ ] **GEN-UNION-006**: Generate UnionTypeDefinition with multiple member types (|)

**Parser Tests:**
- [ ] **PARSE-UNION-001**: Parse UnionTypeDefinition with Name only
- [ ] **PARSE-UNION-002**: Parse UnionTypeDefinition with UnionMemberTypes
- [ ] **PARSE-UNION-003**: Parse UnionTypeDefinition with Description
- [ ] **PARSE-UNION-004**: Parse UnionTypeDefinition with DirectivesConst
- [ ] **PARSE-UNION-005**: Parse UnionTypeDefinition with single member type
- [ ] **PARSE-UNION-006**: Parse UnionTypeDefinition with multiple member types (|)
- [ ] **PARSE-UNION-007**: Round-trip: Parse → Generate → Parse (should match)

### UnionMemberTypes

**Generator Tests:**
- [ ] **GEN-UNION-MEM-001**: Generate UnionMemberTypes (= Type1)
- [ ] **GEN-UNION-MEM-002**: Generate UnionMemberTypes (= | Type1)
- [ ] **GEN-UNION-MEM-003**: Generate UnionMemberTypes (= Type1 | Type2)
- [ ] **GEN-UNION-MEM-004**: Generate UnionMemberTypes (= | Type1 | Type2)

**Parser Tests:**
- [ ] **PARSE-UNION-MEM-001**: Parse UnionMemberTypes (= Type1)
- [ ] **PARSE-UNION-MEM-002**: Parse UnionMemberTypes (= | Type1)
- [ ] **PARSE-UNION-MEM-003**: Parse UnionMemberTypes (= Type1 | Type2)
- [ ] **PARSE-UNION-MEM-004**: Parse UnionMemberTypes (= | Type1 | Type2)
- [ ] **PARSE-UNION-MEM-005**: Round-trip: Parse → Generate → Parse (should match)

### UnionTypeExtension

**Generator Tests:**
- [ ] **GEN-UNION-EXT-001**: Generate UnionTypeExtension (UnionMemberTypes)
- [ ] **GEN-UNION-EXT-002**: Generate UnionTypeExtension (DirectivesConst)

**Parser Tests:**
- [ ] **PARSE-UNION-EXT-001**: Parse UnionTypeExtension (UnionMemberTypes)
- [ ] **PARSE-UNION-EXT-002**: Parse UnionTypeExtension (DirectivesConst)
- [ ] **PARSE-UNION-EXT-003**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.9 Enums

### EnumTypeDefinition

**Generator Tests:**
- [ ] **GEN-ENUM-001**: Generate EnumTypeDefinition with Name only
- [ ] **GEN-ENUM-002**: Generate EnumTypeDefinition with EnumValuesDefinition
- [ ] **GEN-ENUM-003**: Generate EnumTypeDefinition with Description
- [ ] **GEN-ENUM-004**: Generate EnumTypeDefinition with DirectivesConst
- [ ] **GEN-ENUM-005**: Generate EnumTypeDefinition with single enum value
- [ ] **GEN-ENUM-006**: Generate EnumTypeDefinition with multiple enum values

**Parser Tests:**
- [ ] **PARSE-ENUM-001**: Parse EnumTypeDefinition with Name only
- [ ] **PARSE-ENUM-002**: Parse EnumTypeDefinition with EnumValuesDefinition
- [ ] **PARSE-ENUM-003**: Parse EnumTypeDefinition with Description
- [ ] **PARSE-ENUM-004**: Parse EnumTypeDefinition with DirectivesConst
- [ ] **PARSE-ENUM-005**: Parse EnumTypeDefinition with single enum value
- [ ] **PARSE-ENUM-006**: Parse EnumTypeDefinition with multiple enum values
- [ ] **PARSE-ENUM-007**: Round-trip: Parse → Generate → Parse (should match)

### EnumValuesDefinition

**Generator Tests:**
- [ ] **GEN-ENUM-VALS-001**: Generate EnumValuesDefinition with single EnumValueDefinition
- [ ] **GEN-ENUM-VALS-002**: Generate EnumValuesDefinition with multiple EnumValueDefinitions

**Parser Tests:**
- [ ] **PARSE-ENUM-VALS-001**: Parse EnumValuesDefinition with single EnumValueDefinition
- [ ] **PARSE-ENUM-VALS-002**: Parse EnumValuesDefinition with multiple EnumValueDefinitions
- [ ] **PARSE-ENUM-VALS-003**: Round-trip: Parse → Generate → Parse (should match)

### EnumValueDefinition

**Generator Tests:**
- [ ] **GEN-ENUM-VAL-001**: Generate EnumValueDefinition (EnumValue)
- [ ] **GEN-ENUM-VAL-002**: Generate EnumValueDefinition with Description
- [ ] **GEN-ENUM-VAL-003**: Generate EnumValueDefinition with DirectivesConst

**Parser Tests:**
- [ ] **PARSE-ENUM-VAL-001**: Parse EnumValueDefinition (EnumValue)
- [ ] **PARSE-ENUM-VAL-002**: Parse EnumValueDefinition with Description
- [ ] **PARSE-ENUM-VAL-003**: Parse EnumValueDefinition with DirectivesConst
- [ ] **PARSE-ENUM-VAL-004**: Round-trip: Parse → Generate → Parse (should match)

### EnumTypeExtension

**Generator Tests:**
- [ ] **GEN-ENUM-EXT-001**: Generate EnumTypeExtension (EnumValuesDefinition)
- [ ] **GEN-ENUM-EXT-002**: Generate EnumTypeExtension (DirectivesConst)

**Parser Tests:**
- [ ] **PARSE-ENUM-EXT-001**: Parse EnumTypeExtension (EnumValuesDefinition)
- [ ] **PARSE-ENUM-EXT-002**: Parse EnumTypeExtension (DirectivesConst)
- [ ] **PARSE-ENUM-EXT-003**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.10 Input Objects

### InputObjectTypeDefinition

**Generator Tests:**
- [ ] **GEN-INPUT-001**: Generate InputObjectTypeDefinition with Name only
- [ ] **GEN-INPUT-002**: Generate InputObjectTypeDefinition with InputFieldsDefinition
- [ ] **GEN-INPUT-003**: Generate InputObjectTypeDefinition with Description
- [ ] **GEN-INPUT-004**: Generate InputObjectTypeDefinition with DirectivesConst
- [ ] **GEN-INPUT-005**: Generate InputObjectTypeDefinition with single input field
- [ ] **GEN-INPUT-006**: Generate InputObjectTypeDefinition with multiple input fields

**Parser Tests:**
- [ ] **PARSE-INPUT-001**: Parse InputObjectTypeDefinition with Name only
- [ ] **PARSE-INPUT-002**: Parse InputObjectTypeDefinition with InputFieldsDefinition
- [ ] **PARSE-INPUT-003**: Parse InputObjectTypeDefinition with Description
- [ ] **PARSE-INPUT-004**: Parse InputObjectTypeDefinition with DirectivesConst
- [ ] **PARSE-INPUT-005**: Parse InputObjectTypeDefinition with single input field
- [ ] **PARSE-INPUT-006**: Parse InputObjectTypeDefinition with multiple input fields
- [ ] **PARSE-INPUT-007**: Round-trip: Parse → Generate → Parse (should match)

### InputFieldsDefinition

**Generator Tests:**
- [ ] **GEN-INPUT-FIELDS-001**: Generate InputFieldsDefinition with single InputValueDefinition
- [ ] **GEN-INPUT-FIELDS-002**: Generate InputFieldsDefinition with multiple InputValueDefinitions

**Parser Tests:**
- [ ] **PARSE-INPUT-FIELDS-001**: Parse InputFieldsDefinition with single InputValueDefinition
- [ ] **PARSE-INPUT-FIELDS-002**: Parse InputFieldsDefinition with multiple InputValueDefinitions
- [ ] **PARSE-INPUT-FIELDS-003**: Round-trip: Parse → Generate → Parse (should match)

### InputObjectTypeExtension

**Generator Tests:**
- [ ] **GEN-INPUT-EXT-001**: Generate InputObjectTypeExtension (InputFieldsDefinition)
- [ ] **GEN-INPUT-EXT-002**: Generate InputObjectTypeExtension (DirectivesConst)

**Parser Tests:**
- [ ] **PARSE-INPUT-EXT-001**: Parse InputObjectTypeExtension (InputFieldsDefinition)
- [ ] **PARSE-INPUT-EXT-002**: Parse InputObjectTypeExtension (DirectivesConst)
- [ ] **PARSE-INPUT-EXT-003**: Round-trip: Parse → Generate → Parse (should match)

---

## 3.13 Directives (Type System)

### DirectiveDefinition

**Generator Tests:**
- [ ] **GEN-DIRDEF-001**: Generate DirectiveDefinition (@Name on Location)
- [ ] **GEN-DIRDEF-002**: Generate DirectiveDefinition with Description
- [ ] **GEN-DIRDEF-003**: Generate DirectiveDefinition with ArgumentsDefinition
- [ ] **GEN-DIRDEF-004**: Generate DirectiveDefinition with repeatable keyword
- [ ] **GEN-DIRDEF-005**: Generate DirectiveDefinition with single DirectiveLocation
- [ ] **GEN-DIRDEF-006**: Generate DirectiveDefinition with multiple DirectiveLocations (|)

**Parser Tests:**
- [ ] **PARSE-DIRDEF-001**: Parse DirectiveDefinition (@Name on Location)
- [ ] **PARSE-DIRDEF-002**: Parse DirectiveDefinition with Description
- [ ] **PARSE-DIRDEF-003**: Parse DirectiveDefinition with ArgumentsDefinition
- [ ] **PARSE-DIRDEF-004**: Parse DirectiveDefinition with repeatable keyword
- [ ] **PARSE-DIRDEF-005**: Parse DirectiveDefinition with single DirectiveLocation
- [ ] **PARSE-DIRDEF-006**: Parse DirectiveDefinition with multiple DirectiveLocations (|)
- [ ] **PARSE-DIRDEF-007**: Round-trip: Parse → Generate → Parse (should match)

### DirectiveLocations

**Generator Tests:**
- [ ] **GEN-DIRLOC-001**: Generate DirectiveLocations (single location)
- [ ] **GEN-DIRLOC-002**: Generate DirectiveLocations (| Location1)
- [ ] **GEN-DIRLOC-003**: Generate DirectiveLocations (Location1 | Location2)
- [ ] **GEN-DIRLOC-004**: Generate DirectiveLocations (| Location1 | Location2)

**Parser Tests:**
- [ ] **PARSE-DIRLOC-001**: Parse DirectiveLocations (single location)
- [ ] **PARSE-DIRLOC-002**: Parse DirectiveLocations (| Location1)
- [ ] **PARSE-DIRLOC-003**: Parse DirectiveLocations (Location1 | Location2)
- [ ] **PARSE-DIRLOC-004**: Parse DirectiveLocations (| Location1 | Location2)
- [ ] **PARSE-DIRLOC-005**: Round-trip: Parse → Generate → Parse (should match)

### DirectiveLocation

**Generator Tests:**
- [ ] **GEN-DIRLOC-EXEC-001**: Generate ExecutableDirectiveLocation (QUERY)
- [ ] **GEN-DIRLOC-EXEC-002**: Generate ExecutableDirectiveLocation (MUTATION)
- [ ] **GEN-DIRLOC-EXEC-003**: Generate ExecutableDirectiveLocation (SUBSCRIPTION)
- [ ] **GEN-DIRLOC-EXEC-004**: Generate ExecutableDirectiveLocation (FIELD)
- [ ] **GEN-DIRLOC-EXEC-005**: Generate ExecutableDirectiveLocation (FRAGMENT_DEFINITION)
- [ ] **GEN-DIRLOC-EXEC-006**: Generate ExecutableDirectiveLocation (FRAGMENT_SPREAD)
- [ ] **GEN-DIRLOC-EXEC-007**: Generate ExecutableDirectiveLocation (INLINE_FRAGMENT)
- [ ] **GEN-DIRLOC-EXEC-008**: Generate ExecutableDirectiveLocation (VARIABLE_DEFINITION)

**Parser Tests:**
- [ ] **PARSE-DIRLOC-EXEC-001**: Parse ExecutableDirectiveLocation (QUERY)
- [ ] **PARSE-DIRLOC-EXEC-002**: Parse ExecutableDirectiveLocation (MUTATION)
- [ ] **PARSE-DIRLOC-EXEC-003**: Parse ExecutableDirectiveLocation (SUBSCRIPTION)
- [ ] **PARSE-DIRLOC-EXEC-004**: Parse ExecutableDirectiveLocation (FIELD)
- [ ] **PARSE-DIRLOC-EXEC-005**: Parse ExecutableDirectiveLocation (FRAGMENT_DEFINITION)
- [ ] **PARSE-DIRLOC-EXEC-006**: Parse ExecutableDirectiveLocation (FRAGMENT_SPREAD)
- [ ] **PARSE-DIRLOC-EXEC-007**: Parse ExecutableDirectiveLocation (INLINE_FRAGMENT)
- [ ] **PARSE-DIRLOC-EXEC-008**: Parse ExecutableDirectiveLocation (VARIABLE_DEFINITION)
- [ ] **PARSE-DIRLOC-EXEC-009**: Round-trip: Parse → Generate → Parse (should match)

### TypeSystemDirectiveLocation

**Generator Tests:**
- [ ] **GEN-DIRLOC-TS-001**: Generate TypeSystemDirectiveLocation (SCHEMA)
- [ ] **GEN-DIRLOC-TS-002**: Generate TypeSystemDirectiveLocation (SCALAR)
- [ ] **GEN-DIRLOC-TS-003**: Generate TypeSystemDirectiveLocation (OBJECT)
- [ ] **GEN-DIRLOC-TS-004**: Generate TypeSystemDirectiveLocation (FIELD_DEFINITION)
- [ ] **GEN-DIRLOC-TS-005**: Generate TypeSystemDirectiveLocation (ARGUMENT_DEFINITION)
- [ ] **GEN-DIRLOC-TS-006**: Generate TypeSystemDirectiveLocation (INTERFACE)
- [ ] **GEN-DIRLOC-TS-007**: Generate TypeSystemDirectiveLocation (UNION)
- [ ] **GEN-DIRLOC-TS-008**: Generate TypeSystemDirectiveLocation (ENUM)
- [ ] **GEN-DIRLOC-TS-009**: Generate TypeSystemDirectiveLocation (ENUM_VALUE)
- [ ] **GEN-DIRLOC-TS-010**: Generate TypeSystemDirectiveLocation (INPUT_OBJECT)
- [ ] **GEN-DIRLOC-TS-011**: Generate TypeSystemDirectiveLocation (INPUT_FIELD_DEFINITION)

**Parser Tests:**
- [ ] **PARSE-DIRLOC-TS-001**: Parse TypeSystemDirectiveLocation (SCHEMA)
- [ ] **PARSE-DIRLOC-TS-002**: Parse TypeSystemDirectiveLocation (SCALAR)
- [ ] **PARSE-DIRLOC-TS-003**: Parse TypeSystemDirectiveLocation (OBJECT)
- [ ] **PARSE-DIRLOC-TS-004**: Parse TypeSystemDirectiveLocation (FIELD_DEFINITION)
- [ ] **PARSE-DIRLOC-TS-005**: Parse TypeSystemDirectiveLocation (ARGUMENT_DEFINITION)
- [ ] **PARSE-DIRLOC-TS-006**: Parse TypeSystemDirectiveLocation (INTERFACE)
- [ ] **PARSE-DIRLOC-TS-007**: Parse TypeSystemDirectiveLocation (UNION)
- [ ] **PARSE-DIRLOC-TS-008**: Parse TypeSystemDirectiveLocation (ENUM)
- [ ] **PARSE-DIRLOC-TS-009**: Parse TypeSystemDirectiveLocation (ENUM_VALUE)
- [ ] **PARSE-DIRLOC-TS-010**: Parse TypeSystemDirectiveLocation (INPUT_OBJECT)
- [ ] **PARSE-DIRLOC-TS-011**: Parse TypeSystemDirectiveLocation (INPUT_FIELD_DEFINITION)
- [ ] **PARSE-DIRLOC-TS-012**: Round-trip: Parse → Generate → Parse (should match)

---

## Configuration Options

### Format Option

**Generator Tests:**
- [ ] **GEN-CONFIG-001**: Generate formatted output (format: true) ✅ **GEN-GSDL-005**
- [ ] **GEN-CONFIG-002**: Generate unformatted output (format: false)
- [ ] **GEN-CONFIG-003**: Generate with custom indentSize
- [ ] **GEN-CONFIG-004**: Format nested structures correctly
- [ ] **GEN-CONFIG-005**: Format FieldsDefinition with proper indentation
- [ ] **GEN-CONFIG-006**: Format ArgumentsDefinition with proper indentation

**Parser Tests:**
- [ ] **PARSE-CONFIG-001**: Parse formatted GraphQL (should preserve structure)
- [ ] **PARSE-CONFIG-002**: Parse unformatted GraphQL (should parse correctly)
- [ ] **PARSE-CONFIG-003**: Parse GraphQL with various whitespace (should normalize)

### IncludeDescriptions Option

**Generator Tests:**
- [ ] **GEN-CONFIG-007**: Include descriptions when includeDescriptions: true ✅ **GEN-GSDL-006**
- [ ] **GEN-CONFIG-008**: Skip descriptions when includeDescriptions: false
- [ ] **GEN-CONFIG-009**: Skip Description in type definitions when false
- [ ] **GEN-CONFIG-010**: Skip Description in field definitions when false
- [ ] **GEN-CONFIG-011**: Skip Description in argument definitions when false

**Parser Tests:**
- [ ] **PARSE-CONFIG-001**: Parse GraphQL with descriptions (should preserve)
- [ ] **PARSE-CONFIG-002**: Parse GraphQL without descriptions (should handle)
- [ ] **PARSE-CONFIG-003**: Parse GraphQL with single-line descriptions
- [ ] **PARSE-CONFIG-004**: Parse GraphQL with block string descriptions

---

## Round-Trip Testing

Round-trip tests verify that parsing and generating are true inverse operations.

### Round-Trip Test Pattern

**Test Pattern:**
1. Parse GraphQL SDL → Grammar
2. Generate GraphQL SDL from Grammar
3. Parse generated GraphQL SDL → Grammar
4. Compare original Grammar with round-trip Grammar (should match semantically)

**Round-Trip Tests:**
- [ ] **ROUNDTRIP-001**: Round-trip simple schema
- [ ] **ROUNDTRIP-002**: Round-trip schema with all type definitions
- [ ] **ROUNDTRIP-003**: Round-trip schema with interfaces
- [ ] **ROUNDTRIP-004**: Round-trip schema with unions
- [ ] **ROUNDTRIP-005**: Round-trip schema with enums
- [ ] **ROUNDTRIP-006**: Round-trip schema with input objects
- [ ] **ROUNDTRIP-007**: Round-trip schema with directives
- [ ] **ROUNDTRIP-008**: Round-trip schema with descriptions
- [ ] **ROUNDTRIP-009**: Round-trip complex nested types
- [ ] **ROUNDTRIP-010**: Round-trip schema with extensions
- [ ] **ROUNDTRIP-011**: Round-trip schema with fragments
- [ ] **ROUNDTRIP-012**: Round-trip schema with variables
- [ ] **ROUNDTRIP-013**: Round-trip schema with arguments
- [ ] **ROUNDTRIP-014**: Round-trip schema with all optional elements

---

## Edge Cases & Complex Scenarios

### Complex Type Definitions

**Generator Tests:**
- [ ] **GEN-EDGE-001**: Generate type with deeply nested ListTypes
- [ ] **GEN-EDGE-002**: Generate type with complex union types
- [ ] **GEN-EDGE-003**: Generate type implementing multiple interfaces
- [ ] **GEN-EDGE-004**: Generate type with all optional elements present
- [ ] **GEN-EDGE-005**: Generate type with no optional elements

**Parser Tests:**
- [ ] **PARSE-EDGE-001**: Parse type with deeply nested ListTypes
- [ ] **PARSE-EDGE-002**: Parse type with complex union types
- [ ] **PARSE-EDGE-003**: Parse type implementing multiple interfaces
- [ ] **PARSE-EDGE-004**: Parse type with all optional elements present
- [ ] **PARSE-EDGE-005**: Parse type with no optional elements
- [ ] **PARSE-EDGE-006**: Round-trip: Parse → Generate → Parse (should match)

### Reference Handling

**Generator Tests:**
- [ ] **GEN-EDGE-006**: Generate referenced types that don't exist (auto-generate minimal)
- [ ] **GEN-EDGE-007**: Generate Query type when missing (auto-add)
- [ ] **GEN-EDGE-008**: Handle circular type references
- [ ] **GEN-EDGE-009**: Handle self-referencing types

**Parser Tests:**
- [ ] **PARSE-EDGE-007**: Parse schema with circular type references
- [ ] **PARSE-EDGE-008**: Parse schema with self-referencing types
- [ ] **PARSE-EDGE-009**: Parse schema with missing type references (should handle gracefully)
- [ ] **PARSE-EDGE-010**: Round-trip: Parse → Generate → Parse (should match)

### Context-Aware Generation

**Generator Tests:**
- [ ] **GEN-EDGE-010**: Generate context-aware field names (camelCase)
- [ ] **GEN-EDGE-011**: Generate context-aware type names (PascalCase)
- [ ] **GEN-EDGE-012**: Generate context-aware placeholder values
- [ ] **GEN-EDGE-013**: Generate context-aware terminal values (StringValue, IntValue, etc.)

**Parser Tests:**
- [ ] **PARSE-EDGE-011**: Parse and preserve field names (camelCase)
- [ ] **PARSE-EDGE-012**: Parse and preserve type names (PascalCase)
- [ ] **PARSE-EDGE-013**: Parse and preserve enum values (UPPERCASE)
- [ ] **PARSE-EDGE-014**: Round-trip: Parse → Generate → Parse (should match)

### Validation & Linting

**Generator Tests:**
- [ ] **GEN-EDGE-014**: All generated GraphQL passes graphql-js validation
- [ ] **GEN-EDGE-015**: All generated GraphQL passes graphql-eslint linting
- [ ] **GEN-EDGE-016**: Generated GraphQL matches expected fixtures semantically
- [ ] **GEN-EDGE-017**: Generated GraphQL is properly formatted

**Parser Tests:**
- [ ] **PARSE-EDGE-015**: Parse valid GraphQL (should succeed)
- [ ] **PARSE-EDGE-016**: Parse invalid GraphQL (should fail gracefully)
- [ ] **PARSE-EDGE-017**: Parse GraphQL with syntax errors (should handle)
- [ ] **PARSE-EDGE-018**: Parse GraphQL with semantic errors (should handle)
- [ ] **PARSE-EDGE-019**: Parsed grammar validates correctly
- [ ] **PARSE-EDGE-020**: Round-trip: Parse → Generate → Parse (should match)

### Empty & Minimal Cases

**Generator Tests:**
- [ ] **GEN-EDGE-018**: Generate empty Document
- [ ] **GEN-EDGE-019**: Generate minimal type definition
- [ ] **GEN-EDGE-020**: Generate type with empty FieldsDefinition
- [ ] **GEN-EDGE-021**: Generate type with empty ArgumentsDefinition

**Parser Tests:**
- [ ] **PARSE-EDGE-021**: Parse empty Document
- [ ] **PARSE-EDGE-022**: Parse minimal type definition
- [ ] **PARSE-EDGE-023**: Parse type with empty FieldsDefinition
- [ ] **PARSE-EDGE-024**: Parse type with empty ArgumentsDefinition
- [ ] **PARSE-EDGE-025**: Round-trip: Parse → Generate → Parse (should match)

### Invalid Input Handling

**Parser Tests:**
- [ ] **PARSE-INVALID-001**: Handle syntax errors gracefully
- [ ] **PARSE-INVALID-002**: Handle missing required elements
- [ ] **PARSE-INVALID-003**: Handle invalid type references
- [ ] **PARSE-INVALID-004**: Handle invalid token sequences
- [ ] **PARSE-INVALID-005**: Handle malformed directives
- [ ] **PARSE-INVALID-006**: Handle malformed fragments
- [ ] **PARSE-INVALID-007**: Handle malformed arguments
- [ ] **PARSE-INVALID-008**: Handle malformed values

---

## Test Statistics

**Total Tests Planned**: ~500+  
**Generator Tests**: ~250+  
**Parser Tests**: ~250+  
**Round-Trip Tests**: ~14  
**Tests Passed**: 6 (Generator)  
**Tests Pending**: ~494+  
**Completion**: ~1.2%

### Tests by Category

| Category | Generator Planned | Generator Passed | Parser Planned | Parser Passed | Total |
|----------|------------------|------------------|----------------|---------------|-------|
| Lexical Tokens | ~30 | 0 | ~35 | 0 | ~65 |
| Document Syntax | ~10 | 0 | ~12 | 0 | ~22 |
| Operations | ~15 | 0 | ~18 | 0 | ~33 |
| Selection Sets | ~10 | 0 | ~12 | 0 | ~22 |
| Fields | ~15 | 0 | ~18 | 0 | ~33 |
| Arguments | ~20 | 0 | ~24 | 0 | ~44 |
| Fragments | ~15 | 0 | ~18 | 0 | ~33 |
| Input Values | ~25 | 0 | ~30 | 0 | ~55 |
| Variables | ~10 | 0 | ~12 | 0 | ~22 |
| Type References | ~15 | 0 | ~18 | 0 | ~33 |
| Directives | ~15 | 0 | ~18 | 0 | ~33 |
| Type System | ~5 | 0 | ~6 | 0 | ~11 |
| Schema | ~10 | 1 | ~12 | 0 | ~22 |
| Scalars | ~5 | 1 | ~6 | 0 | ~11 |
| Objects | ~20 | 1 | ~24 | 0 | ~44 |
| Interfaces | ~10 | 1 | ~12 | 0 | ~22 |
| Unions | ~15 | 0 | ~18 | 0 | ~33 |
| Enums | ~15 | 0 | ~18 | 0 | ~33 |
| Input Objects | ~10 | 0 | ~12 | 0 | ~22 |
| Directive Definitions | ~20 | 0 | ~24 | 0 | ~44 |
| Configuration | ~11 | 2 | ~8 | 0 | ~19 |
| Edge Cases | ~21 | 0 | ~30 | 0 | ~51 |
| Round-Trip | ~0 | 0 | ~14 | 0 | ~14 |
| Invalid Input | ~0 | 0 | ~8 | 0 | ~8 |

---

## Implementation Notes

### Test ID Format

**Generator Tests:**
- **Format**: `GEN-{CATEGORY}-{NUMBER}`
- **Categories**: Use abbreviated grammar element names (e.g., `SCHEMA`, `OBJECT`, `INTERFACE`)
- **Numbers**: Sequential within each category (001, 002, etc.)

**Parser Tests:**
- **Format**: `PARSE-{CATEGORY}-{NUMBER}`
- **Categories**: Use abbreviated grammar element names (e.g., `SCHEMA`, `OBJECT`, `INTERFACE`)
- **Numbers**: Sequential within each category (001, 002, etc.)

**Round-Trip Tests:**
- **Format**: `ROUNDTRIP-{NUMBER}`
- **Numbers**: Sequential (001, 002, etc.)

### Test Requirements

1. **Generator Tests:**
   - All tests must validate generated GraphQL using `graphql-js`
   - All tests must lint generated GraphQL using `graphql-eslint`
   - All tests must compare output against expected fixtures semantically
   - All tests must use the test reporting system (`initTestReport`, `reportTestPassed`, `reportTestFailed`)
   - All tests must have unique test IDs registered in `tests/helpers/test-ids.ts`

2. **Parser Tests:**
   - All tests must validate parsed grammar structure
   - All parsed grammars that generate GraphQL must be validated and linted
   - All tests must use the test reporting system (`initTestReport`, `reportTestPassed`, `reportTestFailed`)
   - All tests must have unique test IDs registered in `tests/helpers/test-ids.ts`
   - Round-trip tests should verify Parse → Generate → Parse produces semantically equivalent grammar

3. **Round-Trip Tests:**
   - Verify that Parse → Generate → Parse produces semantically equivalent grammar
   - Compare grammar structures semantically (not just string equality)
   - Handle formatting differences appropriately

### Test Organization

- Tests are organized by grammar section matching `src/grammar.ts`
- Each grammar element should have tests for:
  - Basic generation/parsing
  - With optional elements
  - With all elements
  - Edge cases
  - Formatting variations (generator)
  - Invalid input handling (parser)
  - Round-trip verification (parser)

### Updating Test Status

- Mark tests as ✅ PASSED when implemented and passing
- Mark tests as ⏳ PENDING when planned but not implemented
- Mark tests as ❌ FAILED when implemented but failing
- Update test statistics after marking tests
- Cross-reference related tests (e.g., GEN-GSDL-001 → GEN-SCHEMA-001)

---

## Related Documentation

- [GraphQL Grammar Specification](../src/grammar.ts) - Complete grammar definition
- [GraphQL SDL Generator](../src/plugins/generators/graphql-sdl.ts) - Generator implementation
- [GraphQL SDL Parser](../src/plugins/parsers/graphql-sdl.ts) - Parser implementation
- [Test Suite](../tests/generators/graphql-sdl.test.ts) - Generator test implementations
- [Parser Test Suite](../tests/parsers/graphql-sdl.test.ts) - Parser test implementations
- [Test Helpers](../tests/helpers/) - Test utilities and helpers
- [Transformer Use Cases](./transformer-use-cases.md) - Related transformer documentation

