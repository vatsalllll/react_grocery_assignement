import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BakeryProductCard from '../components/BakeryProductCard';
import CategoryPill from '../components/CategoryPill';
import EditProductModal from '../components/EditProductModal';
import { API_BASE, ITEMS_PER_PAGE } from '../constants/config';
import { CATEGORIES } from '../constants/categories';
import { PRODUCT_BG_COLORS } from '../constants/theme';
import { bakeryHomeScreenStyles } from '../styles/bakeryHomeScreen.styles';

const BakeryHomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchProducts(1);
  }, [activeCategory]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length === 0 || searchQuery.length >= 3) {
        fetchProducts(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      
      // Add category filter if not 'all'
      const selectedCategory = CATEGORIES.find(cat => cat.id === activeCategory);
      if (selectedCategory && selectedCategory.value) {
        params.append('category', selectedCategory.value);
      }
      
      // Add search query if exists
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }
      
      const response = await fetch(`${API_BASE}/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        // Add background colors to products
        const productsWithColors = data.products.map((product, index) => ({
          ...product,
          bgColor: PRODUCT_BG_COLORS[index % PRODUCT_BG_COLORS.length],
        }));
        setProducts(productsWithColors);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditModalVisible(true);
  };

  const handleSaveEdit = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p._id === updatedProduct._id ? { ...updatedProduct, bgColor: p.bgColor } : p
      )
    );
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE}/products/${product._id}`, {
                method: 'DELETE',
              });
              const data = await response.json();

              if (data.success) {
                Alert.alert('Success', 'Product deleted successfully');
                
                // Refresh current page
                if (products.length === 1 && currentPage > 1) {
                  fetchProducts(currentPage - 1);
                } else {
                  fetchProducts(currentPage);
                }
              } else {
                Alert.alert('Error', data.message || 'Failed to delete product');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to connect to server');
            }
          },
        },
      ]
    );
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination?.totalPages) {
      fetchProducts(page);
    }
  };

  const goToNextPage = () => {
    if (pagination?.hasNextPage) {
      fetchProducts(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination?.hasPrevPage) {
      fetchProducts(currentPage - 1);
    }
  };

  const renderProduct = ({ item }) => (
    <BakeryProductCard
      item={item}
      onEdit={handleEditProduct}
      onDelete={handleDeleteProduct}
    />
  );

  return (
    <SafeAreaView style={bakeryHomeScreenStyles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F4F0" />

      <View style={bakeryHomeScreenStyles.logoContainer}>
        <Text style={bakeryHomeScreenStyles.logoText}>Supermarket</Text>
      </View>

      <View style={bakeryHomeScreenStyles.searchContainer}>
        <View style={bakeryHomeScreenStyles.searchBar}>
          <Text style={bakeryHomeScreenStyles.searchIcon}>🔍</Text>
          <TextInput
            style={bakeryHomeScreenStyles.searchInput}
            placeholder="What you wish for? (min 3 letters)"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={bakeryHomeScreenStyles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={bakeryHomeScreenStyles.categoriesContent}
          indicatorStyle="black"
          scrollIndicatorInsets={{ bottom: -2 }}
        >
          {CATEGORIES.map((category) => (
            <CategoryPill
              key={category.id}
              icon={category.icon}
              label={category.label}
              isActive={activeCategory === category.id}
              onPress={() => setActiveCategory(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={bakeryHomeScreenStyles.sectionHeader}>
        <View>
          <Text style={bakeryHomeScreenStyles.sectionSubtitle}>
            {pagination ? `${pagination.totalItems} Product${pagination.totalItems !== 1 ? 's' : ''}` : 'Loading...'}
          </Text>
        </View>
        <View style={bakeryHomeScreenStyles.paginationInfo}>
          <Text style={bakeryHomeScreenStyles.pageText}>
            Page {currentPage} of {pagination?.totalPages || 1}
          </Text>
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={bakeryHomeScreenStyles.row}
        contentContainerStyle={bakeryHomeScreenStyles.productsContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={() => fetchProducts(currentPage)}
        refreshing={loading}
        ListEmptyComponent={
          !loading && (
            <View style={bakeryHomeScreenStyles.emptyContainer}>
              <Text style={bakeryHomeScreenStyles.emptyText}>No products found</Text>
            </View>
          )
        }
      />

      {pagination && pagination.totalPages > 1 && (
        <View style={bakeryHomeScreenStyles.paginationContainer}>
          <TouchableOpacity
            style={[bakeryHomeScreenStyles.paginationButton, !pagination.hasPrevPage && bakeryHomeScreenStyles.disabledButton]}
            onPress={goToPrevPage}
            disabled={!pagination.hasPrevPage}
          >
            <Text style={[bakeryHomeScreenStyles.paginationButtonText, !pagination.hasPrevPage && bakeryHomeScreenStyles.disabledText]}>
              ‹
            </Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={bakeryHomeScreenStyles.pageNumbers}>
            {[...Array(pagination.totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <TouchableOpacity
                  key={pageNumber}
                  style={[bakeryHomeScreenStyles.pageButton, currentPage === pageNumber && bakeryHomeScreenStyles.activePageButton]}
                  onPress={() => goToPage(pageNumber)}
                >
                  <Text style={[bakeryHomeScreenStyles.pageButtonText, currentPage === pageNumber && bakeryHomeScreenStyles.activePageText]}>
                    {pageNumber}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={[bakeryHomeScreenStyles.paginationButton, !pagination.hasNextPage && bakeryHomeScreenStyles.disabledButton]}
            onPress={goToNextPage}
            disabled={!pagination.hasNextPage}
          >
            <Text style={[bakeryHomeScreenStyles.paginationButtonText, !pagination.hasNextPage && bakeryHomeScreenStyles.disabledText]}>
              ›
            </Text>
          </TouchableOpacity>
        </View>
      )}

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

export default BakeryHomeScreen;
