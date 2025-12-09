import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';
import PaginationFooter from './PaginationFooter';

const ProductList = ({ 
  products, 
  refreshing, 
  onRefresh,
  pagination,
  currentPage,
  onPageChange,
  onNextPage,
  onPrevPage,
  onEdit,
  onDelete
}) => {
  const renderProductCard = ({ item }) => (
    <ProductCard 
      item={item} 
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  const renderFooter = () => (
    <PaginationFooter
      pagination={pagination}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
    />
  );

  return (
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
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
});

export default ProductList;
