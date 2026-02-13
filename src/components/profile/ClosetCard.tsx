import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Closet } from '@types/profile';
import PlaceholderImage from '@components/common/PlaceholderImage';
import { colors, spacing, borderRadius, typography } from '@constants/theme';

interface ClosetCardProps {
  closet: Closet;
  onPress: () => void;
}

export default function ClosetCard({ closet, onPress }: ClosetCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <PlaceholderImage style={[styles.gridImage, styles.topLeft]} />
          <PlaceholderImage style={[styles.gridImage, styles.topRight]} />
        </View>
        <View style={styles.gridRow}>
          <PlaceholderImage style={[styles.gridImage, styles.bottomLeft]} />
          <PlaceholderImage style={[styles.gridImage, styles.bottomRight]} />
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.closetName} numberOfLines={1}>{closet.name}</Text>
        <Text style={styles.itemCount}>{closet.itemCount} items</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.xs,
    maxWidth: '50%',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  gridContainer: {
    width: '100%',
    aspectRatio: 1,
    gap: 1,
  },
  gridRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 1,
  },
  gridImage: {
    flex: 1,
  },
  topLeft: {
    borderTopLeftRadius: borderRadius.lg,
  },
  topRight: {
    borderTopRightRadius: borderRadius.lg,
  },
  bottomLeft: {
    borderBottomLeftRadius: borderRadius.lg,
  },
  bottomRight: {
    borderBottomRightRadius: borderRadius.lg,
  },
  infoSection: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
  },
  closetName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  itemCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
});
