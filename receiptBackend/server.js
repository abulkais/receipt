// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginOtpRoute = require('./routes/loginOtp');
const saveReceipt = require('./routes/saveReceipt');
const saveReceipt2 = require('./routes/saveReceipt2');
const logout = require('./routes/logout');

const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'receipt'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected.');
});

app.get('/api/get-receipts', (req, res) => {
    const sql = 'SELECT * FROM receiptsdata';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching receipts');
        }
        res.json(results);
    });
});

// Make DB connection available globally
app.set('db', db);

// Use the loginOtp route
app.use('/api', loginOtpRoute);
app.use('/api/save-receipt', saveReceipt);
app.use('/api/save-receipt2', saveReceipt2);
app.use('/api/logout', logout);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
