import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';

// API Configuration - Replace with your IP address
const API_BASE = 'http://10.51.2.187:3000'; // Your computer's IP address

const ProductsScreen = () => {
  // ============================================
  // SECTION 1: STATE MANAGEMENT
  // ============================================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState(null);

  // ============================================
  // SECTION 2: DATA FETCHING LOGIC
  // ============================================
  const fetchProducts = async () => {
    try {
      setError(''); // Clear any previous errors
      
      const response = await fetch(`${API_BASE}/products`);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle NEW pagination response structure: {success, products, pagination}
      if (data.success && data.products) {
        setProducts(data.products);
        setPagination(data.pagination); // Store pagination metadata
      } else if (data.success && data.data) {
        // Fallback for old response structure
        setProducts(data.data);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // ============================================
  // SECTION 3: CONDITIONAL RENDERING
  // ============================================
  
  // Loading State
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  // Error State
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Make sure your backend server is running on {API_BASE}
        </Text>
      </View>
    );
  }

  // ============================================
  // SECTION 4: PRODUCT CARD DESIGN
  // ============================================
  
  const renderProductCard = ({ item }) => (
    <View style={styles.card}>
      {/* Product Image */}
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/72' }}
        style={styles.productImage}
        resizeMode="cover"
      />
      
      {/* Product Details */}
      <View style={styles.productDetails}>
        {/* Product Name */}
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        
        {/* Category and Price Row */}
        <View style={styles.categoryPriceRow}>
          <Text style={styles.categoryText}>{item.category || 'Uncategorized'}</Text>
          <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
        </View>
        
        {/* Stock Information */}
        <View style={styles.stockRow}>
          <View style={[
            styles.stockBadge,
            item.stock > 0 ? styles.stockInStock : styles.stockOutOfStock
          ]}>
            <Text style={styles.stockText}>
              {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Empty state
  if (products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>No products found</Text>
        <Text style={styles.emptyHint}>Add some products to get started</Text>
      </View>
    );
  }

  // ============================================
  // SUCCESS STATE: FLATLIST WITH PRODUCTS
  // ============================================
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grocery Products</Text>
        <Text style={styles.headerSubtitle}>
          {products.length} items shown
          {pagination && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
        </Text>
        {pagination && (
          <View style={styles.paginationInfo}>
            <Text style={styles.paginationText}>
              Total: {pagination.totalItems} products
            </Text>
            {pagination.hasNextPage && (
              <Text style={styles.paginationBadge}>More available</Text>
            )}
          </View>
        )}
      </View>
      
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// ============================================
// DETAILED STYLING
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header Styles
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e8f5e9',
  },
  paginationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  paginationText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  paginationBadge: {
    fontSize: 11,
    color: '#4CAF50',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  
  // Center Container (Loading/Error/Empty)
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  
  // Loading State
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  
  // Error State
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Empty State
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#666',
  },
  
  // FlatList Container
  listContainer: {
    padding: 16,
  },
  
  // Product Card Styles
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  
  // Product Image
  productImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  
  // Product Details Container
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  
  // Product Name
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  
  // Category and Price Row
  categoryPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 13,
    color: '#666',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  
  // Stock Row
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockInStock: {
    backgroundColor: '#e8f5e9',
  },
  stockOutOfStock: {
    backgroundColor: '#ffebee',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
});

export default ProductsScreen;
