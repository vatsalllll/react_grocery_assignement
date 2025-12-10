import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export const paginationFooterStyles = StyleSheet.create({
  paginationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.backgroundLight,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  paginationButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
    ...SHADOWS.small,
  },
  paginationButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  paginationButtonText: {
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textWhite,
    marginTop: -2,
  },
  paginationButtonTextDisabled: {
    color: '#9e9e9e',
  },
  pageNumbersContainer: {
    alignItems: 'center',
  },
  pageNumberButton: {
    minWidth: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pageNumberButtonActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  pageNumberText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
  },
  pageNumberTextActive: {
    color: COLORS.textWhite,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
