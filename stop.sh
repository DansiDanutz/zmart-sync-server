#!/bin/bash

# Stop script for Zmart Trading Bot Sync Server

# Check if the server is running
if [ ! -f "server.pid" ]; then
  echo "Server is not running (no PID file found)"
  exit 1
fi

# Get the PID
PID=$(cat server.pid)

# Check if the process is running
if ! ps -p $PID > /dev/null; then
  echo "Server is not running (PID $PID not found)"
  rm server.pid
  exit 1
fi

# Stop the server
echo "Stopping Zmart Trading Bot Sync Server (PID $PID)..."
kill $PID

# Wait for the process to terminate
for i in {1..10}; do
  if ! ps -p $PID > /dev/null; then
    echo "Server stopped successfully"
    rm server.pid
    exit 0
  fi
  echo "Waiting for server to stop..."
  sleep 1
done

# Force kill if necessary
echo "Server did not stop gracefully, forcing termination..."
kill -9 $PID
rm server.pid
echo "Server terminated"
