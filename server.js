const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files (CSS, JS, images)
app.use(express.static('public'));

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Route for the home page
app.get('/', (req, res) => {
    res.render('index', { prayerTimes: null, city: '' });
});

// Route to handle form submission
app.post('/get-prayer-times', async (req, res) => {
    const city = req.body.city;

    try {
        // Fetch prayer times from the new API
        const response = await axios.get(`https://api.nexoracle.com/islamic/prayer-times?city=${city}`);
        const prayerData = response.data.result.items[0]; // Extract prayer times from the first item

        // Debugging: Print API response
        console.log('API Response:', prayerData);

        // Render the index.ejs file with prayer times data
        res.render('index', { prayerTimes: prayerData, city });
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        res.status(500).send('Error fetching prayer times');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
