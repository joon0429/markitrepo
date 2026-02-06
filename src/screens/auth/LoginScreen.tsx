import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@contexts/AuthContext';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { colors, spacing, typography } from '@constants/theme';

export default function LoginScreen() {
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

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
          />

          <Input
            label="password"
            value={password}
            onChangeText={setPassword}
            placeholder="enter password"
            secureTextEntry
          />

          <Button title="sign in" onPress={handleLogin} loading={loading} />
        </View>

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
