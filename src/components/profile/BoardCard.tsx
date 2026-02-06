import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Board } from '@types/profile';
import PlaceholderImage from '@components/common/PlaceholderImage';
import { colors, spacing, borderRadius, typography } from '@constants/theme';

interface BoardCardProps {
  board: Board;
  onPress: () => void;
}

export default function BoardCard({ board, onPress }: BoardCardProps) {
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
        <Text style={styles.boardName} numberOfLines={1}>{board.name}</Text>
        <Text style={styles.itemCount}>{board.itemCount} items</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    backgroundColor: colors.background,
  },
  boardName: {
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
