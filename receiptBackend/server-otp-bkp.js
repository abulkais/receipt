const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services
    auth: {
        user: 'training@kvch.in',
        pass: 'drlaeahqejaxtlhq'
    }
});

let otpStore = {}; // In-memory store for OTPs, use a persistent store in production

app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    // const otp = String(Math.floor(1000 + Math.random() * 9000)); // Generate a 4-digit OTP
    otpStore[email] = otp;
    // Send OTP email
    transporter.sendMail({
        from: 'KVCH VIJAY ARORA',
        to: email,
        subject: 'Your KVCH Receipt OTP for Login',
        // html: `Dear KVCH, <br> Use the OTP <strong>${otp}</strong> to log in to your KVCH account.<br>Regards, <br>Team KVCH`
        html:`<div style="background-color:#e0e0eb;width:1000px;padding:10px"><div style="background-color:#ffffff;width:500px;margin-left:200px;padding:50px"><div><img src="https://kvch.in/assets-new/img/website-logo.webp" width="200px" style="margin: 0 auto; display: block;"></div>
				<hr>
				<p style="font-size:17px;color:#000000">Dear <span style="font-weight:bold">KVCH</span></p>
				<p style="font-size:17px;color:#000000">Use the OTP <b>${otp}</b> to log in to your KVCH account.</p>
				<p style="font-size:17px;color:#000000">Regards,</p>
				<p style="font-size:17px;color:#000000">Team KVCH</p><font color="#888888">
				</font></div></div>`
    }, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending OTP');
        }
        res.send('OTP sent');
    });
});



app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] === parseInt(otp, 10)) { // 6 digit otp
        // if (otpStore[email] === otp) {  4 digit otp
        delete otpStore[email]; // Clear OTP after successful verification
        res.send('OTP verified');
    } else {
        res.status(400).send('Invalid OTP');
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) return res.status(500).send('Server error');

        if (results.length > 0) {
            res.send('Login successful, please enter OTP');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
