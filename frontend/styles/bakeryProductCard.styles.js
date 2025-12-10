import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/theme';
import { CARD_WIDTH } from '../constants/config';

export const bakeryProductCardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
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
    padding: SPACING.md,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: SPACING.md,
    paddingTop: SPACING.sm,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  productName: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginRight: SPACING.sm,
  },
  productPrice: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.overlayLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  editIcon: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.info,
  },
  deleteIcon: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
  },
});
