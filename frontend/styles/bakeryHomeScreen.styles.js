import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/theme';

export const bakeryHomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  logoText: {
    fontSize: FONT_SIZES.hero,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
    paddingHorizontal: SPACING.lg,
    height: 56,
  },
  searchIcon: {
    fontSize: FONT_SIZES.xl,
    marginRight: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    color: COLORS.primaryDark,
  },
  categoriesWrapper: {
    height: 110,
    marginBottom: SPACING.xl,
  },
  categoriesContent: {
    paddingLeft: SPACING.xl,
    paddingRight: SPACING.md,
    paddingVertical: SPACING.sm,
    flexGrow: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: 0,
    marginBottom: SPACING.lg,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    marginTop: 2,
  },
  paginationInfo: {
    alignItems: 'flex-end',
  },
  pageText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  productsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.huge,
  },
  emptyText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textLight,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  paginationButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paginationButtonText: {
    fontSize: FONT_SIZES.xxxl,
    color: COLORS.primaryDark,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  disabledButton: {
    backgroundColor: COLORS.backgroundGray,
    borderColor: COLORS.divider,
  },
  disabledText: {
    color: '#CCC',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.xxl,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activePageButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pageButtonText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  activePageText: {
    color: COLORS.backgroundLight,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
