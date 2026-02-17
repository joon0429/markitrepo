import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronRight } from 'lucide-react-native';
import { ProfileStackParamList } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { colors, spacing, typography } from '@constants/theme';

type SettingsNavigationProp = StackNavigationProp<ProfileStackParamList, 'Settings'>;

interface SettingsRow {
  label: string;
  description?: string;
  isLogout?: boolean;
  route?: 'ArchivedListings' | 'TransactionHistory';
  routeParams?: any;
}

const SETTINGS_ROWS: SettingsRow[] = [
  {
    label: 'account management',
    description: 'personal information, email, phone number, password, change password, deactivate account, delete account',
  },
  {
    label: 'notifications',
  },
  {
    label: 'social management',
    description: 'account privacy, blocked people, add new friends',
  },
  {
    label: 'account privacy',
  },
  {
    label: 'privacy and data management',
  },
  {
    label: 'archived listings',
    route: 'ArchivedListings',
  },
  {
    label: 'purchase history',
    route: 'TransactionHistory',
    routeParams: { type: 'purchases' },
  },
  {
    label: 'sales history',
    route: 'TransactionHistory',
    routeParams: { type: 'sales' },
  },
  {
    label: 'terms of service',
  },
  {
    label: 'privacy policy',
  },
  {
    label: 'log out',
    isLogout: true,
  },
];

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsNavigationProp>();
  const { signOut } = useAuth();

  const handlePress = async (row: SettingsRow) => {
    if (row.isLogout) {
      Alert.alert(
        'log out',
        'are you sure you want to log out?',
        [
          { text: 'cancel', style: 'cancel' },
          {
            text: 'log out',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
              } catch (err) {
                Alert.alert('error', 'failed to log out');
              }
            },
          },
        ]
      );
      return;
    }

    if (row.route) {
      navigation.navigate(row.route as any, row.routeParams);
      return;
    }

    navigation.navigate('SettingsPlaceholder', {
      title: row.label,
      description: row.description,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      {SETTINGS_ROWS.map((row, index) => (
        <TouchableOpacity
          key={row.label}
          style={[
            styles.row,
            index < SETTINGS_ROWS.length - 1 && styles.rowBorder,
          ]}
          onPress={() => handlePress(row)}
          activeOpacity={0.7}
        >
          <Text style={[styles.rowLabel, row.isLogout && styles.logoutLabel]}>
            {row.label}
          </Text>
          {!row.isLogout && (
            <ChevronRight size={20} color={colors.textTertiary} />
          )}
        </TouchableOpacity>
      ))}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
    color: colors.text,
  },
  logoutLabel: {
    color: colors.error,
    fontWeight: typography.fontWeight.semibold,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
