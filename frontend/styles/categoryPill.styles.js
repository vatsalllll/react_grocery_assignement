import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/theme';

export const categoryPillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: 80,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  icon: {
    fontSize: FONT_SIZES.display,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
  },
  labelActive: {
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primaryDark,
  },
});
