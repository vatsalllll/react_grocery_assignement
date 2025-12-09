#!/bin/bash

# ============================================
# PUT ENDPOINT TEST SUITE
# Testing PUT /products/:id endpoint
# ============================================

echo "========================================"
echo "PUT ENDPOINT TESTS"
echo "========================================"
echo ""

# Get a valid product ID for testing
VALID_ID="693723d91d313b6926e66d7c"

echo "Test 1: ✅ SUCCESS - Update product price only (partial update)"
echo "Command: curl -X PUT http://localhost:3000/products/$VALID_ID -H 'Content-Type: application/json' -d '{\"price\": 9.99}'"
echo "Expected: 200 OK with updated product"
echo "Response:"
curl -X PUT "http://localhost:3000/products/$VALID_ID" \
  -H "Content-Type: application/json" \
  -d '{"price": 9.99}' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 2: ✅ SUCCESS - Update multiple fields"
echo "Command: curl -X PUT http://localhost:3000/products/$VALID_ID -H 'Content-Type: application/json' -d '{\"price\": 12.99, \"stock\": 150, \"description\": \"Updated description\"}'"
echo "Expected: 200 OK with all updated fields"
echo "Response:"
curl -X PUT "http://localhost:3000/products/$VALID_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 12.99,
    "stock": 150,
    "description": "Updated premium cheddar cheese"
  }' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 3: ❌ ERROR - Invalid product ID format"
echo "Command: curl -X PUT http://localhost:3000/products/invalid123 -H 'Content-Type: application/json' -d '{\"price\": 5.99}'"
echo "Expected: 400 Bad Request - Invalid ID format"
echo "Response:"
curl -X PUT "http://localhost:3000/products/invalid123" \
  -H "Content-Type: application/json" \
  -d '{"price": 5.99}' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 4: ❌ ERROR - Product not found (valid ID format but doesn't exist)"
echo "Command: curl -X PUT http://localhost:3000/products/507f1f77bcf86cd799439011 -H 'Content-Type: application/json' -d '{\"price\": 5.99}'"
echo "Expected: 404 Not Found"
echo "Response:"
curl -X PUT "http://localhost:3000/products/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{"price": 5.99}' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 5: ❌ ERROR - Negative price"
echo "Command: curl -X PUT http://localhost:3000/products/$VALID_ID -H 'Content-Type: application/json' -d '{\"price\": -10}'"
echo "Expected: 400 Bad Request - Price cannot be negative"
echo "Response:"
curl -X PUT "http://localhost:3000/products/$VALID_ID" \
  -H "Content-Type: application/json" \
  -d '{"price": -10}' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 6: ❌ ERROR - Empty product name"
echo "Command: curl -X PUT http://localhost:3000/products/$VALID_ID -H 'Content-Type: application/json' -d '{\"name\": \"\"}'"
echo "Expected: 400 Bad Request - Name cannot be empty"
echo "Response:"
curl -X PUT "http://localhost:3000/products/$VALID_ID" \
  -H "Content-Type: application/json" \
  -d '{"name": ""}' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 7: ❌ ERROR - Negative stock"
echo "Command: curl -X PUT http://localhost:3000/products/$VALID_ID -H 'Content-Type: application/json' -d '{\"stock\": -5}'"
echo "Expected: 400 Bad Request - Stock cannot be negative"
echo "Response:"
curl -X PUT "http://localhost:3000/products/$VALID_ID" \
  -H "Content-Type: application/json" \
  -d '{"stock": -5}' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 8: ❌ ERROR - Invalid price data type"
echo "Command: curl -X PUT http://localhost:3000/products/$VALID_ID -H 'Content-Type: application/json' -d '{\"price\": \"not-a-number\"}'"
echo "Expected: 400 Bad Request - Price must be a valid number"
echo "Response:"
curl -X PUT "http://localhost:3000/products/$VALID_ID" \
  -H "Content-Type: application/json" \
  -d '{"price": "not-a-number"}' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 9: ❌ ERROR - Trying to update createdAt field"
echo "Command: curl -X PUT http://localhost:3000/products/$VALID_ID -H 'Content-Type: application/json' -d '{\"createdAt\": \"2025-01-01\"}'"
echo "Expected: 400 Bad Request - Cannot update createdAt"
echo "Response:"
curl -X PUT "http://localhost:3000/products/$VALID_ID" \
  -H "Content-Type: application/json" \
  -d '{"createdAt": "2025-01-01"}' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "Test 10: ❌ ERROR - No fields provided for update"
echo "Command: curl -X PUT http://localhost:3000/products/$VALID_ID -H 'Content-Type: application/json' -d '{}'"
echo "Expected: 400 Bad Request - No valid fields provided"
echo "Response:"
curl -X PUT "http://localhost:3000/products/$VALID_ID" \
  -H "Content-Type: application/json" \
  -d '{}' \
  2>/dev/null | python3 -m json.tool
echo ""
echo "----------------------------------------"
echo ""

echo "✅ All PUT endpoint tests completed!"
echo ""
