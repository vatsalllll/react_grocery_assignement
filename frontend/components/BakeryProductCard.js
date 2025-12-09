import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16px margin on each side, 16px gap

const BakeryProductCard = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardTouchable} 
        activeOpacity={0.9}
      >
        <View style={[styles.imageContainer, { backgroundColor: item.bgColor || '#FFF9E6' }]}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(item)}
                activeOpacity={0.6}
              >
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(item)}
                activeOpacity={0.6}
              >
                <Text style={styles.deleteIcon}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D1B14',
    overflow: 'hidden',
    position: 'relative',
  },
  cardTouchable: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 12,
    paddingTop: 8,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#2D1B14',
    lineHeight: 20,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1B14',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D1B14',
  },
  editIcon: {
    fontSize: 12,
    color: '#2196F3',
  },
  deleteIcon: {
    fontSize: 12,
    color: '#f44336',
  },
});

export default BakeryProductCard;
