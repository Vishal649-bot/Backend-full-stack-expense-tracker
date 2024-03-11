const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const session = require("express-session");
const bcrypt = require("bcrypt");

const db = require('./utils/db');
const User = require('./modals/user');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    session({
      secret: " ",
      resave: false,
      saveUninitialized: true,
    })
  );


app.use(express.static(path.join(__dirname, 'views')));

app.post('/users/signup', async (req, res) => {
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

//login

app.post('/users/login', async (req, res) => {
    try {
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
      res.json({ success: true, message: 'Login successful!', user: user });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
  


  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });
  
  app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'views', 'login.html'));
    });
  

db.sync()
  .then(() => {
    console.log('Sequelize sync successful');
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch((error) => console.error('Error syncing database:', error));
