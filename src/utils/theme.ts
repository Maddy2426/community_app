import { ThemeMode } from '@/types';

export const COLORS = {
  primary: '#7C3AED',
  primaryLight: '#A855F7',
  background: '#F8F7FF',
  surface: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  like: '#EF4444',
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const DARK_COLORS = {
  primary: '#A855F7',
  primaryLight: '#C084FC',
  background: '#0F0F1A',
  surface: '#1A1A2E',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  border: '#374151',
  error: '#F87171',
  success: '#34D399',
  like: '#F87171',
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = 16;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const GRADIENT_COLORS = [COLORS.primary, COLORS.primaryLight] as const;

export const getThemeColors = (mode: ThemeMode) =>
  mode === 'dark' ? DARK_COLORS : COLORS;
