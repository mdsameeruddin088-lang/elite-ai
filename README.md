# Elite AI

A private AI chatbot that runs 100% offline on your own device. No internet, no accounts, no data leaving your machine.

## Features
- Streaming replies with a Stop button
- Saved chat history, with new and delete
- Markdown and copy-able code blocks
- Live "offline model ready" indicator
- Zero external libraries or fonts

## Run it
1. Install Ollama (https://ollama.com) and Node.js 18+
2. Download the model once: `ollama pull qwen2.5:0.5b`
3. Start the app: `node server.js`
4. Open http://localhost:3000 (it works with Wi-Fi off)

## Stack
Node.js server, Ollama (local LLM), plain HTML, CSS and JavaScript.

## License
MIT
