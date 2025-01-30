const express = require('express');
const { createItem, getAllItems, getItemsUnderCategory, getItemsUnderSubCategory, getItem, searchItems } = require('../controller/itemsController');
const router = express.Router();

// Routes for Items
router.post('/create' , createItem) ;
router.get('/getall' , getAllItems) ;
router.get('/category/:categoryId' , getItemsUnderCategory)
router.get('/subcategory/:subCategoryId' , getItemsUnderSubCategory)
router.get('/get/:identifier', getItem);
router.get('/search', searchItems);

module.exports = router