---
date: "2026-09-03"
title: "Leveraging Graphql types in your Shopfiy projects"
authors:
  - Tanner Legasse
draft: false
tags: ["tag"]
# series: "series"
categories: "Shopify"
---

# Introduction

Software isn't always a clean cut, predictable input to output pipeline. Yes, type systems get us part the way there, but configuring applications to leverage flexible types from an external system is often an underappreciated, important, task. For instance; it's often the case that, when working with external systems, the onus is on us to make sure the data is prepared in a way that's easy to transmit, but the moment we start sending data, we own the relationship between the two systems. Is the data I'm providing accurate to types THEY know about? When I'm preparing the request payload, how can I ensure that my data is rolling up to something that will be usable? If I'm not sure about which data I'm querying at runtime, how can I create an internal contract within my software that expresses the relationship accurately?

# GraphQL

I come from a PHP framework background, and my career started somewhere between Simple Object Access Protocol (SOAP) and Representational State Transfer's (REST) popularity. Yes, we had tools, and SOAP did go a long way to providing schema contract information, but to cut to the point, we didn't have the luxury of leveraging GraphQL ease of use to implement requests instead. When contrasting the different API systems, the types of problem you'll encounter start pointing to some key features. SOAP uses an XML schema description, provided in a document ending in \`.wsdl\` (Web Services Description Language), and GraphQL's JSON type system provide different shapes of the same data through introspection. Both offer an answer to the same question; how do we keep ingress honest?

GraphQL introspection provides some really powerful tools through special request patterns. Below you'll find some important ones, note that they all begin with double underscore:

| Keyword | Description |
|----|----|
| \_\_schema | Query GraphQL for details related to the type system |
| \_\_type | Request for details related to the shape of a type |
| \_\_field | Request for details related to the shape of fields |
| \_\_inputValue | Request for details related expected query input information |

There are many more, but the key is that…

> Introspection is a useful feature of GraphQL, especially for client developers and tooling. However, for APIs intended only for your own applications, it’s typically not needed in production. [[1](https://graphql.org/learn/introspection/)]

# Employing types into your application

Alright, we know about querying data, and we understand that type safety is essential, but… Wait, what does "not needed in production" mean?! Typically, types are leveraged throughout the application, and all paths through the application are accounted for during development. The idea is that by the time the runtime code is being evaluated, there can be no type "leaking", and you're set. But we do need to take some steps before we're able to fully leverage types in our code. After all, we're in the business of getting stuff done, not manually walking through GraphQL. Let's look at a package that may be able to help us.

## Codegen, a GraphQL type extractor

As we were able to see, manual management of types is cumbersome, but a tool called Codegen can help us:

> GraphQL Code Generator is a plugin-based tool that helps you get the best out of your GraphQL stack. [[2](https://the-guild.dev/graphql/codegen/docs/getting-started)]

> Manually maintaining the GraphQL operation types or the complete absence of types can lead to many issues… automating and generating the typing of your GraphQL operations will both improve the developer experience and stability of your stack. [[2](https://the-guild.dev/graphql/codegen/docs/getting-started)]

From the example, setting up the generator is easy:

``` javascript
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://localhost:4000/graphql',
  documents: ['src/**/*.tsx'],
  generates: {
      './src/gql/': {
        preset: 'client',
      }
  }
}
export default config
```

## Shopfiy codegen

There's loads of plugins and presets available with the codegen package, but in the case of Shopify development, the pattern of implementation is mostly known, and whether you're interested in front or back-end development, the Shopify codegen package offers some serious conveniencs:

> This package enables JavaScript / TypeScript apps to use a \`#graphql\` tag to parse queries with \[\`graphql-codegen\`\](<https://the-guild.dev/graphql/codegen>). [[3](https://www.npmjs.com/package/@shopify/api-codegen-preset)]

This means that beyond the ease of having types, they are compiled as a result of local code analysis, and have the full feature set of codegen in-build.

# An example usecase

What problems does this tangibly solve? Sometimes you're accessing data flexibly, and you may encounter situations where you're looking at part of an implementation. JavaScript gives us a few important primitives (number, array, object, null), but having validated, static, data structures to reference at dev time can make a difference that accounts for classes of bugs. For instance:

I want to access data about a product. I'm working between front and back-end systems to reference data flexibly, which means that field references have to come from strings. In the case of product data, we have something like this:

``` json
{
  related_product_ids: [
    1,
    2
  ]
  variants: [
    {
      price: 1.20
    },
    {
      price: 2.30
    }
  ]
}
```

Take the following field reference pattern: \`variants.price\`. If you traversed the object and returned the variants' price items, you may end up with something like so:

``` json
[
  1.20,
  2.30
]
```

But the moment you have to access an array directly… the data looks the same… Given \`related<sub>product</sub>\_ids\`, you'll see:

``` json
[
  1,
  2
]
```

When using the data for further evaluation, or maybe you want to leverage it to perform the same kinds of operations on the original object (such as a price increase algorithm), all of a sudden, it's not clear if the original source was a flat array, or an array of references. Knowing if you're looking at an end data node's return makes it necessary to either pass back information about the data being a leaf node, or you can simply use types!

By knowing that the original source is a \`list\` type, we don't have to keep track of if there were array traversals up the chain, or if the end node was previously identified as an \`Array.isArray()\`. While this solution is pretty specific to how the data is leveraged in this case, it's worth noting that the open nature of Software is such that these kinds of "shape not known" bugs happen all over the place, and having dev time data about what's on the other side, much like SOAP's WSDL files, heads off the confusion early.

------------------------------------------------------------------------

# References

1.  “Introspection \| GraphQL.” Accessed: Sep. 03, 2026. \[Online\]. Available: [link](https://graphql.org/learn/introspection/)
2.  “Introduction (GraphQL-codegen).” Accessed: Sep. 03, 2026. \[Online\]. Available: [link](https://the-guild.dev/graphql/codegen/docs/getting-started)
3.  “@Shopify/api-codegen-preset.” Accessed: Sep. 03, 2026. \[Online\]. Available: [link](https://www.npmjs.com/package/@shopify/api-codegen-preset)
