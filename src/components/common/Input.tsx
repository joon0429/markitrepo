import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { colors, spacing, borderRadius, typography } from '@constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  floatingLabel?: boolean;
  left?: React.ReactNode;
}

export default function Input({ label, error, style, floatingLabel, left, ...props }: InputProps) {
  if (floatingLabel && label) {
    return (
      <View style={styles.container}>
        <PaperTextInput
          label={label}
          mode="outlined"
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          error={!!error}
          left={left}
          style={[styles.paperInput, props.multiline && styles.paperInputMultiline, style]}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          textColor={colors.text}
          placeholderTextColor={colors.textTertiary}
          theme={{
            colors: {
              background: colors.surface,
              onSurfaceVariant: colors.textTertiary,
              error: colors.error,
            },
          }}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  inputError: {
    borderColor: colors.error,
  },
  paperInput: {
    fontSize: typography.fontSize.md,
    backgroundColor: colors.surface,
  },
  paperInputMultiline: {
    minHeight: 100,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
