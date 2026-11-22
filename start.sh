#!/bin/bash
(pgrep ollama >/dev/null || (ollama serve >/dev/null 2>&1 &))
(pgrep -f "node server.js" >/dev/null || (cd ~/elite-ai && nohup node server.js >/dev/null 2>&1 &))
sleep 4
xdg-open http://localhost:3000
