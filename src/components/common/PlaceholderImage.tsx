import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography } from '@constants/theme';

interface PlaceholderImageProps {
  style?: ViewStyle;
}

export default function PlaceholderImage({ style }: PlaceholderImageProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>▲</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    color: colors.textTertiary,
    opacity: 0.3,
  },
});
