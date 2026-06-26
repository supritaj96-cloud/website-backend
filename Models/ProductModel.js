const { DataTypes } = require('sequelize');
const db = require('../Config/db');

const Product = db.sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,

    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stock: {
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },

});


module.exports = Product;
