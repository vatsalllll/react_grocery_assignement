import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

export const loadingStateStyles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGray,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textSecondary,
  },
});
