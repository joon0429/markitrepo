import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@constants/theme';
import Button from './Button';
import { useAuth } from '@contexts/AuthContext';

interface PlaceholderScreenProps {
  title: string;
  description: string;
}

export default function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.hint}>this is a hollow frame</Text>
      <Text style={styles.hint}>firebase integration coming soon</Text>

      <View style={styles.actions}>
        <Button title="sign out" onPress={signOut} variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  actions: {
    marginTop: spacing.xl,
    width: '100%',
    maxWidth: 300,
  },
});
