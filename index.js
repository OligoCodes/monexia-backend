require('dotenv').config(); 
// Loads your .env file and lets you use process.env.KEY

const express = require('express');
const fetch = require('node-fetch'); // So we can fetch() in Node.js
const cors = require('cors'); // So frontend (browser) can access backend

const app = express(); // Start express server
const PORT = process.env.PORT || 3000;     // Use port 3000 for local host

app.use(cors());
// Allow requests from frontend
app.use(express.json());// Parse JSON if frontend sends it

// Route for frontend to call
app.get('/latest/rates', async (req, res) => {
  const base  = req.query.base; // Get ?base= from frontend
  const currencies = req.query.currencies; //Get ?currency too

  if (!base || !currencies) {
    return res.status(400).json({ error: 'Missing conversion query' });
  }

  const url = `https://currency-converter-pro1.p.rapidapi.com/latest-rates?base=${base}&currencies=${currencies}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': `currency-converter-pro1.p.rapidapi.com`,
      'x-rapidapi-key': process.env.API_KEY // secret API key
    }
  };

  try {
    const response = await fetch(url, options); // Call external API
    const data = await response.json();         // Convert to JSON
    res.json(data);                             // Send it to frontend
  } catch (error) {
    console.error('Error converting currency:', error.message);
    res.status(500).json({ error: 'Failed to convert' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅️Server running on http://localhost:${PORT}`);
});
