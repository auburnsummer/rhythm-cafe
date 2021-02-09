# Orchard

I'VE ONLY REALLY JUST STARTED ON IT

This is the front end for orchard.

The previous design got really complicated and I started getting overwhelmed. So this one is purposely meant to be simpler.

yes this means the cool booster pack idea with the images probably won't happen sorry

# Architecture

There's a seperate repository [rd-indexer]() which indexes through sources (Discord, Steam Workshop??) and creates an
SQLite database. That SQLite database is uploaded to B2 storage.

This frontend then downloads _the entire database_ and uses client-side SQL.js to parse it. This way I don't have to
maintain an API and a server! It's all static files! Yay!

..."But wouldn't that use a lot of bandwidth?"

Well, we compress the database so it's not _that big_. I think as long as its below a few megabytes
it should be fine. So it should be fine until about 50,000 levels. (A back of the envelope calculation:
50000 levels should be about a 15 MB database.)

Eventually I want to have a patching process so the client stores its copy of the database, and
downloads a patch from the server instead of having to redownload the latest database every time. That's pretty far in the
future though.



# Getting Started

This time there isn't any NPM or bundling steps involved so the development process is easier.

First, clone this repository. You can either clone it with Git or just click the Download with ZIP button.

Then, you'll need to start a local HTTP server. There's plenty of ways to do this, but I'll show just two.

First, open a terminal in the same directory as this README.

## Python 3

Check if you have Python 3 installed (`python3 -v`). If you do, you can start a HTTP server like this:

`python3 -m http.server`.

It will run at `localhost:8000`.

## node.js

Check if you have Node.JS installed (`npx -v`). If you do, you can start a HTTP server like this:

If you have node.js installed do this:

`npx serve .`

It will run at `localhost:5000`.

Once you've gotten the HTTP server running, you can edit the files and refresh the page to see your changes.

Also if you use VSCode I suggest the lit-html extension to syntax highlight the html format strings.

# Contributing

Ping or DM me on the discord @auburnsummer if you have any questions about contributing.

Generally speaking, I'm happy to accept all pull requests. If you plan on doing something pretty
big, you should probably let me know first. I may be able to point you in the right direction.

# Licence

AGPLv3

@auburnsummer 2021