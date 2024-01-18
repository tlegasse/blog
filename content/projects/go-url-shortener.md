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

## Things learned
Implementing this functionality was a treat. It exposed me to some common patterns and enabled me to learn about the ins and outs, and infrastructure of Go projects. Check out some of my favorite discoveries below.

### Testing
Unit testing admittedly isn't every agency or company's top priority, and I have had some ground to make up. Now, in every project I embark on, I aim to provide thoroughly tested code. In this case, I was exposed to database and HTTP server mocking, test fixtures and more. I found the workflow to be intuitive and very helpful in rounding out my chosen feature set.

### HTTP Server
While the batteries included approach to the Golang standard library means that it comes with a competent and simple HTTP server, it wasn't a mistake that I chose to work with it. I wanted to ensure that my plans of picking up API related tooling experience was in focus during this project.

# Project Overview

# Challenges

### Embedding:
This is the big one, and seems to fly under the radar in terms of what Go developers are exposed to first. In the code below, you can see how I'm leveraging the `embed` package to compile the SQL statements needed to spin up my database table:

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

```golang
//go:embed schema.sql
var schemaFS embed.FS
```

# Technologies Used
- Viper helps me manage configuration variables.