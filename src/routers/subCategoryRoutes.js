const express = require('express');
const SubCategoryModel = require('../models/SubCategoryModel');
const { createSubCategory, 
    getAllSubCategories, 
    getSubCategoriesUnderCategory, 
    getSubCategories,
    updateSubCategory} = require('../controller/subCategoryController');
const router = express.Router();

//  Sub Category Routes
router.post('/create' , createSubCategory)
router.get('/getall' , getAllSubCategories)
router.get('/category/:categoryId' , getSubCategoriesUnderCategory)
router.get('/get/:identifier', getSubCategories);
router.put('/update/:subCategoryId' , updateSubCategory)

module.exports = router