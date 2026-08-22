---
date: 2026-08-09
authors:
  - Tanner Legasse
title: Seen-Once, Zero Trust Secret Sharing
draft: false
tags: ["project"]
series: 
cover:
  image: images/seen-once.jpg
---
<a href="https://seen-once.com"><img src="/images/seen-once-banner.jpg" style="display: block; width: 100%;" alt="Seen once" /></a>
<br />
<br />

I've been building and hosting a service called [seen-once.com](https://seen-once.com), which aims to provide a time based, fully encrypted secrets transmission service. An undertaking that taught me about security in cloud environments, modern web first cryptography practices and infrastructure as code services. This is all to account for the most basic human urge: to do the easy thing instead of the secure thing. I explore further the why and what behind this service and preview some exciting features I'll be implementing in the near future. Buckle up and let's get started.

<br />
<br />

---

# Why?
**For the love of privacy and safety.**

I've been involved in agency development work for e-commerce companies for many years now, and have always worked with a wide range of clients. An unfortunately common experience I've had is when very well meaning colleagues or clients share credentials in plain text through emails or over slack, and while tools like LastPass do allow you to share credentials, many of them require a destination account and a paid plan to retrieve them. I've also had conversations in my personal life where the tone was: "Why care? My data is spread across the internet anyway!" Professional or no, people need an abundance of tools that meet them where they are.

There *are* many platforms out there that offer services to send encrypted credentials back and forth, but generally they're either or overly monetized. A service I trusted, but no longer exists is called dead-drop.me, but the author decided no longer to maintain it. Long story short, over the years I've really wanted to build my own and build tools that make security fun.

Privacy is the aim above all else. If you decide to share your credentials or any other important data across such a service, you should be able to lean on the trust provided by its infrastructure. It should have public source, should only ever store encrypted text and should also store the payload for precisely as long as is needed and no more. Also, I'm sorry, when did we all decide together that Google should have an internet sized map of exactly what we all get up to?! (that's another story though.) So yeah, all externally hosted libraries are out too, and the back-end should host zero user logging.

# Solution
Let's look at how this should work.

I wanted a service that collects no user information and stores no unencrypted secrets. It should allow a user to navigate to the site, provide text input and select a time to live value for when the secret expires. After providing a secret, you're handed back a URL that includes a non-transmitted secret key. Aaaaand as a nice bonus, this link should also be something you can retrieve a QR code for.

A system was implemented that leverages the following tools:
- AWS + CDK for hosting. Modular, secure, highly maintained.
- Vanilla JS + a static front-end to reduce dependencies and, frankly, lines of code.
- A QR code library, vendorized, and served with the static site.

That's it. The beauty of those tools is that we have everything we need and nothing more.

## Cryptography
Dead-drop.me leveraged the Stanford JavaScript Crypto Library (SJCL), which did work fantastically well, but we have competent tools at our disposal now built into the browser, namely the subtle crypto module. It's supported across all common browser vendors and is highly secure when implemented thoughtfully. It works slightly differently from SJCL, which provides a JSON object containing all encryption values other than a key; you're responsible for implementation directly.

The service relies on the browser to perform the encryption. To ensure secure storage and retrieval some important components are at play. Let's follow the path of the encryption key to understand a bit more about what's going on.

Upon page load, an initialization vector is created from a randomized, 12 value `Uint8Array` and stored with the results of subtle crypto's `generateKey` method. The IV and key are used to obscure the user's text content, and are kept with the browser. The text is encrypted with `AES-GCM`, which is both tamper evident, and since GCM isn't padded, contents of any length may be encrypted. When the secret is stored, only a UUID is returned.

The site is only a static one-pager, so retrieval is kicked off by the browser. Querying the retrieval lambda returns the payload as it's deleted (Wrong key? Your problem.). Retrieval only fires on an explicit button press rather than on page load, so an email client or chat app previewing the link can't burn the secret before its recipient sees it. The secret key is stored as a base64 encoded URL fragment, so is as convenient as any other URL, may be represented fully by a QR code and is never sent to the server with the web request. This means that the chain of custody for the secret key starts and ends with the user, and the secret can be retrieved once, and only once.

## Infrastructure as code
Before we talk about any future plans, let's briefly consider the implications of our infrastructure choice to use CDK.

I learned a lot about cloud development during this project. I'm like a lot of people that treated EC2's as a convenient alternative to managed hosting providers, like a rackspace, but so only really had very manual AWS experience. I have worked with Zappa, which makes lambda provisioning automatic, but you're still on the hook for managing any other resources manually in the AWS dash. I wanted something that made that part of the job really easy. I decided to use AWS' CDK. In gaining experience with other tools since the initial build, I have some observations:

CDK excels at being a development toolkit for AWS services. It's first party, so has excellent documentation, but it's not as ergonomic as some of the third party offerings. For instance, tools like SST do all of the provisioning of permissions as one would expect, but also provides an exceptionally simple means of managing "stages". This means that you're (by default) developing against a `$USER` stage, and setting up stages for production or staging environments with CI/CD is trivial.

CDK offers what it calls "constructs". Constructs come in three flavors: L1 constructs (anything starting with the `Cfn` identifier) which map to low level cloud formation definitions. They may an example, provision a cloud formation output, returning the direct resource value requested. L2 constructs directly leverages L1 constructs, but does so as an abstraction, usually containing convenient defaults. They may represent a lambda function with a pre-configured environment (like PythonFunction). Lastly, L3 constructs represent further abstractions, and act like patterns. You may use a S3StaticWebsite L3 construct to spin up a website in a much more concise way.

In contrast, SST is built on Pulumi, which as an abstraction layer on AWS, so offers either direct Pulumi definitions or SST abstractions, which are very convenient. To compare use-cases directly, while I'm confident in Pulumi to provide 95%+ usecase coverage, leveraging CDK directly does feel like either an enterprise play, or a good foundation for building custom tooling.

SST is very good at usecases that would leverage L2 constructs only. It's worth noting that SST previously had leveraged CDK directly, and now uses Pulumi. SST also offers a really nice CLI. If going the AWS route, this feels like a good play. I'll actually be rebuilding the service in an SST project. No shade AWS, I just need the convenience factor.

## Costing
The price was the biggest consideration. I wanted to make sure I was on top of what I'd be paying given that I'm doing all of this in the cloud. We've all heard the horror stories about hockey stick shaped bills. Some ways I ensured this was possible include an extremely low storage size, so roughly ~3mb on an S3 for the entire setup including image assets and all fonts, strict concurrent and sequential access caps to prevent abuse and a generally small footprint.

For the pleasure of borrowing AWS' services, I pay $7.20 monthly for everything. Cheaper than Ionos' lowest hosting tier. Not too shabby.

# So what's next?
Yeah, so it's built out? I mean what could be more, I never have to touch it again, right? Well... I'm really happy. I have a system that provides highly secure, temporary, credentials storage, and I actually use it IRL when a client needs to send credentials to me or vice versa, but I have some thoughts.
First, as mentioned, I'm going to ditch CDK. I want easier stages and I want faster spin-up when I take months long breaks from touching the infrastructure. I also have some additional things I'm interested in experimenting with:
- A direct machine to machine, WebRTC, live secrets sharing system.
- A CLI implementation that speaks to the service to store environment secrets, as an example.
- A browser extension including a select -> right-click option to share credentials.
- A re-designed front-end with webcomponents for a more modern development experience.
- A custom encryption key.

I've had a lot of fun with this project. It started as an itch to replace something I loved, and I genuinely think I've improved on it. I hope you'll join me next time to learn about further updates.

If you want to read the code directly, check it out [here](https://codeberg.org/tlegasse/seen-once/).
