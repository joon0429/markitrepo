import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '@navigation/types';
import EmptyState from '@components/common/EmptyState';
import { colors } from '@constants/theme';

type SettingsPlaceholderRouteProp = RouteProp<ProfileStackParamList, 'SettingsPlaceholder'>;

export default function SettingsPlaceholderScreen() {
  const route = useRoute<SettingsPlaceholderRouteProp>();
  const { description } = route.params;

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
