const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'training@kvch.in',
        pass: 'drlaeahqejaxtlhq'
    }
});

let otpStore = {}; // In-memory store for OTPs

// API endpoint to send OTP
router.post('/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    otpStore[email] = otp;

    transporter.sendMail({
        from: 'KVCH VIJAY ARORA',
        to: email,
        subject: 'Your KVCH Receipt OTP for Login',
        html: `<div style="background-color:#e0e0eb;width:1000px;padding:10px">
                <div style="background-color:#ffffff;width:500px;margin-left:200px;padding:50px">
                    <div><img src="https://kvch.in/assets-new/img/website-logo.webp" width="200px" style="margin: 0 auto; display: block;"></div>
                    <hr>
                    <p style="font-size:17px;color:#000000">Dear <span style="font-weight:bold">KVCH</span></p>
                    <p style="font-size:17px;color:#000000">Use the OTP <b>${otp}</b> to log in to your KVCH account.</p>
                    <p style="font-size:17px;color:#000000">Regards,</p>
                    <p style="font-size:17px;color:#000000">Team KVCH</p>
                </div>
            </div>`
    }, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending OTP');
        }
        res.send('OTP sent');
    });
});

// API endpoint to verify OTP
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] === parseInt(otp, 10)) {
        delete otpStore[email]; // Clear OTP after successful verification
        res.send('OTP verified');
    } else {
        res.status(400).send('Invalid OTP');
    }
});

// API endpoint for login
router.post('/login', (req, res) => {
    const db = req.app.get('db'); // Access the DB connection from the app
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            res.send('Login successful, please enter OTP');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

module.exports = router;
