import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import { loadingStateStyles } from '../styles/loadingState.styles';

const LoadingState = () => {
  return (
    <View style={loadingStateStyles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.success} />
      <Text style={loadingStateStyles.loadingText}>Loading products...</Text>
    </View>
  );
};

export default LoadingState;
