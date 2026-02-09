// Theme constants for Mark-it app
// Dark mode theme with Material Design principles

export const colors = {
  primary: '#BB86FC',
  primaryVariant: '#3700B3',
  secondary: '#03DAC6',
  background: '#121212',
  surface: '#1E1E1E',
  error: '#CF6679',

  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#808080',

  border: '#2C2C2C',
  divider: '#1A1A1A',

  success: '#81C784',
  warning: '#FFB74D',
  info: '#64B5F6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 1.41,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2.22,
    elevation: 3,
  },
};
