---
date: 2024-01-31
authors:
  - Tanner Legasse
title: Creating Powder Toy
draft: false
tags: ["project"]
series: 
cover:
  image: images/powder-toy.webp
---

# Introduction
Powder toy (also known as a falling sand game), for those not familiar, is an sandbox like simulation game where the user is generally free to experiment with various materials which can interact together or sometimes on their own. Some of the game-play mechanics have found their way into public consciousness through games like [Noita](https://en.wikipedia.org/wiki/Noita_(video_game)), a popular rogue-like game with realistic material interactions. As an example of how these games generally play, you can check out the video below.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/LGbjdJO04H8?si=cFLjZj7RGq6ZDR5E&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen ></iframe>

---
I remember running powder toy games back in middle school in MS-DOS, and was endlessly impressed with its smooth operation and engaging gameplay mechanics. Maybe there's even an argument to make that it's one of the quintessential games-with-no-end in the same way that Minecraft used to be. It's just a toy! A powder toy!

# What is Powder Toy?
Surprising, right? We chatted about this in the intro! Well this part ties in to the goals section below, I'm going to be building it. Powder toy, in actuality borrows the simplicity of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) (GOL) in that it's more a framework of operation than a specific piece of code, namely a cellular automata. The fundamentals of the game are very simple, and state is generally only accounted for locally, just like a petri dish of literal bacteria would function in real life, or in the case of powder toy, like the world may work if taken as a 2 dimensional cross section.

## A Cellular... what?
Now, this may sound complex, but the beauty of cellular automata is that it's surprisingly simple, I promise you'll get it. This is how Life works:
* The world is represented by a 2 dimensional array of "cells".
* The game world ticks forward one turn at a time.
* A cell is either alive or dead.
* A cell has neighbors.
* A cell comes to life if it has just the right amount of neighbors.
* A cell can't do the life thing if it has too many neighbors, or too few neighbors.
* A ce... wait... that's it. That's **all** of the rules.

*Bonus: check out the GOL I whipped up while flying to New York. Just hit play* 😁
<p class="codepen" data-height="600" data-default-tab="result" data-slug-hash="oeGVjb" data-user="tlegasse" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/tlegasse/pen/oeGVjb">
  Tanner's game of life</a> by Tanner Legasse (<a href="https://codepen.io/tlegasse">@tlegasse</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

---
Okay, so GOL is about as simple as you can get while still being interactive. There's some more aspects to consider, and more fundamental mechanisms by which cellular environments can be simulated ([Elementary Cellular Automaton](https://en.wikipedia.org/wiki/Elementary_cellular_automaton)), but for our purposes, we're going to skip ahead. Spend some time digging if you want more good reading!

## What makes Powder Toy different?
If you're content with GOL, congrats, go back up and have fun. Some, however, want a more compelling and realistic experience, so the question becomes "what?" and "how?". previously, the data structure was exceedingly simple. One set of rules apply to the only cell type in the game, and most of the cell's data consists of the following (this is the constructor of my GOL Cell class):
```javascript
constructor(x, y) {
	let isAlive = Math.floor(Math.random() * 2)
	
	this.x = x
	this.y = y
	this.alive = isAlive
	...
}
```
As you can see, we just need to know X and Y, as well as the cell's alive status. Everything else in the constructor is related to keeping that data up to date, but that's it. If you had a cell that couldn't die, couldn't be interacted with and was always alive, you'd have a wall. A different material type, but very similar. If you had one type of cell that could interact with another cell that converted either/or to an area of high pressure and temperature, you'd have fire and gasoline. Those work differently, you could imagine gas being quickly taken over in a series of turns, and moving gradually **away** from high pressure zones. You could imagine the fire not going away, and responding to gravity; that's stuff we usually call lava. What happens when you mix dirt, water and seeds? Plants!

At the end of the day/ experiment, the simplicity derived from cells interacting together represents a fun toy, and an even more enjoyable software writing experience.

# Goals
I'm going to be recreating some of the functionality of powder toy using Go. It is in some ways a non-natural way to leverage Go's robust strengths, however this project will be killing 2 birds with one stone. I'll be leveraging Go's ability to compile to WASM (WebAssembly), and some interesting tools to pull in and serve the build packages. It'll be only as simple as it can be to serve its purpose, and I'll be hosting the finished product, after a few follow up articles, right here, so stay tuned and let me know how you end up liking the process!