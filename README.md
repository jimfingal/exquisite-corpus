Sentimental Education
=============

A worker script that reads from a database of users and subscribes to their tweets, storing them in mongo as they come in.

An optional boostraping script exists to, given a configured user, initializes the user database with that user and their followers/friends.

The goal of this package is to run it over time to collect a corpus of tweets for later analysis.

The usage of Async for the first time in the boostrapping code melted my brain a little bit, in a good way.
