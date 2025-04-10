const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration from environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;
const PORT = process.env.PORT || 3000;
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL) || 300000; // 5 minutes default

// Store the latest cryptocurrency prices
let latestPrices = {};
let lastUpdateTime = null;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Function to fetch data from Airtable
async function fetchAirtableData() {
  try {
    console.log('Fetching data from Airtable...');
    const response = await axios.get(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.records) {
      console.log(`Successfully fetched ${response.data.records.length} records from Airtable`);
      
      // Process the data and store it
      const newPrices = {};
      response.data.records.forEach(record => {
        if (record.fields.Symbol && record.fields.Price !== undefined) {
          newPrices[record.fields.Symbol] = {
            price: record.fields.Price,
            name: record.fields.Name || '',
            pair: record.fields.PAIR || '',
            lastUpdate: record.fields.Last_Update || new Date().toISOString(),
            technicalIndicatorScore: record.fields.TechnicalIndicatorScore,
            timeframeAlignmentScore: record.fields.TimeframeAlignmentScore,
            liquidationDataScore: record.fields.LiquidationDataScore
          };
        }
      });
      
      // Update the latest prices
      latestPrices = newPrices;
      lastUpdateTime = new Date().toISOString();
      
      // Save to a JSON file as backup
      fs.writeFileSync(
        path.join(dataDir, 'latest_prices.json'),
        JSON.stringify({ 
          prices: latestPrices, 
          lastUpdate: lastUpdateTime 
        }, null, 2)
      );
      
      console.log('Prices updated and saved to file');
      return true;
    } else {
      console.error('Invalid response from Airtable');
      return false;
    }
  } catch (error) {
    console.error('Error fetching data from Airtable:', error.message);
    return false;
  }
}

// API endpoint to get the latest prices
app.get('/api/prices', (req, res) => {
  res.json({
    prices: latestPrices,
    lastUpdate: lastUpdateTime
  });
});

// API endpoint to trigger a manual update
app.post('/api/update', async (req, res) => {
  const success = await fetchAirtableData();
  res.json({ 
    success, 
    message: success ? 'Prices updated successfully' : 'Failed to update prices',
    lastUpdate: lastUpdateTime
  });
});

// Serve the client-side script
app.get('/dashboard-sync.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  
  // Read the client script template
  let clientScript = fs.readFileSync(path.join(__dirname, 'client-sync.js'), 'utf8');
  
  // Replace placeholders with actual values
  clientScript = clientScript
    .replace('__UPDATE_INTERVAL__', UPDATE_INTERVAL.toString())
    .replace('__SERVER_URL__', req.protocol + '://' + req.get('host'));
  
  res.send(clientScript);
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    lastUpdate: lastUpdateTime,
    recordCount: Object.keys(latestPrices).length
  });
});

// Initialize by fetching data from Airtable
fetchAirtableData().then(() => {
  console.log('Initial data fetch completed');
});

// Set up automatic updates using node-cron
// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running scheduled update...');
  await fetchAirtableData();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard sync script available at: http://localhost:${PORT}/dashboard-sync.js`);
});
