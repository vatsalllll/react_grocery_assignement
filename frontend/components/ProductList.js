import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import ProductCard from './ProductCard';
import PaginationFooter from './PaginationFooter';
import { COLORS } from '../constants/theme';
import { productListStyles } from '../styles/productList.styles';

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
      contentContainerStyle={productListStyles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.success]}
        />
      }
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ProductList;
