const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../modals/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post('/users/signup', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const existingUser = await User.findOne({
        where: {
          email: email,
        },
      });
  
      if (existingUser) {
        console.log('User already registered. Please login.');
        return res.status(400).json({ error: 'User already registered. Please login.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword, // Remember to hash the password before storing it
      });
  
      res.json({ success: true, message: 'Signup successful!', user: newUser });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
  
  function generateAccessToken(id) {
    return jwt.sign({ userId: id }, "secretKey");
  }
  
router.post('/users/login', async (req, res) => {
    try {
        // console.log(req.body);
      const { email, password } = req.body;
        
      const user = await User.findOne({
        where: {
          email: email,
          // You should hash the password and compare it securely
        },
      });
  
      if (!user) {
        console.log('Invalid email or password.');
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          console.log('Invalid email or password.');
          return res.status(400).json({ error: 'Invalid email or password.' });
      }
  
      console.log('User logged in successfully.');
      res.json({ success: true, message: 'Login successful!', user: user, token: generateAccessToken(user.id) });
      
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

module.exports = router;