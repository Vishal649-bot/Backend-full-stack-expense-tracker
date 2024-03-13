const express = require('express');
const router = express.Router();
const path = require('path');
const expenseModale = require('../modals/expense')
const jwt = require("jsonwebtoken");
const userautherization =  require('../middleware/auth')

router.get('/expense', (req, res) => {
    // Send the HTML file as a response
    res.sendFile(path.join(__dirname, '..', 'views', 'expense.html'));
});

router.post('/expense/addexpense', async (req, res) => {
    const token = req.header("Authorization");
    console.log(token);
    const tokenParts = token.split(" ");
    const decoded = jwt.verify(tokenParts[1], "secretKey")
    const userId = decoded.userId;
    console.log(userId);
    try {
        const { amount, description, category } = req.body;
        console.log(req.body);
        console.log(amount);
        console.log(description);
        console.log(category);
        
        // Validate if required fields are present
        if (!amount || !description || !category) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        // Create a new expense entry
        const newExpense = await expenseModale.create({
            expense: amount,
            description: description,
            category: category,
            userSignupId: userId
        });

        res.json({ success: true, message: 'Expense added successfully!', expense: newExpense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

router.get('/expense/api', userautherization, (req, res) => {
    // Send the HTML file as a response
   const userId = req.user.id;

    // Find expenses associated with the user ID
    expenseModale.findAll({
        where: {
            userSignupId: userId
        }
    })
    .then(expenses => {
        console.log(expenses);
        res.json(expenses);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    });
});

router.delete('/expense/api/:id', async(req, res) => {
    const expenseId = req.params.id;
    // Send the HTML file as a response
    try {
        // Find the book by ID and delete it from the database
        const deletedexpense = await expenseModale.destroy({
            where: {
                id: expenseId
            }
        });

        if (deletedexpense) {
            res.status(200).json({ message: 'Book deleted successfully' });
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
