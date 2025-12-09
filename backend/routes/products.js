const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * GET /products
 * List all products with optional query support
 * Query params:
 *   - q: Search term for product name and description (case-insensitive)
 *   - category: Filter by exact category match
 *   - page: Page number (default 1)
 *   - limit: Items per page (default 10, max 100)
 * Returns: Paginated products with metadata
 */
router.get('/', async (req, res) => {
  try {
    // ============================================
    // STEP 1: PAGINATION PARAMETERS
    // ============================================
    
    // Parse and validate page parameter (default to 1)
    const page = parseInt(req.query.page) || 1;
    if (page < 1) {
      return res.status(400).json({
        success: false,
        error: 'Page number must be greater than 0'
      });
    }
    
    // Parse and validate limit parameter (default to 10, max 100)
    let limit = parseInt(req.query.limit) || 10;
    if (limit < 1) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be greater than 0'
      });
    }
    if (limit > 100) {
      limit = 100; // Cap at 100
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // ============================================
    // STEP 2: BUILD QUERY FILTERS
    // ============================================
    
    const query = {};
    
    // Search by name AND description (case-insensitive regex with $or)
    if (req.query.q) {
      query.$or = [
        { name: { $regex: req.query.q, $options: 'i' } },
        { description: { $regex: req.query.q, $options: 'i' } }
      ];
    }
    
    // Filter by category (exact match)
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // ============================================
    // STEP 3: EXECUTE QUERIES
    // ============================================
    
    // Get total count of documents matching the query (for pagination metadata)
    const totalItems = await Product.countDocuments(query);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    // Execute query with pagination and sorting
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first
    
    // ============================================
    // STEP 4: RETURN RESPONSE WITH METADATA
    // ============================================
    
    res.status(200).json({
      success: true,
      products: products,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    // Handle any database or server errors
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching products',
      message: error.message
    });
  }
});

/**
 * ENDPOINT 2: GET /products/:id
 * Get a single product by MongoDB _id
 * Handles:
 *   - 404 when product not found
 *   - Invalid ID format errors
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    // MongoDB ObjectId is 24 hex characters
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format',
        message: 'Product ID must be a valid MongoDB ObjectId (24 hex characters)'
      });
    }
    
    // Find product by ID
    const product = await Product.findById(id);
    
    // Handle product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `No product found with ID: ${id}`
      });
    }
    
    // Return successful response
    res.status(200).json({
      success: true,
      data: product
    });
    
  } catch (error) {
    // Handle any database or server errors
    console.error('Error fetching product by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching product',
      message: error.message
    });
  }
});

/**
 * ENDPOINT 3: POST /products
 * Create a new product
 * Validates:
 *   - Required fields: name, price
 *   - Returns 201 on success
 *   - Proper error messages on validation failure
 */
router.post('/', async (req, res) => {
  try {
    const { name, price, imageUrl, category, description, stock } = req.body;
    
    // Manual validation for required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Product name is required and cannot be empty'
      });
    }
    
    if (price === undefined || price === null || price === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Product price is required'
      });
    }
    
    if (typeof price !== 'number' && isNaN(Number(price))) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Product price must be a valid number'
      });
    }
    
    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Product price cannot be negative'
      });
    }
    
    // Create new product
    const newProduct = await Product.create({
      name: name.trim(),
      price: Number(price),
      imageUrl: imageUrl || null,
      category: category || null,
      description: description || null,
      stock: stock !== undefined ? Number(stock) : 0
    });
    
    // Return 201 Created status with new product
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
    
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: messages.join(', ')
      });
    }
    
    // Handle duplicate key errors (if you add unique indexes)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate entry',
        message: 'A product with this information already exists'
      });
    }
    
    // Handle any other database or server errors
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating product',
      message: error.message
    });
  }
});

/**
 * ENDPOINT 4: PUT /products/:id
 * Update an existing product (partial updates supported)
 * Validates:
 *   - Product exists (404 if not found)
 *   - ID format is valid MongoDB ObjectId
 *   - Data types are correct if fields are provided
 *   - Price and stock must be positive numbers if provided
 *   - Name cannot be empty string if provided
 *   - createdAt field cannot be updated
 * Returns:
 *   - Updated product document with { new: true }
 *   - 404 if product not found
 *   - 400 for validation errors
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // ============================================
    // STEP 1: VALIDATE MONGODB OBJECTID FORMAT
    // ============================================
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format',
        message: 'Product ID must be a valid MongoDB ObjectId (24 hex characters)'
      });
    }
    
    // ============================================
    // STEP 2: VALIDATE REQUEST BODY
    // ============================================
    const { name, price, imageUrl, category, description, stock, createdAt } = req.body;
    
    // Don't allow updating createdAt
    if (createdAt !== undefined) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Cannot update createdAt field'
      });
    }
    
    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Product name cannot be empty'
        });
      }
    }
    
    // Validate price if provided
    if (price !== undefined) {
      if (typeof price !== 'number' && isNaN(Number(price))) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Product price must be a valid number'
        });
      }
      
      if (Number(price) < 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Product price cannot be negative'
        });
      }
    }
    
    // Validate stock if provided
    if (stock !== undefined) {
      if (typeof stock !== 'number' && isNaN(Number(stock))) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Stock must be a valid number'
        });
      }
      
      if (Number(stock) < 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Stock cannot be negative'
        });
      }
    }
    
    // ============================================
    // STEP 3: BUILD UPDATE OBJECT
    // ============================================
    const updateData = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (stock !== undefined) updateData.stock = Number(stock);
    
    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'No valid fields provided for update'
      });
    }
    
    // ============================================
    // STEP 4: UPDATE PRODUCT IN DATABASE
    // ============================================
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true,           // Return the updated document
        runValidators: true  // Run mongoose schema validators
      }
    );
    
    // Check if product was found
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `No product found with ID: ${id}`
      });
    }
    
    // ============================================
    // STEP 5: RETURN SUCCESS RESPONSE
    // ============================================
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
    
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: messages.join(', ')
      });
    }
    
    // Handle CastError (invalid MongoDB ID format that passed regex but still invalid)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'Invalid product ID format'
      });
    }
    
    // Handle any other database or server errors
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating product',
      message: error.message
    });
  }
});

/**
 * ENDPOINT 5: DELETE /products/:id
 * Delete a product by ID
 * Validates:
 *   - Product exists (404 if not found)
 *   - ID format is valid MongoDB ObjectId
 * Returns:
 *   - Success message with deleted product's name
 *   - 404 if product not found
 *   - 400 for invalid ID format
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // ============================================
    // STEP 1: VALIDATE MONGODB OBJECTID FORMAT
    // ============================================
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format',
        message: 'Product ID must be a valid MongoDB ObjectId (24 hex characters)'
      });
    }
    
    // ============================================
    // STEP 2: FIND AND DELETE PRODUCT
    // ============================================
    // Use findByIdAndDelete to get the product data before deletion
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    // Check if product was found
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `No product found with ID: ${id}`
      });
    }
    
    // ============================================
    // STEP 3: RETURN SUCCESS RESPONSE
    // ============================================
    res.status(200).json({
      success: true,
      message: `Product "${deletedProduct.name}" deleted successfully`,
      data: {
        id: deletedProduct._id,
        name: deletedProduct.name,
        deletedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    // Handle CastError (invalid MongoDB ID format that passed regex but still invalid)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'Invalid product ID format'
      });
    }
    
    // Handle any other database or server errors
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting product',
      message: error.message
    });
  }
});

module.exports = router;
