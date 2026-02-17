import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import EmptyState from '@components/common/EmptyState';
import { colors } from '@constants/theme';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <EmptyState
        icon={<Bell size={64} color={colors.textTertiary} />}
        title="no notifications yet"
        description="you'll see marks and messages here"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
