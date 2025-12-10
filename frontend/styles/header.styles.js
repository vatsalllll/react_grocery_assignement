import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/theme';

export const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.success,
    padding: SPACING.xl,
    paddingTop: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textWhite,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.successLight,
  },
  paginationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.successLight,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  paginationBadge: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
