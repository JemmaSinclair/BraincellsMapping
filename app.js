require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Check if the database is connected
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the MariaDB database.');
});

// Serve static files (CSS, JS)
app.use(express.static('public'));

// Main route to render the map
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// API route to fetch asset data from the database
app.get('/api/assets', (req, res) => {
    const sql = 'SELECT * FROM assets';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API route to fetch tunnel data from the database
app.get('/api/tunnels', (req, res) => {
    const sql = 'SELECT * FROM tunnels';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
