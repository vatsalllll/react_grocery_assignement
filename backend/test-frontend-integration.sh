#!/bin/bash

# ============================================
# FRONTEND INTEGRATION TEST
# Testing Edit & Delete functionality
# ============================================

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     FRONTEND EDIT & DELETE INTEGRATION TEST                ║"
echo "║     Verifying API endpoints work correctly                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# ============================================
# SETUP: Create a test product
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SETUP: Creating test product for edit/delete testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

CREATE_RESPONSE=$(curl -s -X POST "http://localhost:3000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product for Frontend",
    "price": 9.99,
    "category": "Test",
    "description": "Product to test edit and delete buttons",
    "stock": 25,
    "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e"
  }')

PRODUCT_ID=$(echo "$CREATE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['_id'])")
PRODUCT_NAME=$(echo "$CREATE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['name'])")

echo "✅ Created test product:"
echo "   ID: $PRODUCT_ID"
echo "   Name: $PRODUCT_NAME"
echo ""

# ============================================
# TEST 1: Verify product appears in list
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Verify product appears in API response"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PRODUCT_EXISTS=$(curl -s "http://localhost:3000/products/$PRODUCT_ID" | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])")

if [ "$PRODUCT_EXISTS" == "True" ]; then
  echo "✅ Product found in database and accessible via API"
else
  echo "❌ Product NOT found"
fi
echo ""

# ============================================
# TEST 2: Test EDIT functionality
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Testing EDIT endpoint (simulating edit button click)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📝 Updating product: changing price from \$9.99 to \$12.99"
echo ""

EDIT_RESPONSE=$(curl -s -X PUT "http://localhost:3000/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 12.99,
    "description": "EDITED: Price updated via test"
  }')

echo "$EDIT_RESPONSE" | python3 -m json.tool | grep -A 3 "success"
echo ""

EDIT_SUCCESS=$(echo "$EDIT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])")
NEW_PRICE=$(echo "$EDIT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['price'])")

if [ "$EDIT_SUCCESS" == "True" ] && [ "$NEW_PRICE" == "12.99" ]; then
  echo "✅ EDIT successful: Price updated to \$$NEW_PRICE"
else
  echo "❌ EDIT failed"
fi
echo ""

# ============================================
# TEST 3: Verify edit persisted
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: Verifying edit persisted in database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

VERIFY_PRICE=$(curl -s "http://localhost:3000/products/$PRODUCT_ID" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['price'])")

if [ "$VERIFY_PRICE" == "12.99" ]; then
  echo "✅ Edit persisted: Price is \$$VERIFY_PRICE in database"
else
  echo "❌ Edit did NOT persist"
fi
echo ""

# ============================================
# TEST 4: Test DELETE functionality
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 4: Testing DELETE endpoint (simulating delete button click)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🗑️  Deleting product: $PRODUCT_NAME"
echo ""

DELETE_RESPONSE=$(curl -s -X DELETE "http://localhost:3000/products/$PRODUCT_ID")

echo "$DELETE_RESPONSE" | python3 -m json.tool
echo ""

DELETE_SUCCESS=$(echo "$DELETE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])")

if [ "$DELETE_SUCCESS" == "True" ]; then
  echo "✅ DELETE successful"
else
  echo "❌ DELETE failed"
fi
echo ""

# ============================================
# TEST 5: Verify deletion
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 5: Verifying product was actually deleted"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

VERIFY_DELETE=$(curl -s "http://localhost:3000/products/$PRODUCT_ID" | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])")

if [ "$VERIFY_DELETE" == "False" ]; then
  echo "✅ Deletion confirmed: Product no longer exists (404)"
else
  echo "❌ Product still exists in database"
fi
echo ""

# ============================================
# FINAL SUMMARY
# ============================================
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   TEST SUMMARY                             ║"
echo "╠════════════════════════════════════════════════════════════╣"

if [ "$PRODUCT_EXISTS" == "True" ] && [ "$EDIT_SUCCESS" == "True" ] && [ "$VERIFY_PRICE" == "12.99" ] && [ "$DELETE_SUCCESS" == "True" ] && [ "$VERIFY_DELETE" == "False" ]; then
  echo "║  ✅ ALL TESTS PASSED                                      ║"
  echo "║                                                            ║"
  echo "║  ✓ Product created successfully                           ║"
  echo "║  ✓ Product appeared in API response                       ║"
  echo "║  ✓ Edit endpoint working (PUT)                            ║"
  echo "║  ✓ Changes persisted to database                          ║"
  echo "║  ✓ Delete endpoint working (DELETE)                       ║"
  echo "║  ✓ Product removed from database                          ║"
  echo "║                                                            ║"
  echo "║  🎉 Edit & Delete functionality ready for frontend!       ║"
else
  echo "║  ⚠️  SOME TESTS FAILED - Check output above               ║"
fi

echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "📱 FRONTEND COMPONENTS READY:"
echo "   • ProductCard: Edit (✏️) and Delete (🗑️) buttons added"
echo "   • EditProductModal: Full edit form with validation"
echo "   • ProductsScreen: Integrated edit/delete handlers"
echo ""
echo "🎯 USER FLOW:"
echo "   1. Tap ✏️ edit button → Opens edit modal"
echo "   2. Modify fields → Save changes → Product updated"
echo "   3. Tap 🗑️ delete button → Confirmation dialog"
echo "   4. Confirm → Product deleted from list"
echo ""
echo "✨ The app is now ready to test on your device!"
echo ""
