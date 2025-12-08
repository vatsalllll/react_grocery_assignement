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

module.exports = router;
