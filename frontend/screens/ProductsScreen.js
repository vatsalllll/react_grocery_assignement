import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { 
  Header, 
  ProductList, 
  LoadingState, 
  ErrorState, 
  EmptyState,
  EditProductModal
} from '../components';

// ============================================
// API CONFIGURATION
// ============================================
const API_BASE = 'http://10.51.2.187:3000';

const ProductsScreen = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const itemsPerPage = 12;

  // ============================================
  // API CALLS
  // ============================================
  
  /**
   * Fetch products from the backend API
   * @param {number} page - Page number to fetch
   */
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE}/products?page=${page}&limit=${itemsPerPage}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
        setCurrentPage(page);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Cannot connect to server. Please check your network connection.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ============================================
  // LIFECYCLE
  // ============================================
  
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  /**
   * Handle pull-to-refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(currentPage);
  };

  /**
   * Navigate to a specific page
   * @param {number} page - Page number to navigate to
   */
  const goToPage = (page) => {
    if (page !== currentPage && page >= 1 && page <= pagination?.totalPages) {
      fetchProducts(page);
    }
  };

  /**
   * Navigate to next page
   */
  const goToNextPage = () => {
    if (pagination?.hasNextPage) {
      fetchProducts(currentPage + 1);
    }
  };

  /**
   * Navigate to previous page
   */
  const goToPrevPage = () => {
    if (pagination?.hasPrevPage) {
      fetchProducts(currentPage - 1);
    }
  };

  /**
   * Handle edit button press
   * @param {object} product - Product to edit
   */
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalVisible(true);
  };

  /**
   * Handle save after editing
   * @param {object} updatedProduct - Updated product data from API
   */
  const handleSaveEdit = (updatedProduct) => {
    // Update the product in the local state
    setProducts(prevProducts =>
      prevProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p)
    );
  };

  /**
   * Handle delete button press
   * @param {object} product - Product to delete
   */
  const handleDelete = (product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(product._id),
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Delete product from API
   * @param {string} productId - ID of product to delete
   */
  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', data.message);
        
        // Remove product from local state
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
        
        // Update pagination count
        if (pagination) {
          setPagination({
            ...pagination,
            totalItems: pagination.totalItems - 1,
          });
        }
        
        // If current page becomes empty and it's not the first page, go to previous page
        if (products.length === 1 && currentPage > 1) {
          fetchProducts(currentPage - 1);
        } else if (products.length === 1 && currentPage === 1) {
          // If it was the last product on the first page, just refresh
          fetchProducts(1);
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to delete product');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
      console.error('Delete error:', error);
    }
  };

  // ============================================
  // RENDER STATES
  // ============================================
  
  // Loading state
  if (loading && !refreshing) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} apiBase={API_BASE} />;
  }

  // Empty state
  if (products.length === 0) {
    return <EmptyState />;
  }

  // ============================================
  // SUCCESS STATE: MAIN SCREEN
  // ============================================
  
  return (
    <SafeAreaView style={styles.container}>
      <Header pagination={pagination} />
      
      <ProductList
        products={products}
        refreshing={refreshing}
        onRefresh={onRefresh}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPrevPage={goToPrevPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        visible={editModalVisible}
        product={selectedProduct}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveEdit}
        apiBase={API_BASE}
      />
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ProductsScreen;
