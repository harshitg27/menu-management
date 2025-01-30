const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CategoryModel = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true, // Ensures the image is a valid URL
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    taxApplicability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    tax: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            isFloat: true,
        },
    },
    taxType: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: true,
    },
}, {
    tableName: 'categories',  // Specify the table name
    timestamps: false,      // Disable automatic timestamp fields (createdAt, updatedAt)
});

// Apply a hook to validate conditional fields
CategoryModel.addHook('beforeValidate', (category) => {
    if (category.taxApplicability && (category.tax === null || category.taxType === null)) {
        throw new Error('Tax and Tax Type are required when taxApplicability is true');
    }
});

// Table Created Throw sync methods
// Category.sync().then(() => {
//     console.log('Category Table created successfully!');
// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });

module.exports = CategoryModel;
