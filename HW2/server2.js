// server.js
const express = require('express');
const mariadb = require('mariadb');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 80;
const firstInst = "http://130.211.210.203";

// Create a MariaDB connection pool
const pool = mariadb.createPool({
host: '127.0.0.1', // Use IP address to force TCP connection
port: 3306, // Ensure this is the correct port user: 'your_username', // Replace with your MariaDB
user: "Emman",
password: 'hello', // Replace with your MariaDB password
database: 'Hw2', // Our database name created above
connectionLimit: 5
});
// Set EJS as the view engine and set the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Use body-parser middleware to parse form data (if you prefer explicit usage)
app.use(bodyParser.urlencoded({ extended: true }));

// Alternatively, you can use Express's built-in parsing:
// app.use(express.urlencoded({ extended: true }));
// Route: Display form and users table
app.get('/list', async (req, res) => {
    let conn;
    try {
    conn = await pool.getConnection();
    // Get all users from the table
    const users = await conn.query('SELECT * FROM Users');
    res.render('index', { users });
    } catch (err) {
    res.status(500).send(`Error retrieving customers: ${err}`);
    } finally {
    if (conn) conn.release();
    }
    });
app.get('/greeting', async (req, res) => {
    let conn;
    try {
    conn = await pool.getConnection();
    // Get all users from the table
    // const users = await conn.query('SELECT * FROM Users');
    res.send("Hello World!");
    } catch (err) {
    res.status(500).send(`Error retrieving Users: ${err}`);
    } finally {
    if (conn) conn.release();
    }
    });
    // Route: Add a new user
app.post('/register', async (req, res) => {
    const name = req.body.name;
    let conn;
    try {
    conn = await pool.getConnection();
    await conn.query('INSERT INTO Users(username) VALUE (?)', [name]);
    res.redirect('/greeting');
    } catch (err) {
    res.status(500).send(`Error adding customer: ${err}`);
    } finally {
    if (conn) conn.release();
    }
    });
app.post('/register-receive', async (req, res) => {
    const name = req.body.name;
    let conn;
    try {
    conn = await pool.getConnection();
    await conn.query('INSERT INTO Users(username) VALUE (?)', [name]);
    // res.redirect('/greeting');
    } catch (err) {
    res.status(500).send(`Error adding customer: ${err}`);
    } finally {
    if (conn) conn.release();
    }
})
app.post('/clear', async (req, res) => {
    let conn;
    try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM Users');
    const response = await fetch(firstInst + '/clear-receive',{
        method: 'POST',
        body: JSON.stringify({})})
        .then(response => {console.debug(response)})
        .catch(error => {console.error(error)}) ;
    res.redirect('/greeting');
    } catch (err) {
    res.status(500).send(`Error removing users: ${err}`);
    } finally {
    if (conn) conn.release();
    }
    });
app.post('/clear-receive', async (req, res) => {
    let conn;
    try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM Users');
    res.redirect('/greeting');
    } catch (err) {
    res.status(500).send(`Error removing users: ${err}`);
    } finally {
    if (conn) conn.release();
    }
    });
app.listen(port, () => {
    console.log(`Server is running on http://34.122.56.120:${port}`);
    });


