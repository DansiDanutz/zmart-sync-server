# Zmart Trading Bot Server-Side Installation Guide

This guide will walk you through the process of setting up the server-side solution for the Zmart Trading Bot dashboard price synchronization.

## Prerequisites

- A server with Node.js 14+ installed
- Basic knowledge of terminal/command line
- Access to your Airtable API key and base information (already configured in the provided files)

## Installation Steps

### 1. Set Up the Server Environment

1. Create a directory for the server:
   ```bash
   mkdir -p zmart-sync-server
   cd zmart-sync-server
   ```

2. Copy all the provided files to this directory:
   - `server.js`
   - `client-sync.js`
   - `.env`
   - `package.json`
   - `start.sh`
   - `stop.sh`

3. Install dependencies:
   ```bash
   npm install
   ```

### 2. Configure Environment Variables

The `.env` file contains all necessary configuration. It's already set up with your Airtable credentials, but you can modify it if needed:

```
AIRTABLE_API_KEY=pat8ePqoLIHnQw3GM.e1f4727198651deaaa365863a339c99205da1664746f9be7577f776624b0e6f6
AIRTABLE_BASE_ID=appAs9sZH7OmtYaTJ
AIRTABLE_TABLE_ID=tblDdZFPDFir3KLb9
PORT=3000
UPDATE_INTERVAL=300000
```

- `PORT`: The port the server will run on (default: 3000)
- `UPDATE_INTERVAL`: How often to fetch new data from Airtable in milliseconds (default: 300000 = 5 minutes)

### 3. Start the Server

1. Make the start script executable:
   ```bash
   chmod +x start.sh
   ```

2. Start the server:
   ```bash
   ./start.sh
   ```

3. Verify the server is running:
   ```bash
   curl http://localhost:3000/status
   ```
   
   You should see a JSON response with the server status.

### 4. Set Up Automatic Startup (Optional)

To ensure the server starts automatically when your server reboots, you can set up a systemd service:

1. Create a systemd service file:
   ```bash
   sudo nano /etc/systemd/system/zmart-sync.service
   ```

2. Add the following content (adjust paths as needed):
   ```
   [Unit]
   Description=Zmart Trading Bot Sync Server
   After=network.target

   [Service]
   Type=simple
   User=YOUR_USERNAME
   WorkingDirectory=/path/to/zmart-sync-server
   ExecStart=/usr/bin/node server.js
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start the service:
   ```bash
   sudo systemctl enable zmart-sync.service
   sudo systemctl start zmart-sync.service
   ```

4. Check the status:
   ```bash
   sudo systemctl status zmart-sync.service
   ```

## Integration with the Dashboard

### Method 1: Direct Script Injection (Temporary)

You can test the integration by running this in your browser console after logging into the dashboard:

```javascript
const script = document.createElement('script');
script.src = 'http://YOUR_SERVER_IP:3000/dashboard-sync.js';
document.head.appendChild(script);
```

Replace `YOUR_SERVER_IP` with your server's IP address or domain name.

### Method 2: Permanent Integration

For a permanent solution, you'll need to add the script tag to the dashboard's HTML. This typically requires access to the website's source code or a content management system.

Add this line to the `<head>` section of the dashboard's HTML:

```html
<script src="http://YOUR_SERVER_IP:3000/dashboard-sync.js"></script>
```

Replace `YOUR_SERVER_IP` with your server's IP address or domain name.

## Troubleshooting

### Server Won't Start

1. Check for errors in the console output
2. Verify that the port is not already in use
3. Ensure all dependencies are installed: `npm install`
4. Check the `.env` file for correct configuration

### Dashboard Not Updating

1. Check the browser console for errors
2. Verify the server is running: `curl http://YOUR_SERVER_IP:3000/status`
3. Ensure the script is being loaded correctly
4. Check that CORS is not blocking requests

### Prices Not Matching

1. Trigger a manual update: `curl -X POST http://YOUR_SERVER_IP:3000/api/update`
2. Check the server logs for any errors
3. Verify the Airtable API key and base information are correct

## Maintenance

### Updating the Server

If you need to update the server code:

1. Stop the server: `./stop.sh` or `sudo systemctl stop zmart-sync.service`
2. Update the files
3. Start the server: `./start.sh` or `sudo systemctl start zmart-sync.service`

### Monitoring

You can monitor the server status by:

1. Checking the logs: `tail -f logs/server.log`
2. Accessing the status endpoint: `curl http://YOUR_SERVER_IP:3000/status`

## Security Considerations

- The server exposes API endpoints that anyone can access if they know the URL
- Consider adding authentication if the server is publicly accessible
- Use HTTPS if possible to encrypt data in transit
- Keep your Airtable API key confidential

## Support

If you encounter any issues or need assistance, please refer to the documentation or contact support.
