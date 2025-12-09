#!/bin/bash

# ============================================
# DELETE ENDPOINT TEST SUITE
# Testing DELETE /products/:id endpoint
# ============================================

echo "========================================"
echo "DELETE ENDPOINT TESTS"
echo "========================================"
echo ""

# First, let's create a test product to delete
echo "Setup: Creating test products for deletion tests..."
echo "----------------------------------------"

TEST_PRODUCT_1=$(curl -s -X POST "http://localhost:3000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product for Deletion 1",
    "price": 5.99,
    "category": "Test",
    "description": "This product will be deleted",
    "stock": 10
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['_id'])")

TEST_PRODUCT_2=$(curl -s -X POST "http://localhost:3000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product for Deletion 2",
    "price": 7.99,
    "category": "Test",
    "description": "This product will also be deleted",
    "stock": 20
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['_id'])")

echo "✅ Created test products with IDs:"
echo "   Product 1: $TEST_PRODUCT_1"
echo "   Product 2: $TEST_PRODUCT_2"
echo ""
echo "========================================"
echo ""

echo "Test 1: ✅ SUCCESS - Delete existing product"
echo "Command: curl -X DELETE http://localhost:3000/products/$TEST_PRODUCT_1"
echo "Expected: 200 OK with success message and product name"
echo "Response:"
curl -X DELETE "http://localhost:3000/products/$TEST_PRODUCT_1" \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 2: ✅ SUCCESS - Delete another existing product"
echo "Command: curl -X DELETE http://localhost:3000/products/$TEST_PRODUCT_2"
echo "Expected: 200 OK with success message"
echo "Response:"
curl -X DELETE "http://localhost:3000/products/$TEST_PRODUCT_2" \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 3: ❌ ERROR - Try to delete already deleted product"
echo "Command: curl -X DELETE http://localhost:3000/products/$TEST_PRODUCT_1"
echo "Expected: 404 Not Found - Product already deleted"
echo "Response:"
curl -X DELETE "http://localhost:3000/products/$TEST_PRODUCT_1" \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 4: ❌ ERROR - Invalid product ID format"
echo "Command: curl -X DELETE http://localhost:3000/products/invalid-id-123"
echo "Expected: 400 Bad Request - Invalid ID format"
echo "Response:"
curl -X DELETE "http://localhost:3000/products/invalid-id-123" \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 5: ❌ ERROR - Product not found (valid ID format but doesn't exist)"
echo "Command: curl -X DELETE http://localhost:3000/products/507f1f77bcf86cd799439011"
echo "Expected: 404 Not Found"
echo "Response:"
curl -X DELETE "http://localhost:3000/products/507f1f77bcf86cd799439011" \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 6: ❌ ERROR - Very short invalid ID"
echo "Command: curl -X DELETE http://localhost:3000/products/abc"
echo "Expected: 400 Bad Request - Invalid ID format"
echo "Response:"
curl -X DELETE "http://localhost:3000/products/abc" \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 7: ❌ ERROR - ID with invalid characters"
echo "Command: curl -X DELETE http://localhost:3000/products/507f1f77bcf86cd79943901g"
echo "Expected: 400 Bad Request - Invalid ID format (contains 'g')"
echo "Response:"
curl -X DELETE "http://localhost:3000/products/507f1f77bcf86cd79943901g" \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "✅ All DELETE endpoint tests completed!"
echo ""

# Verify that products were actually deleted
echo "Verification: Checking if test products are actually gone from database..."
REMAINING_COUNT=$(curl -s "http://localhost:3000/products?q=Test%20Product%20for%20Deletion" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['products']))")
echo "Remaining test products in database: $REMAINING_COUNT"
if [ "$REMAINING_COUNT" -eq "0" ]; then
  echo "✅ Verification passed: All test products successfully deleted"
else
  echo "⚠️  Warning: $REMAINING_COUNT test products still in database"
fi
echo ""
