/**
 * Comprehensive theme file for RepTime fitness tracking app
 * Consolidates colors, typography, spacing, and component styles
 */

// Base color palette
const baseColors = {
  // Primary colors
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#6BA3E8',
  
  // Success/positive colors
  success: '#5CB85C',
  successDark: '#449D44',
  
  // Warning colors
  warning: '#F0AD4E',
  warningDark: '#EC971F',
  
  // Info colors
  info: '#17A2B8',
  infoDark: '#138496',
  
  // Error/danger colors
  error: '#D9534F',
  errorDark: '#C9302C',
  
  // Neutral grays
  black: '#000000',
  white: '#FFFFFF',
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',
  
  // Dark theme specific
  darkBackground: '#151718',
  darkCard: '#1a1a1a',
  darkBorder: '#2a2a2a',
  darkText: '#ECEDEE',
  darkTextSecondary: '#9BA1A6',
  
  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};

// Theme definitions
export const Theme = {
  colors: {
    light: {
      // Text colors
      text: baseColors.gray900,
      textSecondary: baseColors.gray600,
      textInverse: baseColors.white,
      
      // Background colors
      background: baseColors.white,
      backgroundSecondary: baseColors.gray100,
      surface: baseColors.white,
      card: baseColors.white,
      
      // Interactive colors
      primary: baseColors.primary,
      primaryPressed: baseColors.primaryDark,
      
      // Status colors
      success: baseColors.success,
      warning: baseColors.warning,
      error: baseColors.error,
      info: baseColors.info,
      
      // Border colors
      border: baseColors.gray300,
      borderLight: baseColors.gray200,
      
      // Icon colors
      icon: baseColors.gray600,
      iconSelected: baseColors.primary,
      
      // Tab colors
      tabBackground: baseColors.white,
      tabIconDefault: baseColors.gray600,
      tabIconSelected: baseColors.primary,
      
      // Input colors
      inputBackground: baseColors.white,
      inputBorder: baseColors.gray300,
      inputText: baseColors.gray900,
      placeholder: baseColors.gray500,
      
      // Overlay
      overlay: baseColors.overlay,
      
      // Shadow
      shadow: baseColors.black,
    },
    dark: {
      // Text colors
      text: baseColors.darkText,
      textSecondary: baseColors.darkTextSecondary,
      textInverse: baseColors.black,
      
      // Background colors
      background: baseColors.darkBackground,
      backgroundSecondary: baseColors.darkCard,
      surface: baseColors.darkCard,
      card: baseColors.darkCard,
      
      // Interactive colors
      primary: baseColors.white,
      primaryPressed: baseColors.gray300,
      
      // Status colors
      success: baseColors.success,
      warning: baseColors.warning,
      error: baseColors.error,
      info: baseColors.info,
      
      // Border colors
      border: baseColors.darkBorder,
      borderLight: baseColors.gray700,
      
      // Icon colors
      icon: baseColors.darkTextSecondary,
      iconSelected: baseColors.white,
      
      // Tab colors
      tabBackground: baseColors.darkCard,
      tabIconDefault: baseColors.darkTextSecondary,
      tabIconSelected: baseColors.white,
      
      // Input colors
      inputBackground: baseColors.darkCard,
      inputBorder: baseColors.darkBorder,
      inputText: baseColors.darkText,
      placeholder: baseColors.darkTextSecondary,
      
      // Overlay
      overlay: baseColors.overlay,
      
      // Shadow
      shadow: baseColors.black,
    },
  },
  
  // Typography scale
  typography: {
    // Font families
    fontFamily: {
      regular: 'System', // Default system font
      mono: 'SpaceMono', // Existing mono font
    },
    
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    
    // Font weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 2.0,
    },
    
    // Text styles
    styles: {
      // Headlines
      h1: {
        fontSize: 36,
        fontWeight: '700',
        lineHeight: 1.2,
      },
      h2: {
        fontSize: 30,
        fontWeight: '600',
        lineHeight: 1.2,
      },
      h3: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 1.3,
      },
      h4: {
        fontSize: 20,
        fontWeight: '500',
        lineHeight: 1.3,
      },
      
      // Body text
      body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 1.5,
      },
      bodySmall: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 1.4,
      },
      
      // Captions and labels
      caption: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 1.3,
      },
      label: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 1.2,
      },
      
      // Button text
      button: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 1.2,
      },
      buttonSmall: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 1.2,
      },
    },
  },
  
  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    base: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
    
    // Component-specific spacing
    card: {
      padding: 16,
      margin: 12,
      paddingLarge: 24,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      paddingSmall: 8,
    },
    input: {
      padding: 12,
      paddingHorizontal: 16,
    },
  },
  
  // Border radii
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: baseColors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    base: {
      shadowColor: baseColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: baseColors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: baseColors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 16,
    },
  },
  
  // Component styles
  components: {
    card: {
      standard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      },
      large: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 6,
      },
      small: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        shadowOpacity: 0.08,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 3,
      },
    },
    
    button: {
      primary: {
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        minHeight: 50,
        fontSize: 16,
        fontWeight: '600',
      },
      secondary: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        minHeight: 44,
        fontSize: 14,
        fontWeight: '500',
      },
      large: {
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 32,
        minHeight: 60,
        fontSize: 18,
        fontWeight: '600',
      },
      small: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 36,
        fontSize: 14,
        fontWeight: '500',
      },
    },
    
    input: {
      standard: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        minHeight: 48,
        fontSize: 16,
      },
      large: {
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderWidth: 1,
        minHeight: 56,
        fontSize: 18,
      },
    },
    
    modal: {
      standard: {
        borderRadius: 16,
        padding: 24,
        margin: 20,
        maxHeight: '80%',
      },
      fullscreen: {
        borderRadius: 0,
        padding: 20,
        margin: 0,
        maxHeight: '100%',
      },
      compact: {
        borderRadius: 12,
        padding: 16,
        margin: 16,
        maxHeight: '70%',
      },
    },
  },
};

// Helper function to get theme colors based on current scheme
export function getThemeColors(colorScheme: 'light' | 'dark' = 'dark') {
  return Theme.colors[colorScheme];
}

// Helper function to create responsive styles
export function createThemedStyles<T>(
  styles: (colors: typeof Theme.colors.light) => T,
  colorScheme: 'light' | 'dark' = 'dark'
): T {
  return styles(getThemeColors(colorScheme));
}

// Export base colors for special use cases
export { baseColors };