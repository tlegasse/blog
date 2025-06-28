---
date: 2025-05-03
authors:
  - Tanner Legasse
title: Manual Shopify App Authentication
draft: false
tags: ["shopify"]
series: Shopify App Smithing
categories: Shopify
---

Welcome! This is the first of many blog posts covering Shopify application development that will be published here. You'll follow me through the project agnostic portions of app build I'm working through. You'll see a production ready app from concept and setup to go-live.

If you follow along with this series, you'll see various components take shape, code examples, and a general rundown of why I'm making architectural decisions. Here's something I probably don't need to tell you; __I'm not perfect. I also don't pretend to be!__ So don't expect brilliant code that stands up against every possible use case and every setting. Expect working code that serves as a foundation for fun experiments, *lots* of learning, and real, working apps. In a lot of cases, I'll be encountering problems and matching them to solutions for the first time ever!

Before we proceed, you may be wondering... Why does this article cover manual implementation in this context? Simple! Life is complex and we won't always be using the Shopify CLI (as nice as it clearly is) to build apps. Authentication is also a really interesting process to understand, and can be pretty daunting the way it's described across the internet. I'll be leveraging NextJS for these articles, but if you don't, beyond the platform specific articles to follow (data validation with Zod? Prisma ORM? Who knows!), you should expect that you can use these guides as a conceptual exercise to get you going.

Let's kick this baby into gear, shall we?

---
# About Authentication
Authentication is the process of validating a connection between services. What's the distribution of responsibility in this process?

## We need to protect our users...
... by ensuring a that what's calling us is as they say they are, the Shopify authentication platform.

To do this, we'll give Shopify a special link to call with several `GET` parameters. The important part of this is that we pull out the [`HMAC`](https://en.m.wikipedia.org/wiki/HMAC) header value and put the rest back together alphabetically as one contiguous string, hash that string, and ensure that the `HMAC` value that Shopify provided matches the `HMAC` value that we independently calculated ourselves.

We'll also be storing a per-authentication string that we define. This is called provided back to us in the `nonce` parameter as we get access to Shopify, so bear this in mind.

## Shopify needs to protect their users...
... by proving proof that we, as the app vendor, are who we say we are.

In order to unlock the front door to the Shopify palace, we'll need a key, naturally. In order to do this, we need the user to grant this key to us, after all, we need to know our guests _and know what they'll be up to!_ To tell Shopify what we'll be doing, we provide a comma separated list of scopes. Depending on the features we want in our app, we may either authenticate store-wide, or on a per-user basis.

After we run through this request pattern and the user says that we deserve the access that we asked for, we check to make sure that `nonce` is the same as before for this authentication event and use a special validation token that's provided back to us to get the *golden key*, our access token!
