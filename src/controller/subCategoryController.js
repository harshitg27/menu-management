const CategoryModel = require("../models/CategoryModel");
const SubCategoryModel = require("../models/SubCategoryModel");


const createSubCategory = async (req, res) => {
    const { name, image, description, taxApplicability, tax, categoryId } = req.body;

    try {
        // Find the parent category
        const category = await CategoryModel.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found Or Invalid Category Id' });
        }

        // Use category defaults for tax-related attributes if not provided
        const subCategory = await SubCategoryModel.create({
            name,
            image,
            description,
            taxApplicability: taxApplicability !== undefined ? taxApplicability : category.taxApplicability,
            tax: tax !== undefined ? tax : category.tax,
            categoryId,
        });

        res.status(201).json(subCategory);
    } catch (error) {
        console.error(error);

        // Handle validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors.map((err) => err.message),
            });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategoryModel.findAll();
        res.status(200).json(subCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getSubCategoriesUnderCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await CategoryModel.findByPk(categoryId, {
            include: [{ model: SubCategoryModel }],
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(category.SubCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getSubCategories = async (req, res) => {
    const { identifier } = req.params;

    try {
        let subCategory;
        // Check if identifier is numeric (ID) or string (Name)
        if (!isNaN(identifier)) {
            // Find by ID
            subCategory = await SubCategoryModel.findByPk(identifier);
        } else {
            // Find by Name
            subCategory = await SubCategoryModel.findOne({ where: { name: identifier } });
        }

        if (!subCategory) {
            return res.status(404).json({ error: 'Sub-category not found' });
        }

        res.status(200).json(subCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    const { name, image, description, taxApplicability, tax, categoryId } = req.body;

    try {
        // Find the sub-category
        const subCategory = await SubCategoryModel.findByPk(subCategoryId);

        if (!subCategory) {
            return res.status(404).json({ error: 'Sub-category not found' });
        }

        // If taxApplicability and tax are not provided, inherit from the category
        let updatedTaxApplicability = taxApplicability;
        let updatedTax = tax;

        // Logic for calulation of taxApplicability and tax
        if (taxApplicability === undefined || tax === undefined) {
            const category = await CategoryModel.findByPk(subCategory.categoryId);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            updatedTaxApplicability = taxApplicability !== undefined ? taxApplicability : category.taxApplicability;
            updatedTax = tax !== undefined ? tax : category.tax;
        }

        // Update sub-category attributes
        await subCategory.update({
            name: name || subCategory.name,
            image: image || subCategory.image,
            description: description || subCategory.description,
            taxApplicability: updatedTaxApplicability,
            tax: updatedTax,
            categoryId: categoryId || subCategory.categoryId,
        });

        res.status(200).json({ message: 'Sub-category updated successfully', subCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createSubCategory,
    getAllSubCategories,
    getSubCategoriesUnderCategory,
    getSubCategories,
    updateSubCategory
}