import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { editProductModalStyles } from '../styles/editProductModal.styles';

const EditProductModal = ({ visible, product, onClose, onSave, apiBase }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load product data when modal opens
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        description: product.description || '',
        stock: product.stock?.toString() || '',
        imageUrl: product.imageUrl || '',
      });
      setErrors({});
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Valid price is required (must be positive)';
    }

    if (formData.stock && (isNaN(formData.stock) || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'Stock must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    setLoading(true);

    try {
      // Prepare update data (only include non-empty fields)
      const updateData = {};
      
      if (formData.name.trim()) updateData.name = formData.name.trim();
      if (formData.price) updateData.price = parseFloat(formData.price);
      if (formData.category) updateData.category = formData.category.trim();
      if (formData.description) updateData.description = formData.description.trim();
      if (formData.stock) updateData.stock = parseInt(formData.stock);
      if (formData.imageUrl) updateData.imageUrl = formData.imageUrl.trim();

      const response = await fetch(`${apiBase}/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Product updated successfully!');
        onSave(data.data); // Pass updated product back to parent
        onClose();
      } else {
        Alert.alert('Error', data.message || 'Failed to update product');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={editProductModalStyles.modalOverlay}>
        <View style={editProductModalStyles.modalContent}>
          {/* Header */}
          <View style={editProductModalStyles.modalHeader}>
            <Text style={editProductModalStyles.modalTitle}>Edit Product</Text>
            <TouchableOpacity onPress={handleCancel} style={editProductModalStyles.closeButton}>
              <Text style={editProductModalStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView style={editProductModalStyles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Product Name */}
            <View style={editProductModalStyles.inputGroup}>
              <Text style={editProductModalStyles.label}>Product Name *</Text>
              <TextInput
                style={[editProductModalStyles.input, errors.name && editProductModalStyles.inputError]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter product name"
                placeholderTextColor="#999"
              />
              {errors.name && <Text style={editProductModalStyles.errorText}>{errors.name}</Text>}
            </View>

            {/* Price */}
            <View style={editProductModalStyles.inputGroup}>
              <Text style={editProductModalStyles.label}>Price ($) *</Text>
              <TextInput
                style={[editProductModalStyles.input, errors.price && editProductModalStyles.inputError]}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#999"
              />
              {errors.price && <Text style={editProductModalStyles.errorText}>{errors.price}</Text>}
            </View>

            {/* Category */}
            <View style={editProductModalStyles.inputGroup}>
              <Text style={editProductModalStyles.label}>Category</Text>
              <TextInput
                style={editProductModalStyles.input}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="e.g., Fruits, Vegetables, Dairy"
                placeholderTextColor="#999"
              />
            </View>

            {/* Stock */}
            <View style={editProductModalStyles.inputGroup}>
              <Text style={editProductModalStyles.label}>Stock</Text>
              <TextInput
                style={[editProductModalStyles.input, errors.stock && editProductModalStyles.inputError]}
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                placeholder="0"
                keyboardType="number-pad"
                placeholderTextColor="#999"
              />
              {errors.stock && <Text style={editProductModalStyles.errorText}>{errors.stock}</Text>}
            </View>

            {/* Description */}
            <View style={editProductModalStyles.inputGroup}>
              <Text style={editProductModalStyles.label}>Description</Text>
              <TextInput
                style={[editProductModalStyles.input, editProductModalStyles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter product description"
                multiline
                numberOfLines={3}
                placeholderTextColor="#999"
              />
            </View>

            {/* Image URL */}
            <View style={editProductModalStyles.inputGroup}>
              <Text style={editProductModalStyles.label}>Image URL</Text>
              <TextInput
                style={editProductModalStyles.input}
                value={formData.imageUrl}
                onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={editProductModalStyles.buttonContainer}>
            <TouchableOpacity
              style={[editProductModalStyles.button, editProductModalStyles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={editProductModalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[editProductModalStyles.button, editProductModalStyles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={editProductModalStyles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditProductModal;
