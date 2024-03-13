const express = require('express');
const router = express.Router();

const purchasecontroller = require('../controllers/purchase');
const userautherization =  require('../middleware/auth')

// const expenseModale = require('../modals/expense')

router.post('/payment/purchasemembership',userautherization ,purchasecontroller.purchaseMembership);
router.post('/payment/success', userautherization ,purchasecontroller.successfulTransaction);
router.post('/payment/failed', userautherization, purchasecontroller.failedTransaction);

module.exports = router