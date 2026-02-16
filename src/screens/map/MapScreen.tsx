import React from 'react';
import { View, StyleSheet } from 'react-native';
import EmptyState from '@components/common/EmptyState';
import { colors } from '@constants/theme';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <EmptyState
        icon="map-outline"
        title="map view coming soon"
        description="browse listings near you"
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
