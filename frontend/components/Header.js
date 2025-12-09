import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ pagination }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>🛒 Grocery Store</Text>
      <Text style={styles.headerSubtitle}>Fresh products delivered daily</Text>
      
      {pagination && (
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </Text>
          <Text style={styles.paginationText}>
            Total: {pagination.totalItems} products
          </Text>
          {pagination.hasNextPage && (
            <Text style={styles.paginationBadge}>More available</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationText: {
    fontSize: 12,
    color: '#e8f5e9',
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
});

export default Header;
