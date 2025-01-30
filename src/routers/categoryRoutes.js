const express = require('express');
const { createCategory, getAllCategory, findCataegory, updateCategory } = require('../controller/CategoryController');
const router = express.Router();


// Routes For Categories
router.post('/create', createCategory);
router.get('/getall', getAllCategory);
router.get('/get/:identifier', findCataegory);
router.put('/update/:categoryId' , updateCategory);

module.exports = router 