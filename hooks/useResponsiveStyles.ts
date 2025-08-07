import { useWindowDimensions } from "react-native";
import { 
  getResponsiveComponentStyle, 
  getResponsiveTypography, 
  getResponsiveSpacing,
  createResponsiveStyle,
  Theme,
  type ResponsiveStyle
} from "../constants/Theme";

const TABLET_BREAKPOINT = 768;

/**
 * Enhanced hook for creating responsive styles with Theme integration.
 * @returns An object with responsive utilities and style helpers.
 */
export const useResponsiveStyles = () => {
  const { width } = useWindowDimensions();

  const isTablet = width >= TABLET_BREAKPOINT;
  const isMobile = !isTablet;

  /**
   * Legacy helper function to return the correct style object based on screen size.
   * @param mobileStyles The styles to apply on mobile.
   * @param tabletStyles The styles to apply on tablet.
   * @returns The appropriate style object.
   */
  const getStyles = <T, U>(mobileStyles: T, tabletStyles: U): T | U => {
    return isTablet ? tabletStyles : mobileStyles;
  };

  /**
   * Get responsive component style from theme.
   * @param componentType The component type (button, card, input, modal)
   * @param variant The style variant (primary, secondary, etc.)
   * @returns The responsive style object for current screen size
   */
  const getComponentStyle = (
    componentType: keyof typeof Theme.components,
    variant: string
  ) => {
    return getResponsiveComponentStyle(componentType, variant, isTablet);
  };

  /**
   * Get responsive typography style from theme.
   * @param styleType The typography style type (h1, h2, body, etc.)
   * @returns The responsive typography style for current screen size
   */
  const getTypographyStyle = (
    styleType: keyof typeof Theme.typography.styles
  ) => {
    return getResponsiveTypography(styleType, isTablet);
  };

  /**
   * Get responsive spacing values from theme.
   * @param spacingType The spacing type (card, button, modal, etc.)
   * @returns The responsive spacing values for current screen size
   */
  const getSpacing = (
    spacingType: keyof typeof Theme.spacing.responsive
  ) => {
    return getResponsiveSpacing(spacingType, isTablet);
  };

  /**
   * Create a responsive style by merging base styles with device-specific overrides.
   * @param baseStyle The base style object
   * @param responsiveOverrides Mobile and tablet specific style overrides
   * @returns The merged style object for current screen size
   */
  const createStyle = (
    baseStyle: object,
    responsiveOverrides: { mobile?: object; tablet?: object }
  ) => {
    return createResponsiveStyle(baseStyle, responsiveOverrides, isTablet);
  };

  /**
   * Get the appropriate value from a responsive style object.
   * @param responsiveValue Object with mobile and tablet values
   * @returns The value for current screen size
   */
  const getResponsiveValue = <T>(responsiveValue: ResponsiveStyle<T>): T => {
    return isTablet ? responsiveValue.tablet : responsiveValue.mobile;
  };

  return { 
    // Screen size info
    isTablet, 
    isMobile, 
    width,
    
    // Legacy style helper
    getStyles,
    
    // New theme-integrated helpers
    getComponentStyle,
    getTypographyStyle,
    getSpacing,
    createStyle,
    getResponsiveValue
  };
};
