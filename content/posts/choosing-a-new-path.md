---
title: Go - Choosing a New Path
date: 2024-01-03T14:34:31-08:00
draft: false
cover:
  image: images/first-post.jpg
---
## Introduction
I've been an e-commerce developer for most of my career, and I've been using PHP and JS for most of that time.
When I was first starting, I was developing Wordpress extensions and tweaking themes. Mundane work of course, but I was SO excited.
I was finally tapping into a part of myself that I didn't fully understand, my thirst for software development.

Fast forward 8 years, and here I am, still just as excited about software development as I was when I first started, but there are problems, and I'm not the same person I was back then.
I've touched JS build systems, became a Shopify expert, programmed in Python, JS, Ruby and more, worked on frameworks and have built my own, but my interest in becoming the best ME that I can be is nagging at me to do something different.
I want to connect the dots, empower the teams I work with by creating better environments for developers like me, and most importantly, I want to have the right tools to do so.
Enter Go.

## Why Go?
Go has an incredible foothold in some of the most exciting and integral processes that businesses use today.
DevOps tools like Docker and Kubernetes are written in Go, and in my journey so far there seems to be little doubt why. Go is fast, but most importantly succinct.
Programming in Go thus far has made me feel like I know more about why they chose the name, it's short, sweet and helps you get your code out of the door.
Go is also effective, efficient and has powerful concurrency tools that make `document.AddEventListener()` feel... off.

Here's an example. I worked for a client whose website communicated with a rental listings service, built and written in ancient PHP.
Yeah, that kind, where you needed to knock the cobwebs off of the code before you could even read it, but somehow it felt more traveled than Everest and they didn't have version control.
The code was slow, and it was next to impossible to read, but it worked, and it worked well.
Did you spot it? The "impossible to read" part? That had real business implications, including bugs being introduced with every new feature becoming a fact of life, and with a precedence set from those that came before that similar features should begin with a copy and a paste.

I might have an unpopular opinion here, but I feel that the monolithic architecture that they owned was already hurting them when we started, and at the end of the day, the system was just creating lines in a database.
Rather than using a Drupal module to communicate with the service, we could have used a Go service to do the same thing, and it would have been faster, more reliable and easier to maintain.
It could be an instance where you set up a new cron job and send requests to another virtual host on the LAMP stack that shared the database, but even then it may be necessary to implement or vendorize an Object Relationship Mapping (ORM) to handle the data.
And by the way, another issue with this system, there were no concurrent requests. Imports would take actual hours.

Let's review the benefits of using Go in this situation:
- A built-in package manager, rather than installing composer (another dependency) and then installing the package.
- Built-in concurrency support, meaning that we can have multiple requests running at once, and limiting where needed (out of the box).
- A highly readable and simplistic syntax, meaning that we can easily read and understand the code, and it's easier to maintain.
- Best of all, it would be decoupled from the website code.

## Pain Points?
I'm not going to lie, there are some pain points with Go, but they're not as bad as you might think.

First, concurrency is not the same as parallelism, but that keeps the onus on the developer to truly understand optimization for the language.

Go also handles errors differently than other languages in that error handling is generally part of a return statement, and you do need to import the `errors` package. The rebuttal to this is that it's truly explicit, and the developer isn't even tempted to write a catch all error (looking at you JS).

Another difficulty is that coming from a language like PHP, you're used to having a lot of tools at your disposal, and Go is a bit more bare bones, but to be frank, I feel that better tooling is preferable to more tools. You just may end up writing something that exists in many other languages.

Lastly, and one that trips me up specifically is that I've only ever worked with scripting languages, and Go is compiled. One must think differently about how the application is entered and how it returns.

## Well... What's the Plan?
I want to be a better developer, and I want to be able to help others become better developers.
I want to leverage my skills working with dozens of businesses of various sizes and industries to help define and implement processes that make developers happier, and I want to do it with Go as my primary tool.
So as you can imagine, from here you can expect to see a lot of Go related content, but it won't be the only tool I'm writing about or learning.
I hope you'll stick around and learn with me, and I hope that you'll find the content useful.
