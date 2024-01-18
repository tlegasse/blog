---
date: 2024-01-17
authors:
  - Tanner Legasse
title: Go URL Shortener
draft: false
tags: ["project"]
series: 
cover:
  image: images/go-url-redirect-post.webp
---
# Introduction
It's 3AM. You need a URL shortener fast. Your boss is breathing down your neck and you have no idea what to do. My new URL shortener is *exactly* what you need. Okay, kidding aside, this thing isn't geared toward production environments with high throughput or anything like that. Instead, the goal was to showcase skills that I've picked up over the past several months in my learning journey with Go. It's been really fun, and this project fit the bill of "complex enough to be interesting, not so complex that you program yourself into a hole". The latter will come shortly, but for now I'm really pleased with how everything's come out.

**Note: This code is still evolving, it may change over the next several weeks**


# Features
The URL shortener only has 2 routes for now, one capturing `GET` requests for the shortening process, and a dynamic path for long-ening the path again. That's it. Really. BUT there were so many amazing things that this project exposed me to. My previous Go projects were Leetcode problems, so I was missing on a lot of the project-level learnings.

## Things learned
Implementing this functionality was a treat. It exposed me to some common patterns and enabled me to learn about the ins and outs, and infrastructure of Go projects. Check out some of my favorite discoveries below.

### Testing
Unit testing admittedly isn't every agency or company's top priority, and I have had some ground to make up. Now, in every project I embark on, I aim to provide thoroughly tested code. In this case, I was exposed to database and HTTP server mocking, test fixtures and more. I found the workflow to be intuitive and very helpful in rounding out my chosen feature set.

### HTTP Server
While the batteries included approach to the Golang standard library means that it comes with a competent and simple HTTP server, it wasn't a mistake that I chose to work with it. I wanted to ensure that my plans of picking up API related tooling experience was in focus during this project.


## Challenges

### Embedding:
This is the big one, and seems to fly under the radar in terms of what Go developers are exposed to first. But first, what problem will the embedding pattern solve? In short, when you're running unit tests, the execution directory, and packages compiled into the binary are different than when you're running your program normally. You might be able to leverage relative pathing fairly easily when your code is running from the top level directory. When you're testing though... ooh momma... the filesystem context changes drastically. In the code below, you can see how I'm leveraging the `embed` package to compile the SQL statements needed to spin up my database table *directly into the binary*. Now, there are many approaches to solving this problem, and embedding files can definitely be a mistake, but in this case it was just what the doctor ordered.

First, import the sucker.
```golang
import (
  ...
  "embed"
  ...
)
```

Using the `go:embed` directive, we then specify a pattern to match to the local filesystem, and initialize a variable with the 
```golang
//go:embed schema.sql
var schemaFS embed.FS
```

And then we can use the embedded file just like we would with a normal file!
```golang
content, err := schemaFS.ReadFile("schema.sql")
```


### Understanding the data flow
I will admit, dependency injection is an extremely important software design pattern as it allows for a the kind of modularity that makes huge successful projects a possibility, but it can cause issues if you're a beginner exploring new programming languages. In this case, it was a difference between technologies I'm used to programming in (JavaScript), and Go. What could that be? Call by value.

Yes, this is a n00b issue, and was the result of storing data in structs within packages, and it tripped me up relentlessly. There would be issues where my database mock wasn't being referenced and called for pattern matching, or data wasn't flowing the way I expected, but I got through it. In hindsight, this one seems pretty silly, bit I'm genuinely glad that it came up so prevalantly in this project, because this is just one of those things you need to develop a sort of muscle memory for.

# Technologies Used
- [Viper](https://github.com/mattn/go-sqlite3): Parses a wide range of configuration file formats.
- [Sqlite3 driver](https://github.com/mattn/go-sqlite3): Helped me drive the database.
- [Go-Sqlmock](https://github.com/DATA-DOG/go-sqlmock): My favorite new package. I was genuinely surprised with how intuitive and fun the workflow with go-sqlmock was, seriously! You get to spin up a mock SQL driver, pass it to a function or declare a variable with it, and it pattern matches requests, returning pre-defined results.

# Conclusions
I encourage you to go check out the [code](https://github.com/tlegasse/url-shortener/), because it was a lot of fun to write. This project was primarily focused on the how's, why's, and the most basic of basics, but the next project may (or may not!) have more real world applications, so stay tuned for more 😉