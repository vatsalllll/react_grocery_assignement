import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CategoryPill = ({ icon, label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 8,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2D1B14',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeIconContainer: {
    backgroundColor: '#FFE4B5',
  },
  icon: {
    fontSize: 36,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  activeLabel: {
    color: '#2D1B14',
    fontWeight: 'bold',
  },
});

export default CategoryPill;
