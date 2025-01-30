const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./CategoryModel');
const SubCategoryModel = require('./SubCategoryModel');

const ItemModel = sequelize.define('Item', {
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
            isUrl: true,
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    taxApplicability: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    tax: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    baseAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: false,      // Disable automatic timestamp fields (createdAt, updatedAt)
});

// Relations between category and SubCategory with Items Tables with foreign Key
Category.hasMany(ItemModel, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
SubCategoryModel.hasMany(ItemModel, { foreignKey: 'subCategoryId', onDelete: 'CASCADE' });
ItemModel.belongsTo(Category, { foreignKey: 'categoryId' });
ItemModel.belongsTo(SubCategoryModel, { foreignKey: 'subCategoryId' });

// ItemModel.sync().then(() => {
//     console.log('Items Table created successfully!');
// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });

module.exports = ItemModel;
