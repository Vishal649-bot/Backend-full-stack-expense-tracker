const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const db = require('./utils/db');
const User = require('./modals/user');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'views')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

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

    const newUser = await User.create({
      name: name,
      email: email,
      password: password, // Remember to hash the password before storing it
    });

    res.json({ success: true, message: 'Signup successful!', user: newUser });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

db.sync()
  .then(() => {
    console.log('Sequelize sync successful');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => console.error('Error syncing database:', error));
