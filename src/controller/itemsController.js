const CategoryModel = require("../models/CategoryModel");
const ItemModel = require("../models/ItemsModel");
const SubCategoryModel = require("../models/SubCategoryModel");
const { Op } = require('sequelize');

const createItem = async (req, res) => {
    const {
        name,
        image,
        description,
        taxApplicability,
        tax,
        baseAmount,
        discount,
        categoryId,
        subCategoryId,
    } = req.body;

    try {
        // Validate baseAmount and discount
        if (!baseAmount || baseAmount <= 0) {
            return res.status(400).json({ error: 'Base amount must be greater than zero' });
        }
        if (discount < 0 || discount > baseAmount) {
            return res.status(400).json({ error: 'Invalid discount value' });
        }

        // Calculate totalAmount
        const totalAmount = baseAmount - discount;
        
        // Check if the category or sub-category exists and put Correct Category id
        let correctCategoryId;
        if (subCategoryId) {
            const subCategory = await SubCategoryModel.findByPk(subCategoryId);
            if (!subCategory) {
                return res.status(404).json({ error: 'Sub-category not found' });
            }
            correctCategoryId = subCategory.categoryId;
        } else if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            correctCategoryId = categoryId;
        } else {
            return res.status(400).json({ error: 'Either categoryId or subCategoryId must be provided' });
        }

        // Create the item
        const item = await ItemModel.create({
            name,
            image,
            description,
            taxApplicability,
            tax,
            baseAmount,
            discount,
            totalAmount,
            categoryId: correctCategoryId,
            subCategoryId: subCategoryId || null,
        });

        res.status(201).json(item);
    } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors.map((err) => err.message),
            });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllItems = async (req, res) => {
    try {
        const items = await ItemModel.findAll();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getItemsUnderCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        // find category for check correct or not
        const category = await CategoryModel.findByPk(categoryId, {
            include: [{ model: ItemModel }],
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(category.Items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getItemsUnderSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;

    try {
        // find subCategory for check correct or not
        const subCategory = await SubCategoryModel.findByPk(subCategoryId, {
            include: [{ model: ItemModel }],
        });

        if (!subCategory) {
            return res.status(404).json({ error: 'Sub-category not found' });
        }

        res.status(200).json(subCategory.Items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getItem = async (req, res) => {
    const { identifier } = req.params;

    try {
        let item;

        // Check if identifier is numeric (ID) or string (Name)
        if (!isNaN(identifier)) {
            // Find by ID
            item = await ItemModel.findByPk(identifier);
        } else {
            // Find by Name
            item = await ItemModel.findOne({ where: { name: identifier } });
        }

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const searchItems = async (req, res) => {
    const { name } = req.query;

    // check search name is provide or not
    if (!name) {
        return res.status(400).json({ error: 'Please provide a Items Name for search' });
    }

    try {
        const items = await ItemModel.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`, // Case-insensitive partial search
                },
            },
        });

        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found' });
        }

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateItems = async (req, res) => {
    const { itemId } = req.params;
    const {
        name, image, description,
        taxApplicability, tax,
        baseAmount, discount,
        subCategoryId, categoryId
    } = req.body;

    try {
        // Find the item
        const item = await ItemModel.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Determine tax applicability and tax amount if not explicitly provided
        let updatedTaxApplicability = taxApplicability;
        let updatedTax = tax;

        if (taxApplicability === undefined || tax === undefined) {
            if (item.subCategoryId) {
                // If the item belongs to a sub-category, inherit tax settings from it
                const subCategory = await SubCategoryModel.findByPk(item.subCategoryId);
                if (subCategory) {
                    updatedTaxApplicability = taxApplicability !== undefined ? taxApplicability : subCategory.taxApplicability;
                    updatedTax = tax !== undefined ? tax : subCategory.tax;
                }
            } else if (item.categoryId) {
                // If the item belongs directly to a category, inherit tax settings from it
                const category = await CategoryModel.findByPk(item.categoryId);
                if (category) {
                    updatedTaxApplicability = taxApplicability !== undefined ? taxApplicability : category.taxApplicability;
                    updatedTax = tax !== undefined ? tax : category.tax;
                }
            }
        }

        // Calculate total amount (Base - Discount)
        let updatedTotalAmount ;
        if(baseAmount !== undefined && discount !== undefined){
            updatedTotalAmount = baseAmount - discount
        }else if(baseAmount !== undefined){
            if(baseAmount < item.discount || baseAmount <= 0){
                return res.status(400).json({ error: 'Base amount must be greater than zero or Greather Than Prev Discount' });
            }
            updatedTotalAmount = baseAmount - item.discount ;
        }else if(discount !== undefined){
            if(discount < 0 || discount > item.baseAmount){
                return res.status(400).json({ error: 'Discount Must be Greather or equal to zero or Less than prev Base Amount' });
            }
            updatedTotalAmount = item.baseAmount - discount
        }else{
            updatedTotalAmount = item.totalAmount; ;
        }
            

        // Update item attributes
        await item.update({
            name: name || item.name,
            image: image || item.image,
            description: description || item.description,
            taxApplicability: updatedTaxApplicability,
            tax: updatedTax,
            baseAmount: baseAmount !== undefined ? baseAmount : item.baseAmount,
            discount: discount !== undefined ? discount : item.discount,
            totalAmount: updatedTotalAmount,
            subCategoryId: subCategoryId || item.subCategoryId,
            categoryId: categoryId || item.categoryId,
        });

        res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createItem,
    getAllItems,
    getItemsUnderCategory,
    getItemsUnderSubCategory,
    getItem,
    updateItems,
    searchItems
}