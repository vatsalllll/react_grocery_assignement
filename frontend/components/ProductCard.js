import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      {/* Product Image */}
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/72' }}
        style={styles.productImage}
        resizeMode="cover"
      />
      
      {/* Product Details */}
      <View style={styles.productInfo}>
        {/* Name Row */}
        <View style={styles.nameRow}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        
        {/* Category */}
        <Text style={styles.categoryText}>{item.category}</Text>
        
        {/* Description */}
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>
        
        {/* Price and Stock Row */}
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
          <View style={[
            styles.stockBadge,
            item.stock > 0 ? styles.stockInStock : styles.stockOutOfStock
          ]}>
            <Text style={styles.stockText}>
              {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {/* Edit Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(item)}
          activeOpacity={0.6}
        >
          <Text style={styles.editIcon}>✎</Text>
        </TouchableOpacity>
        
        {/* Delete Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(item)}
          activeOpacity={0.6}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 60, // Space for action buttons
    justifyContent: 'space-between',
  },
  nameRow: {
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stockInStock: {
    backgroundColor: '#e8f5e9',
  },
  stockOutOfStock: {
    backgroundColor: '#ffebee',
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  actionButtons: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  editIcon: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: '400',
  },
  deleteIcon: {
    fontSize: 18,
    color: '#f44336',
  },
});

export default ProductCard;
