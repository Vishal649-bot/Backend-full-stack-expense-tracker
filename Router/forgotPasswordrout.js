const express = require("express");
const router = express.Router();
const sib = require("sib-api-v3-sdk");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid"); // Import uuid
const jwt = require("jsonwebtoken");
const User = require("../modals/user");
const resetPassword = require("../modals/resetPassword");
const path = require('path')
const sequelize = require('../utils/db');
const bcrypt = require("bcrypt");

router.post("/forgot-password", async (req, res) => {
  try {
    // console.log('sibbbbbbbb', sib);
    const token = req.header("Authorization");
    console.log(token);
    const decoded = jwt.verify(token, "secretKey");
    const userId = decoded.userId;

    const email = req.body.email;
    console.log(process.env.BREVO_API_KEY);
    console.log(email);

    const user = await User.findOne({ where: { email: email } });
    if (!user)
      return res.status(404).json({ success: false, msg: "Email not found" });

    const client = sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const transEmailApi = new sib.TransactionalEmailsApi();

    const sender = { email: "vishalkumaretahkash@gmail.com" };
    const receiver = [{ email: email }];

    const uuid = uuidv4();

    const newResetPasswaord = await resetPassword.create(
      {
        id: uuid,
        isActive: true,
        userSignupId: userId,
      }
    );
    console.log(newResetPasswaord);
    const response = await transEmailApi.sendTransacEmail({
      sender,
      to: receiver,
      subject: "Password Reset",
      htmlContent: `<p>Click the link to reset your password</p><a href="http://localhost:3001/reset-password.html?reset=${uuid}">Reset Password</a>`,
    });

    console.log(response);
    return res.json({ success: true, msg: "Password reset email sent" });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
});


router.get(`/reset-password.html/`, (req, res) => {
  // Assuming resetPassword.html is in the root directory of your project
 
  res.sendFile(path.join(__dirname, "..", 'views',"reset-password.html"));
});


router.get("/check-password-link/:resetId", async (req, res) => {
  try {
    const resetUser = await resetPassword.findByPk(req.params.resetId);

    if (!resetUser) {
      return res.status(404).json({ success: false, msg: "Invalid link" });
    }

    return res.json({ isActive: resetUser.isActive });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
});




router.post("/reset-password/:resetId", async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const resetId = req.params.resetId;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    const resetUser = await resetPassword.findByPk(resetId);
    console.log(resetUser.dataValues.userSignupId);
    let userid = resetUser.dataValues.userSignupId
    const user = await User.findByPk(userid);
    // console.log('olduser',oldUser);

    if (!resetUser || !resetUser.isActive) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid or expired link" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(403).json({
        success: false,
        msg: "New and confirm passwords are different",
      });
    }

  
    const hash = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hash }, { transaction: t });
    await resetUser.update({ isActive: false }, { transaction: t });

    await t.commit();

    return res.json({ success: true, msg: "Password changed successfully" });
  } catch (e) {
    console.error(e);
    await t.rollback();
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
});

module.exports = router;
