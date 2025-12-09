import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const PaginationFooter = ({ 
  pagination, 
  currentPage, 
  onPageChange, 
  onNextPage, 
  onPrevPage 
}) => {
  // Don't render if no pagination or only one page
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <View style={styles.paginationFooter}>
      {/* Previous Button */}
      <TouchableOpacity
        style={[
          styles.paginationButton,
          !pagination.hasPrevPage && styles.paginationButtonDisabled
        ]}
        onPress={onPrevPage}
        disabled={!pagination.hasPrevPage}
      >
        <Text style={[
          styles.paginationButtonText,
          !pagination.hasPrevPage && styles.paginationButtonTextDisabled
        ]}>
          ‹
        </Text>
      </TouchableOpacity>

      {/* Page Numbers */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pageNumbersContainer}
      >
        {[...Array(pagination.totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          const isCurrentPage = pageNumber === currentPage;
          
          return (
            <TouchableOpacity
              key={pageNumber}
              style={[
                styles.pageNumberButton,
                isCurrentPage && styles.pageNumberButtonActive
              ]}
              onPress={() => onPageChange(pageNumber)}
            >
              <Text style={[
                styles.pageNumberText,
                isCurrentPage && styles.pageNumberTextActive
              ]}>
                {pageNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.paginationButton,
          !pagination.hasNextPage && styles.paginationButtonDisabled
        ]}
        onPress={onNextPage}
        disabled={!pagination.hasNextPage}
      >
        <Text style={[
          styles.paginationButtonText,
          !pagination.hasNextPage && styles.paginationButtonTextDisabled
        ]}>
          ›
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paginationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paginationButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  paginationButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: -2,
  },
  paginationButtonTextDisabled: {
    color: '#9e9e9e',
  },
  pageNumbersContainer: {
    alignItems: 'center',
  },
  pageNumberButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pageNumberButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  pageNumberText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  pageNumberTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default PaginationFooter;
