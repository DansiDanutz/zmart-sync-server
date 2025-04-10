# README.md - Zmart Trading Bot Synchronization Solution

## Overview

This package contains a complete server-side solution for synchronizing the Zmart Trading Bot dashboard with your Airtable database. The solution ensures that cryptocurrency prices displayed on the dashboard exactly match the values stored in Airtable, eliminating the 8.04% markup discrepancy.

## Package Contents

- `server.js` - Main server file that fetches data from Airtable and serves the client-side script
- `client-sync.js` - Client-side script that updates the dashboard with correct prices
- `.env` - Environment configuration file with Airtable API key and other settings
- `start.sh` - Script to start the server
- `stop.sh` - Script to stop the server
- `package.json` - Node.js dependencies and configuration
- `installation_guide.md` - Detailed installation instructions
- `server_configuration.md` - Server configuration documentation
- `integration_guide.md` - Dashboard integration guide

## Quick Start

1. Install Node.js if not already installed
2. Extract this package to your server
3. Run the following commands:
   ```bash
   npm install
   chmod +x start.sh stop.sh
   ./start.sh
   ```
4. Verify the server is running:
   ```bash
   curl http://localhost:3000/api/prices
   ```
5. Integrate with your dashboard using one of the methods in the integration guide

## Documentation

Please refer to the following documentation files for detailed information:

- `installation_guide.md` - How to install and set up the server
- `server_configuration.md` - Detailed server configuration options
- `integration_guide.md` - How to integrate with your dashboard

## Features

- Real-time price synchronization with Airtable
- Automatic updates every 5 minutes (configurable)
- Manual update button on the dashboard
- Visual feedback for price changes
- Intercepts existing update buttons for seamless integration

## Support

If you encounter any issues or need assistance, please refer to the troubleshooting sections in the documentation files.
