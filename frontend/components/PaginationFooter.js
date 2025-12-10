import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { paginationFooterStyles } from '../styles/paginationFooter.styles';

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
    <View style={paginationFooterStyles.paginationFooter}>
      {/* Previous Button */}
      <TouchableOpacity
        style={[
          paginationFooterStyles.paginationButton,
          !pagination.hasPrevPage && paginationFooterStyles.paginationButtonDisabled
        ]}
        onPress={onPrevPage}
        disabled={!pagination.hasPrevPage}
      >
        <Text style={[
          paginationFooterStyles.paginationButtonText,
          !pagination.hasPrevPage && paginationFooterStyles.paginationButtonTextDisabled
        ]}>
          ‹
        </Text>
      </TouchableOpacity>

      {/* Page Numbers */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={paginationFooterStyles.pageNumbersContainer}
      >
        {[...Array(pagination.totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          const isCurrentPage = pageNumber === currentPage;
          
          return (
            <TouchableOpacity
              key={pageNumber}
              style={[
                paginationFooterStyles.pageNumberButton,
                isCurrentPage && paginationFooterStyles.pageNumberButtonActive
              ]}
              onPress={() => onPageChange(pageNumber)}
            >
              <Text style={[
                paginationFooterStyles.pageNumberText,
                isCurrentPage && paginationFooterStyles.pageNumberTextActive
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
          paginationFooterStyles.paginationButton,
          !pagination.hasNextPage && paginationFooterStyles.paginationButtonDisabled
        ]}
        onPress={onNextPage}
        disabled={!pagination.hasNextPage}
      >
        <Text style={[
          paginationFooterStyles.paginationButtonText,
          !pagination.hasNextPage && paginationFooterStyles.paginationButtonTextDisabled
        ]}>
          ›
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaginationFooter;
