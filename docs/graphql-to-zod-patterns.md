# GraphQL to Zod Schema Translation Guide

This guide demonstrates how to translate common GraphQL patterns into Zod GraphQL schemas using the grammar-based approach.

## Table of Contents

1. [Basic Types](#basic-types)
2. [Object Types](#object-types)
3. [Scalar Types](#scalar-types)
4. [Enum Types](#enum-types)
5. [Input Types](#input-types)
6. [Union Types](#union-types)
7. [Interface Types](#interface-types)
8. [Lists and Non-Null](#lists-and-non-null)
9. [Directives](#directives)
10. [Queries and Mutations](#queries-and-mutations)
11. [Fragments](#fragments)
12. [Variables](#variables)

## Basic Types

### GraphQL SDL

```graphql
type User {
  id: ID!
  name: String!
  email: String
}
```

### Zod Grammar Representation

```typescript
import { T, NT, Seq, Opt, Lst } from "./grammar";

const UserTypeDefinition = {
  name: "UserTypeDefinition",
  definition: Seq(
    T("type"),
    NT("Name"), // "User"
    Opt(NT("ImplementsInterfaces")),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("BraceL"),
      Lst(
        Seq(
          Opt(NT("Description")),
          NT("Name"), // "id"
          Opt(NT("ArgumentsDefinition")),
          NT("Colon"),
          NT("Type"), // ID!
          Opt(NT("DirectivesConst"))
        )
      ),
      NT("BraceR")
    )
  ),
};
```

## Object Types

### GraphQL SDL

```graphql
type Post {
  id: ID!
  title: String!
  content: String
  author: User!
  tags: [String!]!
  createdAt: DateTime!
}
```

### Zod Grammar Representation

```typescript
const PostTypeDefinition = {
  name: "PostTypeDefinition",
  definition: Seq(
    Opt(NT("Description")),
    T("type"),
    T("Post"),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("BraceL"),
      Lst(
        // id: ID!
        Seq(
          T("id"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")) // ID!
        ),
        // title: String!
        Seq(
          T("title"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")) // String!
        ),
        // content: String
        Seq(
          T("content"),
          NT("Colon"),
          NT("NamedType") // String
        ),
        // author: User!
        Seq(
          T("author"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")) // User!
        ),
        // tags: [String!]!
        Seq(
          T("tags"),
          NT("Colon"),
          Seq(
            Seq(
              NT("BracketL"),
              Seq(NT("NamedType"), NT("Bang")),
              NT("BracketR")
            ), // [String!]
            NT("Bang") // !
          )
        ),
        // createdAt: DateTime!
        Seq(
          T("createdAt"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")) // DateTime!
        )
      ),
      NT("BraceR")
    )
  ),
};
```

## Scalar Types

### GraphQL SDL

```graphql
scalar DateTime
scalar JSON
scalar Email
```

### Zod Grammar Representation

```typescript
const DateTimeScalar = {
  name: "DateTimeScalar",
  definition: Seq(
    Opt(NT("Description")),
    T("scalar"),
    T("DateTime"),
    Opt(NT("DirectivesConst"))
  ),
};

const JSONScalar = {
  name: "JSONScalar",
  definition: Seq(
    Opt(NT("Description")),
    T("scalar"),
    T("JSON"),
    Opt(NT("DirectivesConst"))
  ),
};

const EmailScalar = {
  name: "EmailScalar",
  definition: Seq(
    Opt(NT("Description")),
    T("scalar"),
    T("Email"),
    Opt(NT("DirectivesConst"))
  ),
};
```

## Enum Types

### GraphQL SDL

```graphql
enum UserRole {
  ADMIN
  USER
  GUEST
}
```

### Zod Grammar Representation

```typescript
const UserRoleEnum = {
  name: "UserRoleEnum",
  definition: Seq(
    Opt(NT("Description")),
    T("enum"),
    T("UserRole"),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("BraceL"),
      Lst(
        Seq(Opt(NT("Description")), T("ADMIN"), Opt(NT("DirectivesConst"))),
        Seq(Opt(NT("Description")), T("USER"), Opt(NT("DirectivesConst"))),
        Seq(Opt(NT("Description")), T("GUEST"), Opt(NT("DirectivesConst")))
      ),
      NT("BraceR")
    )
  ),
};
```

## Input Types

### GraphQL SDL

```graphql
input CreateUserInput {
  name: String!
  email: String!
  role: UserRole = USER
}
```

### Zod Grammar Representation

```typescript
const CreateUserInput = {
  name: "CreateUserInput",
  definition: Seq(
    Opt(NT("Description")),
    T("input"),
    T("CreateUserInput"),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("BraceL"),
      Lst(
        // name: String!
        Seq(
          Opt(NT("Description")),
          T("name"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")), // String!
          Opt(NT("DefaultValue")),
          Opt(NT("DirectivesConst"))
        ),
        // email: String!
        Seq(
          Opt(NT("Description")),
          T("email"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")), // String!
          Opt(NT("DefaultValue")),
          Opt(NT("DirectivesConst"))
        ),
        // role: UserRole = USER
        Seq(
          Opt(NT("Description")),
          T("role"),
          NT("Colon"),
          NT("NamedType"), // UserRole
          Seq(NT("Equals"), NT("EnumValue")), // = USER
          Opt(NT("DirectivesConst"))
        )
      ),
      NT("BraceR")
    )
  ),
};
```

## Union Types

### GraphQL SDL

```graphql
union SearchResult = User | Post | Comment
```

### Zod Grammar Representation

```typescript
const SearchResultUnion = {
  name: "SearchResultUnion",
  definition: Seq(
    Opt(NT("Description")),
    T("union"),
    T("SearchResult"),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("Equals"),
      Opt(NT("Pipe")),
      NT("NamedType"), // User
      Lst(Seq(NT("Pipe"), NT("NamedType"))) // | Post | Comment
    )
  ),
};
```

## Interface Types

### GraphQL SDL

```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}
```

### Zod Grammar Representation

```typescript
const NodeInterface = {
  name: "NodeInterface",
  definition: Seq(
    Opt(NT("Description")),
    T("interface"),
    T("Node"),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("BraceL"),
      Lst(
        Seq(
          Opt(NT("Description")),
          T("id"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")) // ID!
        )
      ),
      NT("BraceR")
    )
  ),
};

const UserImplementsNode = {
  name: "UserImplementsNode",
  definition: Seq(
    Opt(NT("Description")),
    T("type"),
    T("User"),
    Seq(
      T("implements"),
      Opt(NT("Ampersand")),
      NT("NamedType") // Node
    ),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("BraceL"),
      Lst(
        Seq(
          Opt(NT("Description")),
          T("id"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")) // ID!
        ),
        Seq(
          Opt(NT("Description")),
          T("name"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")) // String!
        )
      ),
      NT("BraceR")
    )
  ),
};
```

## Lists and Non-Null

### GraphQL SDL Patterns

```graphql
# Non-null scalar
id: ID!

# List of scalars
tags: [String]

# Non-null list
tags: [String]!

# List of non-null scalars
tags: [String!]

# Non-null list of non-null scalars
tags: [String!]!
```

### Zod Grammar Representation

```typescript
// ID! - Non-null scalar
const NonNullID = Seq(NT("NamedType"), NT("Bang"));

// [String] - List of scalars
const ListOfString = Seq(NT("BracketL"), NT("NamedType"), NT("BracketR"));

// [String]! - Non-null list
const NonNullList = Seq(
  Seq(NT("BracketL"), NT("NamedType"), NT("BracketR")),
  NT("Bang")
);

// [String!] - List of non-null scalars
const ListOfNonNull = Seq(
  NT("BracketL"),
  Seq(NT("NamedType"), NT("Bang")), // String!
  NT("BracketR")
);

// [String!]! - Non-null list of non-null scalars
const NonNullListOfNonNull = Seq(
  Seq(
    NT("BracketL"),
    Seq(NT("NamedType"), NT("Bang")), // String!
    NT("BracketR")
  ),
  NT("Bang")
);
```

## Directives

### GraphQL SDL

```graphql
type User {
  id: ID! @deprecated(reason: "Use userId instead")
  name: String!
  email: String! @auth(requires: ADMIN)
}

directive @auth(requires: Role!) on FIELD_DEFINITION
```

### Zod Grammar Representation

```typescript
const UserWithDirectives = {
  name: "UserWithDirectives",
  definition: Seq(
    T("type"),
    T("User"),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("BraceL"),
      Lst(
        // id: ID! @deprecated(reason: "Use userId instead")
        Seq(
          Opt(NT("Description")),
          T("id"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")), // ID!
          Seq(
            NT("At"),
            T("deprecated"),
            Seq(
              NT("ParenL"),
              Lst(
                Seq(
                  T("reason"),
                  NT("Colon"),
                  NT("StringValue") // "Use userId instead"
                )
              ),
              NT("ParenR")
            )
          )
        ),
        // email: String! @auth(requires: ADMIN)
        Seq(
          Opt(NT("Description")),
          T("email"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")), // String!
          Seq(
            NT("At"),
            T("auth"),
            Seq(
              NT("ParenL"),
              Lst(
                Seq(
                  T("requires"),
                  NT("Colon"),
                  NT("EnumValue") // ADMIN
                )
              ),
              NT("ParenR")
            )
          )
        )
      ),
      NT("BraceR")
    )
  ),
};

const AuthDirectiveDefinition = {
  name: "AuthDirectiveDefinition",
  definition: Seq(
    Opt(NT("Description")),
    T("directive"),
    T("@"),
    T("auth"),
    Seq(
      NT("ParenL"),
      Lst(
        Seq(
          Opt(NT("Description")),
          T("requires"),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")), // Role!
          Opt(NT("DefaultValue")),
          Opt(NT("DirectivesConst"))
        )
      ),
      NT("ParenR")
    ),
    Opt(T("repeatable")),
    T("on"),
    NT("DirectiveLocations") // FIELD_DEFINITION
  ),
};
```

## Queries and Mutations

### GraphQL SDL

```graphql
type Query {
  user(id: ID!): User
  users(limit: Int = 10): [User!]!
  search(query: String!): [SearchResult!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

### Zod Grammar Representation

```typescript
const QueryType = {
  name: "QueryType",
  definition: Seq(
    T("type"),
    T("Query"),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("BraceL"),
      Lst(
        // user(id: ID!): User
        Seq(
          Opt(NT("Description")),
          T("user"),
          Seq(
            NT("ParenL"),
            Lst(
              Seq(
                Opt(NT("Description")),
                T("id"),
                NT("Colon"),
                Seq(NT("NamedType"), NT("Bang")), // ID!
                Opt(NT("DefaultValue")),
                Opt(NT("DirectivesConst"))
              )
            ),
            NT("ParenR")
          ),
          NT("Colon"),
          NT("NamedType"), // User
          Opt(NT("DirectivesConst"))
        ),
        // users(limit: Int = 10): [User!]!
        Seq(
          Opt(NT("Description")),
          T("users"),
          Seq(
            NT("ParenL"),
            Lst(
              Seq(
                Opt(NT("Description")),
                T("limit"),
                NT("Colon"),
                NT("NamedType"), // Int
                Seq(NT("Equals"), NT("IntValue")), // = 10
                Opt(NT("DirectivesConst"))
              )
            ),
            NT("ParenR")
          ),
          NT("Colon"),
          Seq(
            Seq(
              NT("BracketL"),
              Seq(NT("NamedType"), NT("Bang")), // User!
              NT("BracketR")
            ),
            NT("Bang") // !
          ),
          Opt(NT("DirectivesConst"))
        )
      ),
      NT("BraceR")
    )
  ),
};

const MutationType = {
  name: "MutationType",
  definition: Seq(
    T("type"),
    T("Mutation"),
    Opt(NT("DirectivesConst")),
    Seq(
      NT("BraceL"),
      Lst(
        // createUser(input: CreateUserInput!): User!
        Seq(
          Opt(NT("Description")),
          T("createUser"),
          Seq(
            NT("ParenL"),
            Lst(
              Seq(
                Opt(NT("Description")),
                T("input"),
                NT("Colon"),
                Seq(NT("NamedType"), NT("Bang")), // CreateUserInput!
                Opt(NT("DefaultValue")),
                Opt(NT("DirectivesConst"))
              )
            ),
            NT("ParenR")
          ),
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")), // User!
          Opt(NT("DirectivesConst"))
        )
      ),
      NT("BraceR")
    )
  ),
};
```

## Fragments

### GraphQL SDL

```graphql
fragment UserFields on User {
  id
  name
  email
}

query {
  user(id: "1") {
    ...UserFields
    posts {
      title
    }
  }
}
```

### Zod Grammar Representation

```typescript
const UserFieldsFragment = {
  name: "UserFieldsFragment",
  definition: Seq(
    Opt(NT("Description")),
    T("fragment"),
    T("UserFields"),
    Seq(T("on"), NT("NamedType")), // on User
    Opt(NT("Directives")),
    Seq(
      NT("BraceL"),
      Lst(
        Seq(
          Opt(NT("Alias")),
          T("id"),
          Opt(NT("Arguments")),
          Opt(NT("Directives")),
          Opt(NT("SelectionSet"))
        ),
        Seq(
          Opt(NT("Alias")),
          T("name"),
          Opt(NT("Arguments")),
          Opt(NT("Directives")),
          Opt(NT("SelectionSet"))
        ),
        Seq(
          Opt(NT("Alias")),
          T("email"),
          Opt(NT("Arguments")),
          Opt(NT("Directives")),
          Opt(NT("SelectionSet"))
        )
      ),
      NT("BraceR")
    )
  ),
};

const QueryWithFragment = {
  name: "QueryWithFragment",
  definition: Seq(
    Opt(NT("Description")),
    T("query"),
    Opt(NT("Name")),
    Opt(NT("VariablesDefinition")),
    Opt(NT("Directives")),
    Seq(
      NT("BraceL"),
      Lst(
        Seq(
          Opt(NT("Alias")),
          T("user"),
          Seq(
            NT("ParenL"),
            Lst(
              Seq(
                T("id"),
                NT("Colon"),
                NT("StringValue") // "1"
              )
            ),
            NT("ParenR")
          ),
          Opt(NT("Directives")),
          Seq(
            NT("BraceL"),
            Lst(
              // ...UserFields
              Seq(NT("Spread"), T("UserFields"), Opt(NT("Directives"))),
              // posts { title }
              Seq(
                Opt(NT("Alias")),
                T("posts"),
                Opt(NT("Arguments")),
                Opt(NT("Directives")),
                Seq(
                  NT("BraceL"),
                  Lst(
                    Seq(
                      Opt(NT("Alias")),
                      T("title"),
                      Opt(NT("Arguments")),
                      Opt(NT("Directives")),
                      Opt(NT("SelectionSet"))
                    )
                  ),
                  NT("BraceR")
                )
              )
            ),
            NT("BraceR")
          )
        )
      ),
      NT("BraceR")
    )
  ),
};
```

## Variables

### GraphQL SDL

```graphql
query GetUser($id: ID!, $includePosts: Boolean = false) {
  user(id: $id) {
    id
    name
    posts @include(if: $includePosts) {
      title
    }
  }
}
```

### Zod Grammar Representation

```typescript
const QueryWithVariables = {
  name: "QueryWithVariables",
  definition: Seq(
    Opt(NT("Description")),
    T("query"),
    T("GetUser"),
    Seq(
      NT("ParenL"),
      Lst(
        // $id: ID!
        Seq(
          Opt(NT("Description")),
          Seq(NT("Dollar"), T("id")), // $id
          NT("Colon"),
          Seq(NT("NamedType"), NT("Bang")), // ID!
          Opt(NT("DefaultValue")),
          Opt(NT("DirectivesConst"))
        ),
        // $includePosts: Boolean = false
        Seq(
          Opt(NT("Description")),
          Seq(NT("Dollar"), T("includePosts")), // $includePosts
          NT("Colon"),
          NT("NamedType"), // Boolean
          Seq(NT("Equals"), NT("BooleanValue")), // = false
          Opt(NT("DirectivesConst"))
        )
      ),
      NT("ParenR")
    ),
    Opt(NT("Directives")),
    Seq(
      NT("BraceL"),
      Lst(
        Seq(
          Opt(NT("Alias")),
          T("user"),
          Seq(
            NT("ParenL"),
            Lst(
              Seq(
                T("id"),
                NT("Colon"),
                Seq(NT("Dollar"), T("id")) // $id
              )
            ),
            NT("ParenR")
          ),
          Opt(NT("Directives")),
          Seq(
            NT("BraceL"),
            Lst(
              Seq(
                Opt(NT("Alias")),
                T("id"),
                Opt(NT("Arguments")),
                Opt(NT("Directives")),
                Opt(NT("SelectionSet"))
              ),
              Seq(
                Opt(NT("Alias")),
                T("name"),
                Opt(NT("Arguments")),
                Opt(NT("Directives")),
                Opt(NT("SelectionSet"))
              ),
              Seq(
                Opt(NT("Alias")),
                T("posts"),
                Opt(NT("Arguments")),
                Seq(
                  NT("At"),
                  T("include"),
                  Seq(
                    NT("ParenL"),
                    Lst(
                      Seq(
                        T("if"),
                        NT("Colon"),
                        Seq(NT("Dollar"), T("includePosts")) // $includePosts
                      )
                    ),
                    NT("ParenR")
                  )
                ),
                Seq(
                  NT("BraceL"),
                  Lst(
                    Seq(
                      Opt(NT("Alias")),
                      T("title"),
                      Opt(NT("Arguments")),
                      Opt(NT("Directives")),
                      Opt(NT("SelectionSet"))
                    )
                  ),
                  NT("BraceR")
                )
              )
            ),
            NT("BraceR")
          )
        )
      ),
      NT("BraceR")
    )
  ),
};
```

## Complete Example: Blog Schema

### GraphQL SDL

```graphql
type Query {
  posts(limit: Int = 10): [Post!]!
  post(id: ID!): Post
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
  tags: [String!]!
  publishedAt: DateTime!
}

input CreatePostInput {
  title: String!
  content: String
  tags: [String!]!
}

scalar DateTime

type User {
  id: ID!
  name: String!
  email: String!
}
```

### Complete Zod Grammar

```typescript
import { GraphQLGrammar } from "./grammar";

const BlogSchema: Grammar = {
  root: "Document",
  rules: {
    // Query type
    Query: {
      name: "Query",
      definition: Seq(
        T("type"),
        T("Query"),
        Seq(
          NT("BraceL"),
          Lst(
            // posts(limit: Int = 10): [Post!]!
            Seq(
              T("posts"),
              Seq(
                NT("ParenL"),
                Lst(
                  Seq(
                    T("limit"),
                    NT("Colon"),
                    NT("NamedType"), // Int
                    Seq(NT("Equals"), NT("IntValue")), // = 10
                    Opt(NT("DirectivesConst"))
                  )
                ),
                NT("ParenR")
              ),
              NT("Colon"),
              Seq(
                Seq(
                  NT("BracketL"),
                  Seq(NT("NamedType"), NT("Bang")), // Post!
                  NT("BracketR")
                ),
                NT("Bang") // !
              )
            ),
            // post(id: ID!): Post
            Seq(
              T("post"),
              Seq(
                NT("ParenL"),
                Lst(
                  Seq(
                    T("id"),
                    NT("Colon"),
                    Seq(NT("NamedType"), NT("Bang")), // ID!
                    Opt(NT("DirectivesConst"))
                  )
                ),
                NT("ParenR")
              ),
              NT("Colon"),
              NT("NamedType") // Post
            )
          ),
          NT("BraceR")
        )
      ),
    },
    // Post type
    Post: {
      name: "Post",
      definition: Seq(
        T("type"),
        T("Post"),
        Seq(
          NT("BraceL"),
          Lst(
            Seq(T("id"), NT("Colon"), Seq(NT("NamedType"), NT("Bang"))),
            Seq(T("title"), NT("Colon"), Seq(NT("NamedType"), NT("Bang"))),
            Seq(T("content"), NT("Colon"), NT("NamedType")),
            Seq(T("author"), NT("Colon"), Seq(NT("NamedType"), NT("Bang"))),
            Seq(
              T("tags"),
              NT("Colon"),
              Seq(
                Seq(
                  NT("BracketL"),
                  Seq(NT("NamedType"), NT("Bang")),
                  NT("BracketR")
                ),
                NT("Bang")
              )
            ),
            Seq(T("publishedAt"), NT("Colon"), Seq(NT("NamedType"), NT("Bang")))
          ),
          NT("BraceR")
        )
      ),
    },
    // ... other type definitions
  },
};
```

## Best Practices

1. **Use Helper Functions**: Leverage the `T()`, `NT()`, `Seq()`, `Opt()`, `Lst()`, and `Or()` helper functions for cleaner code.

2. **Validate with Zod**: Always validate your grammar structure using the Zod schemas before using it.

3. **Use Transformers**: Apply transformers like `normalize` and `simplify` to clean up your grammar.

4. **Generate Output**: Use generators to produce GraphQL SDL, TypeScript types, or JSON from your grammar.

5. **Type Safety**: The grammar structure is fully typed, ensuring compile-time safety.

## Next Steps

- See [Plugin Architecture](../src/plugins/README.md) for using transformers and generators
- Check [Grammar Validation](../tests/grammar.test.ts) for validation examples
- Explore [Built-in Plugins](../src/plugins/) for available transformers and generators
