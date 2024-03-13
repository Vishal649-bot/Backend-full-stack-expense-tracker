const Sequelize = require('sequelize')

const sequelize = require('../utils/db')

const Order = sequelize.define('order' , {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement  : true , 
        primaryKey : true,
        allowNull : false

    },
    order_id : Sequelize.STRING,
    payment_id : Sequelize.STRING,
    status : Sequelize.STRING
})

module.exports = Order;