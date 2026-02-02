import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { validateForm, emailRule, passwordRule } from '@utils/validation';
import { colors, spacing, typography } from '@constants/theme';

export default function LoginScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    const validationErrors = validateForm(
      { email, password },
      { email: emailRule, password: passwordRule }
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>mark.it</Text>
          <Text style={styles.subtitle}>friend-to-friend marketplace</Text>
        </View>

        <View style={styles.form}>
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

          <Button title="sign in" onPress={handleLogin} loading={loading} />

          <Button
            title="create account"
            onPress={() => navigation.navigate('Signup')}
            variant="outline"
          />
        </View>

        <Text style={styles.hint}>
          this is a hollow frame - firebase not required yet
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
    fontSize: typography.fontSize.xxxl,
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
