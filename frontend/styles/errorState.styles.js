import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme';

export const errorStateStyles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGray,
    padding: SPACING.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  errorHint: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
