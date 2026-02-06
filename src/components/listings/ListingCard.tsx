import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Listing } from '@types';
import PlaceholderImage from '@components/common/PlaceholderImage';
import { colors, spacing, typography } from '@constants/theme';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
}

export default function ListingCard({ listing, onPress }: ListingCardProps) {
  const markCount = listing.markedBy.length;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <PlaceholderImage style={styles.image} />

      <View style={styles.infoSection}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>

        <Text style={styles.price}>${listing.price}</Text>

        <View style={styles.footer}>
          <Text style={styles.username} numberOfLines={1}>
            {listing.sellerUsername}
          </Text>

          {markCount > 0 && (
            <View style={styles.markBadge}>
              <Text style={styles.markCount}>{markCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.background,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  infoSection: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    lineHeight: typography.fontSize.sm * 1.3,
  },
  price: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  username: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    flex: 1,
  },
  markBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.error + '15',
  },
  markCount: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    fontWeight: typography.fontWeight.semibold,
  },
});
