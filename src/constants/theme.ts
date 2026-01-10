export const LIGHT_COLORS = {
  primary: '#FF6B00',
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#888888',
  border: '#E0E0E0',
  error: '#FF0000',
  surface: '#F5F5F5',
};

export const DARK_COLORS = {
  primary: '#FF6B00',
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  error: '#FF5252',
  surface: '#1E1E1E',
};

// Default export for backward compatibility, will be overridden by store usage
export const COLORS = LIGHT_COLORS;

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const FONT_SIZE = {
  s: 12,
  m: 14,
  l: 16,
  xl: 20,
  xxl: 24,
};

export const THEME = {
  colors: COLORS,
  spacing: SPACING,
  fontSize: FONT_SIZE,
};
