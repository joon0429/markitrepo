import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { validateForm, emailRule, passwordRule, displayNameRule } from '@utils/validation';
import { colors, spacing, typography } from '@constants/theme';

export default function SignupScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { signUp, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    displayName?: string;
  }>({});

  const handleSignup = async () => {
    const validationErrors = validateForm(
      { email, password, displayName },
      { email: emailRule, password: passwordRule, displayName: displayNameRule }
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      await signUp(email, password, displayName);
    } catch (error) {
      console.error('signup error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>create account</Text>
          <Text style={styles.subtitle}>join mark.it marketplace</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="display name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="your name"
            error={errors.displayName}
          />

          <Input
            label="email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="password"
            value={password}
            onChangeText={setPassword}
            placeholder="enter password"
            secureTextEntry
            error={errors.password}
          />

          <Button title="sign up" onPress={handleSignup} loading={loading} />

          <Button
            title="back to login"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
          />
        </View>

        <Text style={styles.hint}>
          mock authentication - no firebase required yet
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
    gap: spacing.md,
  },
  hint: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.lg,
  },
});
