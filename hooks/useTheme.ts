/**
 * Custom hook for accessing theme values
 * Provides easy access to colors, typography, spacing, and component styles
 */

import { useColorScheme } from '@/hooks/useColorScheme';
import { Theme, getThemeColors } from '@/constants/Theme';

export function useTheme() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = getThemeColors(colorScheme);
  
  return {
    colors,
    typography: Theme.typography,
    spacing: Theme.spacing,
    borderRadius: Theme.borderRadius,
    shadows: Theme.shadows,
    components: Theme.components,
    colorScheme,
  };
}

// Shorthand hook for just colors
export function useThemeColors() {
  const colorScheme = useColorScheme() ?? 'dark';
  return getThemeColors(colorScheme);
}