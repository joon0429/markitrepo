import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import EmptyState from '@components/common/EmptyState';
import { colors } from '@constants/theme';

type PlaceholderParams = { title: string; description?: string };

export default function SettingsPlaceholderScreen() {
  const route = useRoute();
  const { description } = (route.params as PlaceholderParams) || {};

  return (
    <View style={styles.container}>
      <EmptyState
        icon="construct-outline"
        title="coming soon!"
        description={description}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
});
