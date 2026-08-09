---
date: 2026-08-09
authors:
  - Tanner Legasse
title: seen-once
draft: false
tags: ["project"]
series: 
cover:
  image: images/seen-once.jpg
---
I've been building and hosting a service called [seen-once.com](https://seen-once.com), which aims to provide a time based, fully encrypted secrets transmission service. An undertaking that taught me about security in cloud environments, modern web first cryptography practices and infrastructure as code services. This is all to account for the most basic human urge: to do the easy thing instead of the secure thing. I explore further the why and what behind this service and preview some exciting features I'll be implementing in the near future. Buckle up and let's get started.

# Why?
I've been involved in agency development work for e-commerce companies for many years now, and have always worked with a wide range of clients. One of the cringiest experiences I endure is when very well meaning non-technical members share credentials over plain text in emails or over slack, and while tools like lastpass do allow you to share credentials, many of them require the destination account to sign up for a paid plan to receive. But it really shouldn't be that way, privacy tools should be so prevalent that there's no premium on the services they provide.

The great news is there are many platforms out there that offer services that send encrypted credentials back and forth, but many of them are honestly pretty sketchy or overly monetized. To put it kindly, one can tell when a privacy related tool is intentions that align with their stated aims. I used to enjoy one called dead-drop.me, which has since shut down, and while I have the original source, the domain is for sale at an exorbitant expense (ugh). Still, over the years I've wanted to build my own. So let's talk about the problem a little, and we'll take a look at the solution.

Privacy. Privacy is the aim. If you decide to share your credentials, or any other important data across such a service, you should be able to lean on the trust provided by its infrastructure. It should only ever store encrypted text. It should also store the payload for precisely as long as is needed and no more. And I'm sorry, when did we all decide together that Google should know absolutely everything that we do?! So yeah, all externally hosted libraries are out. And the back-end should host zero user logging.

# Solution
So we understand the problem domain and the goals, let's look at how this should work.

I want a website that collects no user information and stores no unencrypted secrets. It should allow a user to navigate to the site, provide text input and select a time to live value for when the secret expires. After providing a secret, you're handed back a URL that includes a non-transmitted secret key. Aaaaand as a nice bonus, this link should also be something you can retrieve a QR code for.

A system was implemented that leverages the following tools:
- AWS + CDK for hosting. Modular, secure, highly maintained.
- Vanilla JS + a static front-end
- A QR code library, vendorized, and served with the static site.

That's it. The beauty of those tools is that we have absolutely everything we need.

## Cryptography
Dead-drop.me leveraged the Stanford JavaScript Crypto Library (SJCL), which did work fantastically well, but we have competent tools at our disposal now built into the browser, namely the subtle crypto library. It's supported directly from browser vendors, and is highly secure when implemented thoughtfully. It works slightly differently though, you're responsible for managing keys, so need to be thoughtful about how you handle it.

The service relies on the browser to perform the encryption. To ensure secure storage and retrieval some important components are at play. Let's follow the path of the encryption key to understand a bit more about what's going on.

Upon page load, an initialization vector is created from a randomized, 12 value `Uint8Array` and stored with the results of subtle crypto's `generateKey` method. The IV and key are used to obscure the user's text content, and are kept with the browser. The text is encrypted with `AES-GCM`, which is both tamper evident, and since GCM isn't padded, contents of any length may be encrypted. When the secret is stored, only a UUID is returned.

The site is only a static one-pager, so retrieval is kicked off by the browser. Querying the retrieval lambda returns the payload as it's deleted (Wrong key? Your problem.). Retrieval only fires on an explicit button press rather than on page load, so an email client or chat app previewing the link can't burn the secret before its recipient sees it. The secret key is stored as a base64 encoded URL fragment, so is as convenient as any other URL, may be represented fully by a QR code and is never sent to the server with the web request. This means that the chain of custody for the secret key starts and ends with the user, and the secret can be retrieved once, and only once.

## The infrastructure
I wanted separate lambda handlers, one for storage/validation, one for retrieval/deletion. While AWS' Dynamodb does have an expiry functionality, it shouldn't be taken for granted that it necessarily deletes data as soon as the timestamp is passed, rather, the retrieval lambda should do just a little due diligence and delete a secret as needed.

# Infrastructure as code
Before we look at the results and talk about the future, let's briefly consider the implications of our infrastructure choice to use CDK.
I learned a lot about cloud development during this project. I'm like a lot of people that treated EC2's as a moderately pricy managed service, like a rackspace, but never really expanded beyond that except gradually. I also worked with Zappa, which makes lambda provisioning automatic, but you're on the hook for managing any other resources manually. I needed something more competent for the infrastructure. I decided to use AWS' CDK. In gaining experience with other tools since the initial build, I have some observations:

CDK excels at being a development toolkit for AWS services. It's first party, so has excellent documentation, but it's not as flexible as some of the third party offerings. For instance, tools like SST do all of the provisioning of permissions as one would expect, but also provides an exceptionally simple means of managing "stages". This means that you're (by default) developing against a `$USER` stage, and setting up stages for production or staging environments with CI/CD is trivial.

CDK also offers what it calls "constructs". Constructs come in three flavors: L1 constructs (anything starting with the `Cfn` identifier) which map to low level cloud formation definitions, and may, as an example, represent a cloud formation output, returning the direct resource value requested. L2 constructs directly leverages L1 constructs, but does so in a more ergonomic way, so may represent a lambda function with a pre-configured environment (like PythonFunction). Lastly, L3 constructs represent further abstractions, and act like patterns. You may use a S3StaticWebsite L3 construct to spin up a website in a much more concise way.

In contrast, SST is built on Pulumi, so offers either Pulumi definitions or SST abstractions, which are very convenient. To compare use-cases directly, while I'm confident in Pulumi to provide 95%+ usecase coverage, leveraging CDK directly does feel like either an enterprise play, or a good foundation for building custom tooling. It's worth noting that SST previously had leveraged CDK directly, and now uses Pulumi. It also offers a really nice CLI. If going the AWS route, this feels like a good play.

I'm going to re-build it. No shade AWS, I just have some plans...

# Costing
The price was a big consideration. I wanted to make sure I was on top of understanding what I'd be paying given I'm doing all of this in the cloud. Some ways I ensured this was possible include an extremely low storage size, so roughly ~3mb on an S3 for the entire setup including image assets and all fonts, strict concurrent and sequential access caps to prevent abuse and a generally small footprint.

For the pleasure of borrowing AWS' services, I pay $7.20 monthly for everything. Cheaper than Ionos' lowest hesting tier. Not too shabby.

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
