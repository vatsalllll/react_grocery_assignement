import React from 'react';
import { View, Text } from 'react-native';
import { emptyStateStyles } from '../styles/emptyState.styles';

const EmptyState = () => {
  return (
    <View style={emptyStateStyles.centerContainer}>
      <Text style={emptyStateStyles.emptyIcon}>📦</Text>
      <Text style={emptyStateStyles.emptyText}>No products found</Text>
      <Text style={emptyStateStyles.emptyHint}>Add some products to get started</Text>
    </View>
  );
};

export default EmptyState;
