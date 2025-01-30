const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./CategoryModel');

const SubCategoryModel = sequelize.define('SubCategory', {
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
        allowNull: false,
    },
    taxApplicability: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    tax: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    timestamps: false,      // Disable automatic timestamp fields (createdAt, updatedAt)
});

// Relations between Category and SubCategory with foreignKey
Category.hasMany(SubCategoryModel, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
SubCategoryModel.belongsTo(Category, { foreignKey: 'categoryId' });

// SubCategoryModel.sync().then(() => {
//     console.log('SubCategory Table created successfully!');
// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });
module.exports = SubCategoryModel;
