# add_something_positive

## Disclaimer

This app is pretty early on in its development, and things are subject to change.

## Purpose

Everyday life can get hectic, especially as someone living with ADHD and anxiety. With this in mind, I've found that taking time daily to slow down and note one positive thing helps me have a positive outlook on every day. As I find this process important, I designed this app to serve this purpose.

## Functionality

You enter something positive and save it. Afterwards, you can see previous messages you've saved to reflect on positive moments. You also have the option to delete messages too.

## Tech Stack

(This is very much overdone, especially considering the scale of this app. However, doing it this way helped me learn a lot of new things! Also, considering everything including backend is locally ran, I designed the app with that in mind.)

Vite: allowed me to set up Electron and React with ease

Electron: I wanted this project to run as its own app

JavaScript + React: for UI, dynamically rendering previous messages, managing state

Node.js: start up Python backend

Flask: connect to Python backend and send requests

Python: handling Flask requests (communicating with frontend)

SQLite3: storing entries in a local database

## Setup

(This will be updated)

backend: pip install -r requirements.txt

frontend: npm run dev

## Versions

0.1.4 Fix issues #4 and #5

0.1.3 Fix issue #3, note how issue #4 can be fixed.

0.1.2 Fix description formatting + fix spinner

0.1.1 Fix issue #7

0.1 Initial release
