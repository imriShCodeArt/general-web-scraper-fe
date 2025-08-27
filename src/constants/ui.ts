// UI Color Schemes
export const UI_COLORS = {
  primary: {
    50: 'bg-primary-50',
    100: 'bg-primary-100',
    500: 'bg-primary-500',
    600: 'bg-primary-600',
    700: 'bg-primary-700',
    text: 'text-primary-600',
    border: 'border-primary-500',
    ring: 'ring-primary-500'
  },
  success: {
    50: 'bg-success-50',
    100: 'bg-success-100',
    500: 'bg-success-500',
    600: 'bg-success-600',
    700: 'bg-success-700',
    text: 'text-success-600',
    border: 'border-success-500',
    ring: 'ring-success-500'
  },
  warning: {
    50: 'bg-warning-50',
    100: 'bg-warning-100',
    500: 'bg-warning-500',
    600: 'bg-warning-600',
    700: 'bg-warning-700',
    text: 'text-warning-600',
    border: 'border-warning-500',
    ring: 'ring-warning-500'
  },
  error: {
    50: 'bg-error-50',
    100: 'bg-error-100',
    500: 'bg-error-500',
    600: 'bg-error-600',
    700: 'bg-error-700',
    text: 'text-error-600',
    border: 'border-error-500',
    ring: 'ring-error-500'
  },
  gray: {
    50: 'bg-gray-50',
    100: 'bg-gray-100',
    200: 'bg-gray-200',
    300: 'bg-gray-300',
    400: 'bg-gray-400',
    500: 'bg-gray-500',
    600: 'bg-gray-600',
    700: 'bg-gray-700',
    800: 'bg-gray-800',
    900: 'bg-gray-900'
  }
} as const;

// Common Spacing Values
export const SPACING = {
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-3',
  lg: 'space-y-4',
  xl: 'space-y-6',
  '2xl': 'space-y-8'
} as const;

// Common Border Radius
export const BORDER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
} as const;

// Common Shadows
export const SHADOWS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
} as const;

// Common Transitions
export const TRANSITIONS = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-300',
  slow: 'transition-all duration-500'
} as const;

// Common Focus States
export const FOCUS_STATES = {
  primary: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  secondary: 'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  error: 'focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2'
} as const;
