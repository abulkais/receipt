const express = require('express');
const router = express.Router();

// API endpoint to save receipt
router.post('/', (req, res) => {
    const db = req.app.get('db'); // Access the shared DB connection from server.js
    const receipt = req.body;

    const sql = `INSERT INTO receiptsdata (receiptNo, date, receivedFrom, amountInWords, totalCourseFees, 
        modofPayment, courseName, courseFees, cgst, sgst) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const createdDate = new Date(); // Get the current date and time

    const values = [
        receipt.receiptNo || '', // default to empty string if undefined
        receipt.date || '',
        receipt.receivedFrom || '',
        receipt.amountInWords || '',
        receipt.totalCourseFees || '',
        receipt.modofPayment || '',
        receipt.courseName || '',
        parseFloat(receipt.courseFees) || 0,
        parseFloat(receipt.cgst) || 0,
        parseFloat(receipt.sgst) || 0,
        createdDate
    ];

    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error saving receipt data:', error);
            return res.status(500).json({ message: 'Failed to save receipt data' });
        }
        res.status(200).json({ message: 'Receipt saved successfully' });
    });
});

module.exports = router;
