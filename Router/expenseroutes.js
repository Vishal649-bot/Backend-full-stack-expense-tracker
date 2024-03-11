const express = require('express');
const router = express.Router();
const path = require('path');
const expenseModale = require('../modals/expense')

router.get('/expense', (req, res) => {
    // Send the HTML file as a response
    res.sendFile(path.join(__dirname, '..', 'views', 'expense.html'));
});

router.post('/expense/addexpense', async (req, res) => {
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
        });

        res.json({ success: true, message: 'Expense added successfully!', expense: newExpense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

router.get('/expense/api', (req, res) => {
    // Send the HTML file as a response
    expenseModale.findAll()
    .then(expense =>{
        console.log(expense);
        res.json(expense)
    })
    .catch(err => {
        console.log(err);
    })
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
