const { DataTypes } = require('sequelize');
const db = require('../Config/db');

const Customer = db.sequelize.define('Customer', {
    id:{
         type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    address:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },

})
module.exports = Customer;


