import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import EmptyState from '@components/common/EmptyState';
import { colors, spacing, typography } from '@constants/theme';

const FILTER_TAGS = ['all', 'friend requests', 'item updates', 'mark updates'];

export default function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <View style={styles.container}>
      {/* filter tags - horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {FILTER_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.filterTag, activeFilter === tag && styles.filterTagActive]}
            onPress={() => setActiveFilter(tag)}
          >
            <Text style={[styles.filterTagText, activeFilter === tag && styles.filterTagTextActive]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* empty state */}
      <View style={styles.content}>
        <EmptyState
          icon="notifications-outline"
          title="no notifications yet"
          description="you'll see marks and messages here"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterTag: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterTagActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTagText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  filterTagTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
