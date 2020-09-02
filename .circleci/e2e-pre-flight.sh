#!/usr/bin/env bash

npm run build
node start.js 1>/dev/null &

if [ -n "$E2E_MOCK_AUTH" ]; then
  node mocks/auth-server.js &
fi

sleep 5
