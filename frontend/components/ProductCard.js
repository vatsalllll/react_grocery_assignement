import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { productCardStyles } from '../styles/productCard.styles';

const ProductCard = ({ item, onEdit, onDelete }) => {
  return (
    <View style={productCardStyles.card}>
      {/* Product Image */}
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/72' }}
        style={productCardStyles.productImage}
        resizeMode="cover"
      />
      
      {/* Product Details */}
      <View style={productCardStyles.productInfo}>
        {/* Name Row */}
        <View style={productCardStyles.nameRow}>
          <Text style={productCardStyles.productName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        
        {/* Category */}
        <Text style={productCardStyles.categoryText}>{item.category}</Text>
        
        {/* Description */}
        <Text style={productCardStyles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>
        
        {/* Price and Stock Row */}
        <View style={productCardStyles.bottomRow}>
          <Text style={productCardStyles.priceText}>${item.price.toFixed(2)}</Text>
          <View style={[
            productCardStyles.stockBadge,
            item.stock > 0 ? productCardStyles.stockInStock : productCardStyles.stockOutOfStock
          ]}>
            <Text style={productCardStyles.stockText}>
              {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={productCardStyles.actionButtons}>
        {/* Edit Button */}
        <TouchableOpacity
          style={productCardStyles.actionButton}
          onPress={() => onEdit(item)}
          activeOpacity={0.6}
        >
          <Text style={productCardStyles.editIcon}>✎</Text>
        </TouchableOpacity>
        
        {/* Delete Button */}
        <TouchableOpacity
          style={productCardStyles.actionButton}
          onPress={() => onDelete(item)}
          activeOpacity={0.6}
        >
          <Text style={productCardStyles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;
