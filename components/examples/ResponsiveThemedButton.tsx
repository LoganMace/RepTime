/**
 * Example component demonstrating the new responsive theme system
 * This shows how to use the enhanced useResponsiveStyles hook with Theme integration
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';

interface ResponsiveThemedButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'large' | 'small';
  onPress: () => void;
}

export default function ResponsiveThemedButton({ 
  title, 
  variant = 'primary', 
  onPress 
}: ResponsiveThemedButtonProps) {
  const { colors } = useTheme();
  const { getComponentStyle, getTypographyStyle } = useResponsiveStyles();

  // Get responsive button style from theme
  const buttonStyle = getComponentStyle('button', variant);
  
  // Get responsive typography style
  const textStyle = getTypographyStyle('button');

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        { backgroundColor: colors.primary }
      ]}
      onPress={onPress}
    >
      <Text style={[textStyle, { color: colors.textInverse }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Usage example:
// const ExampleUsage = () => {
//   const { getComponentStyle, getTypographyStyle, getSpacing } = useResponsiveStyles();
//   const { colors } = useTheme();
//
//   // Get responsive styles directly from theme
//   const cardStyle = getComponentStyle('card', 'standard');
//   const headingStyle = getTypographyStyle('h2');
//   const spacing = getSpacing('section');
//
//   return (
//     <View style={[cardStyle, { backgroundColor: colors.card }]}>
//       <Text style={[headingStyle, { color: colors.text }]}>
//         Responsive Title
//       </Text>
//       <Text style={{ marginBottom: spacing.marginBottom }}>
//         This demonstrates the responsive theme system in action!
//       </Text>
//       <ResponsiveThemedButton 
//         title="Primary Button" 
//         variant="primary" 
//         onPress={() => console.log('Pressed!')} 
//       />
//     </View>
//   );
// };