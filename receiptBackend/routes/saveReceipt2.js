const express = require('express');
const router = express.Router();

// API endpoint to save receipt
router.post('/', (req, res) => {
    const db = req.app.get('db'); // Access the shared DB connection from server.js
    const receipts = req.body;

    // Insert each receipt into the database
    const sql = `
        INSERT INTO receiptsdata 
        (receiptNo, date, receivedFrom, amountInWords, totalCourseFees, courseFees, cgst, sgst, totalValue, modofPayment, courseName, createdDate, excelFileName) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    receipts.forEach(receipt => {
        const createdDate = new Date(); // Get the current date and time

        const values = [
            receipt.receiptNo,
            receipt.date,
            receipt.receivedFrom,
            receipt.amountInWords,
            receipt.totalCourseFees,
            receipt.courseFees,
            receipt.cgst,
            receipt.sgst,
            receipt.totalValue,
            receipt.modofPayment,
            receipt.courseName,
            createdDate,
            receipt.excelFileName, // Include the file name in the values array
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Failed to insert receipt:', err);
                return res.status(500).json({ message: 'Error saving receipt data' });
            }
        });
    });

    res.json({ message: 'All receipts saved successfully!' });
});

module.exports = router;
