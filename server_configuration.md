# Server Configuration Documentation

This document provides detailed information about the server configuration options for the Zmart Trading Bot dashboard synchronization solution.

## Environment Variables

The server uses environment variables for configuration, which are stored in the `.env` file. Below is a detailed explanation of each configuration option:

### Core Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | The port number the server will listen on | `3000` | `PORT=3000` |
| `UPDATE_INTERVAL` | How often to fetch new data from Airtable (in milliseconds) | `300000` (5 minutes) | `UPDATE_INTERVAL=300000` |

### Airtable Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `AIRTABLE_API_KEY` | Your Airtable API key | `AIRTABLE_API_KEY=pat8ePqoLIHnQw3GM.e1f4727198651deaaa365863a339c99205da1664746f9be7577f776624b0e6f6` |
| `AIRTABLE_BASE_ID` | The ID of your Airtable base | `AIRTABLE_BASE_ID=appAs9sZH7OmtYaTJ` |
| `AIRTABLE_TABLE_ID` | The ID of your Airtable table | `AIRTABLE_TABLE_ID=tblDdZFPDFir3KLb9` |

## Server Architecture

The server is built using Node.js and Express, with the following components:

### Core Components

1. **Express Server**: Handles HTTP requests and serves the client-side script
2. **Airtable Integration**: Fetches data from Airtable using the provided API key
3. **Cron Job**: Automatically updates the data at regular intervals
4. **Data Storage**: Stores the latest data in memory and as a backup JSON file

### API Endpoints

The server exposes the following API endpoints:

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/prices` | GET | Get the latest cryptocurrency prices | JSON object with prices and last update time |
| `/api/update` | POST | Trigger a manual update from Airtable | JSON object with success status and message |
| `/dashboard-sync.js` | GET | Get the client-side synchronization script | JavaScript file |
| `/status` | GET | Get the server status | JSON object with status information |

## File Structure

The server uses the following file structure:

```
zmart-sync-server/
├── server.js           # Main server file
├── client-sync.js      # Client-side script template
├── .env                # Environment variables
├── package.json        # Node.js dependencies
├── start.sh            # Script to start the server
├── stop.sh             # Script to stop the server
├── data/               # Directory for data storage
│   └── latest_prices.json  # Backup of the latest prices
└── logs/               # Directory for log files
    └── server.log      # Server log file
```

## Performance Considerations

### Memory Usage

The server keeps the latest cryptocurrency prices in memory for fast access. The memory footprint is minimal, typically less than 50MB.

### CPU Usage

The server has minimal CPU requirements, with spikes only when fetching and processing data from Airtable (every 5 minutes by default).

### Network Usage

The server makes HTTP requests to the Airtable API at regular intervals. The amount of data transferred is minimal, typically less than 100KB per request.

## Security Considerations

### API Key Protection

The Airtable API key is stored in the `.env` file and is not exposed to clients. However, it's important to keep this file secure and not commit it to public repositories.

### CORS Configuration

The server is configured to allow cross-origin requests from any origin. This is necessary for the client-side script to work when loaded from a different domain.

### Rate Limiting

The server does not implement rate limiting, but the Airtable API has its own rate limits. If you experience issues with rate limiting, consider increasing the `UPDATE_INTERVAL` value.

## Advanced Configuration

### Customizing the Client Script

The client-side script (`client-sync.js`) is served dynamically with the server URL and update interval injected. If you need to customize the client script, modify the `client-sync.js` file and restart the server.

### Logging Configuration

Logs are written to the `logs/server.log` file. For more detailed logging, you can modify the `console.log` statements in the `server.js` file.

### HTTPS Support

The server does not include HTTPS support by default. For production use, it's recommended to set up a reverse proxy (like Nginx or Apache) with HTTPS enabled.

## Troubleshooting

### Common Issues

1. **Server won't start**: Check if the port is already in use or if there's a syntax error in the code.
2. **Cannot connect to Airtable**: Verify your API key and network connectivity.
3. **Client script not loading**: Check for CORS issues or network connectivity problems.

### Debugging

For debugging, you can:

1. Check the server logs: `tail -f logs/server.log`
2. Increase logging verbosity by adding more `console.log` statements
3. Use the browser developer console to check for client-side errors

## Maintenance

### Updating the Server

To update the server code:

1. Stop the server: `./stop.sh`
2. Update the files
3. Start the server: `./start.sh`

### Monitoring

To monitor the server:

1. Check the server status: `curl http://localhost:3000/status`
2. Check the logs: `tail -f logs/server.log`
3. Use a monitoring tool like PM2 or systemd for more advanced monitoring
