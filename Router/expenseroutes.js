const express = require('express');
const router = express.Router();
const path = require('path');
const expenseModale = require('../modals/expense')
const jwt = require("jsonwebtoken");
const userautherization =  require('../middleware/auth');
const sequelize = require('../utils/db');

router.get('/expense', (req, res) => {
    // Send the HTML file as a response
    res.sendFile(path.join(__dirname, '..', 'views', 'expense.html'));
});

router.post('/expense/addexpense', async (req, res) => {
    let transaction;
    const token = req.header("Authorization");
    console.log(token);
    const tokenParts = token.split(" ");
    const decoded = jwt.verify(tokenParts[1], "secretKey")
    const userId = decoded.userId;
    console.log(userId);
    try {
        transaction = await sequelize.transaction();

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
        },{transaction});
        await transaction.commit()

        res.json({ success: true, message: 'Expense added successfully!', expense: newExpense });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.error('Error adding expense:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});



// const PAGE_SIZE = 10; // Number of expenses per page

router.get('/expense/api', userautherization, (req, res) => {
    const userId = req.user.id;
    let pageSize = parseInt(req.query.pageSize) || 5; // Get the requested page size, default to 5 if not provided
    const page = parseInt(req.query.page) || 1; // Get the requested page, default to 1 if not provided

    // Validate page size to avoid excessive load
    if (pageSize !== 5 && pageSize !== 10 && pageSize !== 25 && pageSize !== 50) {
        pageSize = 5; // Default to 5 if an invalid page size is provided
    }

    // Calculate offset to skip expenses for previous pages
    const offset = (page - 1) * pageSize;

    // Find expenses associated with the user ID with pagination
    expenseModale.findAndCountAll({
        where: {
            userSignupId: userId
        },
        limit: pageSize,
        offset: offset
    })
    .then(result => {
        const expenses = result.rows;
        const totalCount = result.count;
        const totalPages = Math.ceil(totalCount / pageSize);

        res.json({
            expenses: expenses,
            totalPages: totalPages,
            currentPage: page
        });
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
