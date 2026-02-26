import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useAuth } from '@contexts/AuthContext';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { colors, spacing, typography } from '@constants/theme';


export default function LoginScreen() {
  const { signIn, signUp, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch {
      // error is already set in auth context
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
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
            onChangeText={(text) => { setEmail(text); clearError(); }}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="password"
            value={password}
            onChangeText={(text) => { setPassword(text); clearError(); }}
            placeholder={isSignUp ? 'at least 6 characters' : 'enter password'}
            secureTextEntry
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Button
            title={isSignUp ? 'create account' : 'sign in'}
            onPress={handleSubmit}
            loading={loading}
          />

          <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'already have an account? sign in'
                : "don't have an account? create one"}
            </Text>
          </TouchableOpacity>

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
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toggleText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
  },

});
