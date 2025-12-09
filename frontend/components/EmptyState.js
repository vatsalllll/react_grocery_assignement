import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyState = () => {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyText}>No products found</Text>
      <Text style={styles.emptyHint}>Add some products to get started</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#666',
  },
});

export default EmptyState;
