import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@constants/theme';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.placeholder}>map view coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  placeholder: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
});
