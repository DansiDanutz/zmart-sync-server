#!/bin/bash

# Start script for Zmart Trading Bot Sync Server

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if the server is already running
if [ -f "server.pid" ]; then
  PID=$(cat server.pid)
  if ps -p $PID > /dev/null; then
    echo "Server is already running with PID $PID"
    exit 1
  else
    echo "Removing stale PID file"
    rm server.pid
  fi
fi

# Start the server
echo "Starting Zmart Trading Bot Sync Server..."
nohup node server.js > logs/server.log 2>&1 &

# Save the PID
echo $! > server.pid
echo "Server started with PID $!"
echo "Logs are being written to logs/server.log"
