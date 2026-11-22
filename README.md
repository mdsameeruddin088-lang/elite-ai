# Elite AI

A private AI chatbot that runs **fully offline** on your own device. No internet, no accounts, no data leaving your machine.

## Features
- 100% offline: powered by a local model through Ollama
- Premium royal navy and champagne design
- Animated intro screen
- Installable as an app with its own window
- One-tap launcher

## Tech Stack
- Node.js server (`server.js`)
- Ollama with the `qwen2.5:0.5b` model
- HTML, CSS and JavaScript front end
- Web app manifest and service worker for installing

## How to Run
1. Install [Node.js](https://nodejs.org) and [Ollama](https://ollama.com)
2. Download the model: `ollama pull qwen2.5:0.5b`
3. Clone this repo: `git clone https://github.com/mdsameeruddin088-lang/elite-ai.git`
4. Start it: `cd elite-ai && ./start.sh`
5. Open `http://localhost:3000` in your browser

## Author
Built by mdsameeruddin088-lang for a local hackathon.

## License
MIT
