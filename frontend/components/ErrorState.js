import React from 'react';
import { View, Text } from 'react-native';
import { errorStateStyles } from '../styles/errorState.styles';

const ErrorState = ({ error, apiBase }) => {
  return (
    <View style={errorStateStyles.centerContainer}>
      <Text style={errorStateStyles.errorIcon}>⚠️</Text>
      <Text style={errorStateStyles.errorText}>{error}</Text>
      <Text style={errorStateStyles.errorHint}>
        Make sure your backend server is running on {apiBase}
      </Text>
    </View>
  );
};

export default ErrorState;
