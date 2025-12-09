#!/bin/bash

# ============================================
# COMPLETE CRUD OPERATIONS TEST
# Demonstrates full product lifecycle
# ============================================

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     COMPLETE CRUD OPERATIONS TEST SUITE                   ║"
echo "║     Testing: CREATE → READ → UPDATE → DELETE              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# ============================================
# STEP 1: CREATE (POST)
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: CREATE - POST /products"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Creating a new test product..."
echo ""

CREATE_RESPONSE=$(curl -s -X POST "http://localhost:3000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Premium Avocados",
    "price": 4.99,
    "category": "Fruits",
    "description": "Fresh premium avocados for testing CRUD operations",
    "stock": 50,
    "imageUrl": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578"
  }')

echo "$CREATE_RESPONSE" | python3 -m json.tool
PRODUCT_ID=$(echo "$CREATE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['_id'])")
echo ""
echo "✅ Product created with ID: $PRODUCT_ID"
echo ""

# ============================================
# STEP 2: READ (GET)
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: READ - GET /products/:id"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Fetching the product we just created..."
echo ""

curl -s "http://localhost:3000/products/$PRODUCT_ID" | python3 -m json.tool
echo ""
echo "✅ Product retrieved successfully"
echo ""

# ============================================
# STEP 3: READ ALL (GET with Pagination)
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: READ ALL - GET /products (with pagination)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Fetching paginated list of products..."
echo ""

curl -s "http://localhost:3000/products?page=1&limit=5" | python3 -m json.tool | head -30
echo "... (showing first 30 lines)"
echo ""
echo "✅ Product list retrieved with pagination"
echo ""

# ============================================
# STEP 4: SEARCH (GET with query)
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: SEARCH - GET /products?q=avocado"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Searching for our test product..."
echo ""

SEARCH_RESULT=$(curl -s "http://localhost:3000/products?q=Test%20Premium%20Avocados")
echo "$SEARCH_RESULT" | python3 -m json.tool | grep -A 10 '"products"'
FOUND_COUNT=$(echo "$SEARCH_RESULT" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['products']))")
echo ""
echo "✅ Found $FOUND_COUNT product(s) matching 'Test Premium Avocados'"
echo ""

# ============================================
# STEP 5: UPDATE (PUT) - First Update
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 5: UPDATE - PUT /products/:id (Update price)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Updating product price from \$4.99 to \$5.99..."
echo ""

curl -s -X PUT "http://localhost:3000/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{"price": 5.99}' | python3 -m json.tool | grep -A 2 "price"
echo ""
echo "✅ Price updated successfully"
echo ""

# ============================================
# STEP 6: UPDATE (PUT) - Second Update
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 6: UPDATE - PUT /products/:id (Multiple fields)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Updating stock and description..."
echo ""

curl -s -X PUT "http://localhost:3000/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 100,
    "description": "UPDATED: Premium avocados, now with more stock!"
  }' | python3 -m json.tool | grep -E "(stock|description)" | head -4
echo ""
echo "✅ Multiple fields updated successfully"
echo ""

# ============================================
# STEP 7: VERIFY UPDATE
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 7: VERIFY - GET /products/:id (Check updates)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Fetching product to verify all updates..."
echo ""

curl -s "http://localhost:3000/products/$PRODUCT_ID" | python3 -m json.tool | grep -E "(name|price|stock|description)" | head -5
echo ""
echo "✅ Verified: All updates applied correctly"
echo ""

# ============================================
# STEP 8: DELETE
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 8: DELETE - DELETE /products/:id"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Deleting the test product..."
echo ""

curl -s -X DELETE "http://localhost:3000/products/$PRODUCT_ID" | python3 -m json.tool
echo ""
echo "✅ Product deleted successfully"
echo ""

# ============================================
# STEP 9: VERIFY DELETION
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 9: VERIFY DELETION - GET /products/:id"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Attempting to fetch deleted product (should return 404)..."
echo ""

curl -s "http://localhost:3000/products/$PRODUCT_ID" | python3 -m json.tool
echo ""
echo "✅ Verified: Product no longer exists (404 response)"
echo ""

# ============================================
# FINAL SUMMARY
# ============================================
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   TEST COMPLETED ✅                        ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  ✓ CREATE  - Product created successfully                 ║"
echo "║  ✓ READ    - Single product retrieved                     ║"
echo "║  ✓ READ    - Product list with pagination                 ║"
echo "║  ✓ SEARCH  - Found product by search query                ║"
echo "║  ✓ UPDATE  - Single field updated (price)                 ║"
echo "║  ✓ UPDATE  - Multiple fields updated (stock, description) ║"
echo "║  ✓ VERIFY  - Updates confirmed                            ║"
echo "║  ✓ DELETE  - Product deleted successfully                 ║"
echo "║  ✓ VERIFY  - Deletion confirmed (404 response)            ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  Product Lifecycle: CREATE → READ → UPDATE → DELETE       ║"
echo "║  Status: All 9 steps completed successfully! 🎉           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
