import React from 'react';
import { View, Text } from 'react-native';
import { headerStyles } from '../styles/header.styles';

const Header = ({ pagination }) => {
  return (
    <View style={headerStyles.header}>
      <Text style={headerStyles.headerTitle}>🛒 Grocery Store</Text>
      <Text style={headerStyles.headerSubtitle}>Fresh products delivered daily</Text>
      
      {pagination && (
        <View style={headerStyles.paginationInfo}>
          <Text style={headerStyles.paginationText}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </Text>
          <Text style={headerStyles.paginationText}>
            Total: {pagination.totalItems} products
          </Text>
          {pagination.hasNextPage && (
            <Text style={headerStyles.paginationBadge}>More available</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Header;
