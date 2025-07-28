import { useWindowDimensions } from "react-native";

const TABLET_BREAKPOINT = 768;

/**
 * A hook for creating responsive styles.
 * @returns An object with `isTablet`, `isMobile`, and a `getStyles` function.
 */
export const useResponsiveStyles = () => {
  const { width } = useWindowDimensions();

  const isTablet = width >= TABLET_BREAKPOINT;
  const isMobile = !isTablet;

  /**
   * A helper function to return the correct style object based on the screen size.
   * @param mobileStyles The styles to apply on mobile.
   * @param tabletStyles The styles to apply on tablet.
   * @returns The appropriate style object.
   */
  const getStyles = <T, U>(mobileStyles: T, tabletStyles: U): T | U => {
    return isTablet ? tabletStyles : mobileStyles;
  };

  return { isTablet, isMobile, getStyles };
};
