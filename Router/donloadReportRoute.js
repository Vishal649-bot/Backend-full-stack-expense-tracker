const express = require('express');
const router = express.Router();
const path = require('path');
const expenseModale = require('../modals/expense')
const jwt = require("jsonwebtoken");
const userautherization =  require('../middleware/auth');
const sequelize = require('../utils/db');
const download = require('../modals/download');

router.post('/postfileurl',userautherization, async(req, res) => {
    try {
        // Assuming the fileUrl is sent in the request body
        const { fileUrl } = req.body;
        const id = req.user.id
        console.log(id);

        // You may use the fileUrl received here for further processing
        console.log('Received fileUrl:', fileUrl);
        
        const newdownload = await download.create({
            url: fileUrl,
            userSignupId: id
        })

        // Example: Saving fileUrl to the database
        // const expense = await expenseModel.create({ fileUrl, userId: req.user.id });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error occurred while processing fileUrl:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
   
});

router.get('/getfileurl',userautherization, async(req, res) => {
    try{
    const id =   req.user.id;
    const downloaddata = await download.findAll({
        where: {
            userSignupId : id,
          // You should hash the password and compare it securely
        },
      });
      console.log(downloaddata);
      return res.status(200).json({ success: true, downloaddata });
    }catch (error) {
        console.error("Error occurred while fetching file URLs:", error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
})

module.exports = router;