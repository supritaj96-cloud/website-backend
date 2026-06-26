const { DataTypes } = require('sequelize');
const db = require('../Config/db');

const Admin = db.sequelize.define('Admin', {
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
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Administrator',
    },
})
module.exports = Admin;


