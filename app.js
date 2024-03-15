const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const session = require("express-session");
const bcrypt = require("bcrypt");

const db = require('./utils/db');
const User = require('./modals/user');
const Expense = require('./modals/expense');
const Order = require("./modals/order");
const resetPassword = require("./modals/resetPassword");
const expenseroutes = require('./Router/expenseroutes')
const userrouter = require('./Router/userrouter')
const purchaserouter = require('./Router/purchaseroutes')
const premiumrouter = require('./Router/premiumrouter')
const forgotPasswordrout = require('./Router/forgotPasswordrout')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(
//     session({
//       secret: " ",
//       resave: false,
//       saveUninitialized: true,
//     })
//   );


app.use(express.static(path.join(__dirname, 'views')));




  app.use('/', userrouter)
  app.use('/', expenseroutes)
  app.use('/', purchaserouter)
  app.use('/', premiumrouter)
  app.use('/', forgotPasswordrout)

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });
  
  app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'views', 'login.html'));
    });

   
    User.hasMany(Expense);
    Expense.belongsTo(User)

    User.hasMany(Order);
    Order.belongsTo(User)

    
User.hasMany(resetPassword)
resetPassword.belongsTo(User)

db.sync()
  .then(() => {
    console.log('Sequelize sync successful');
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch((error) => console.error('Error syncing database:', error));
