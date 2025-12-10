import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export const productCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.backgroundGray,
  },
  productInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.huge,
    justifyContent: 'space-between',
  },
  nameRow: {
    marginBottom: SPACING.xs,
  },
  productName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  descriptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.success,
  },
  stockBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.xs,
  },
  stockInStock: {
    backgroundColor: COLORS.successLight,
  },
  stockOutOfStock: {
    backgroundColor: COLORS.errorLight,
  },
  stockText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  editIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.info,
    fontWeight: FONT_WEIGHTS.normal,
  },
  deleteIcon: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.error,
  },
});
