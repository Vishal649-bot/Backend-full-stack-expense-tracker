const express = require('express');
const router = express.Router();
const sib = require('sib-api-v3-sdk');
require('dotenv').config();

const User = require('../modals/user');

router.post('/forgot-password', async (req, res) => {
    try {
        // console.log('sibbbbbbbb', sib);
        const email = req.body.email;
        console.log(process.env.BREVO_API_KEY);
        console.log(email);

        const user = await User.findOne({ where: { email: email } });
        if (!user)
            return res.status(404).json({ success: false, msg: "Email not found" });

        const client = sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const transEmailApi = new sib.TransactionalEmailsApi();

        const sender = { "email": "vishalkumaretahkash@gmail.com" };
        const receiver = [{ "email": email }];

        const response = await transEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: 'Password Reset',
            htmlContent: '<p>Click the link to reset your password</p>'
        });

        console.log(response);
        return res.json({ success: true, msg: "Password reset email sent" });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
});

module.exports = router;