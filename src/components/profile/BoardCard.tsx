import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Board } from '@types/profile';
import { colors, spacing, borderRadius, typography } from '@constants/theme';

interface BoardCardProps {
  board: Board;
  onPress: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = spacing.sm;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.md * 3) / 2; // 2 columns with margins
const GRID_SIZE = (CARD_WIDTH - spacing.xs) / 2; // 2x2 grid

export default function BoardCard({ board, onPress }: BoardCardProps) {
  // show up to 4 preview photos in a 2x2 grid
  const previewPhotos = board.previewPhotos.slice(0, 4);

  // fill empty slots with placeholder if less than 4 photos
  const photoGrid = [...previewPhotos];
  while (photoGrid.length < 4) {
    photoGrid.push('');
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <Image
            source={{ uri: photoGrid[0] || undefined }}
            style={[styles.gridImage, styles.topLeft]}
          />
          <Image
            source={{ uri: photoGrid[1] || undefined }}
            style={[styles.gridImage, styles.topRight]}
          />
        </View>
        <View style={styles.gridRow}>
          <Image
            source={{ uri: photoGrid[2] || undefined }}
            style={[styles.gridImage, styles.bottomLeft]}
          />
          <Image
            source={{ uri: photoGrid[3] || undefined }}
            style={[styles.gridImage, styles.bottomRight]}
          />
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
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
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
    aspectRatio: 1, // square grid
  },
  gridRow: {
    flexDirection: 'row',
    flex: 1,
  },
  gridImage: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    backgroundColor: colors.border,
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
