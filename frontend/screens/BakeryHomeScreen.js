import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BakeryProductCard from '../components/BakeryProductCard';
import CategoryPill from '../components/CategoryPill';
import EditProductModal from '../components/EditProductModal';

const API_BASE = 'http://10.51.2.187:3000';

const categories = [
  { id: 'all', icon: '🛒', label: 'All', value: null },
  { id: 'bakery', icon: '🧁', label: 'Bakery', value: 'Bakery' },
  { id: 'fruits', icon: '🍎', label: 'Fruits', value: 'Fruits' },
  { id: 'vegetables', icon: '🥕', label: 'Vegetables', value: 'Vegetables' },
  { id: 'dairy', icon: '🥛', label: 'Dairy', value: 'Dairy' },
  { id: 'beverages', icon: '🥤', label: 'Beverages', value: 'Beverages' },
  { id: 'snacks', icon: '🍿', label: 'Snacks', value: 'Snacks' },
  { id: 'meat', icon: '🥩', label: 'Meat', value: 'Meat' },
];

const BakeryHomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const itemsPerPage = 12;

  const bgColors = ['#FFF9E6', '#FFE4E4', '#E8F5E9', '#FFF0F5', '#F0F8FF', '#FFF9E6'];

  useEffect(() => {
    fetchProducts(1);
  }, [activeCategory]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });
      
      // Add category filter if not 'all'
      const selectedCategory = categories.find(cat => cat.id === activeCategory);
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
          bgColor: bgColors[index % bgColors.length],
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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(1);
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F4F0" />

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Supermarket</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="What you wish for?"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.categoriesContent}
          indicatorStyle="black"
          scrollIndicatorInsets={{ bottom: -2 }}
        >
          {categories.map((category) => (
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

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionSubtitle}>
            {pagination ? `${pagination.totalItems} Product${pagination.totalItems !== 1 ? 's' : ''}` : 'Loading...'}
          </Text>
        </View>
        <View style={styles.paginationInfo}>
          <Text style={styles.pageText}>
            Page {currentPage} of {pagination?.totalPages || 1}
          </Text>
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={() => fetchProducts(currentPage)}
        refreshing={loading}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          )
        }
      />

      {pagination && pagination.totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, !pagination.hasPrevPage && styles.disabledButton]}
            onPress={goToPrevPage}
            disabled={!pagination.hasPrevPage}
          >
            <Text style={[styles.paginationButtonText, !pagination.hasPrevPage && styles.disabledText]}>
              ‹
            </Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pageNumbers}>
            {[...Array(pagination.totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <TouchableOpacity
                  key={pageNumber}
                  style={[styles.pageButton, currentPage === pageNumber && styles.activePageButton]}
                  onPress={() => goToPage(pageNumber)}
                >
                  <Text style={[styles.pageButtonText, currentPage === pageNumber && styles.activePageText]}>
                    {pageNumber}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={[styles.paginationButton, !pagination.hasNextPage && styles.disabledButton]}
            onPress={goToNextPage}
            disabled={!pagination.hasNextPage}
          >
            <Text style={[styles.paginationButtonText, !pagination.hasNextPage && styles.disabledText]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D4A574',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A0D8F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D1B14',
    marginRight: 6,
  },
  chevron: {
    fontSize: 12,
    color: '#2D1B14',
  },
  gridIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2D1B14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIconContainer: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#2D1B14',
    marginBottom: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2D1B14',
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#2D1B14',
  },
  categoriesWrapper: {
    height: 110,
    marginBottom: 20,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 8,
    flexGrow: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D1B14',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  paginationInfo: {
    alignItems: 'flex-end',
  },
  pageText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  paginationButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  paginationButtonText: {
    fontSize: 24,
    color: '#2D1B14',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E8E8E8',
  },
  disabledText: {
    color: '#CCC',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 8,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activePageButton: {
    backgroundColor: '#D4A574',
    borderColor: '#D4A574',
  },
  pageButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activePageText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default BakeryHomeScreen;
