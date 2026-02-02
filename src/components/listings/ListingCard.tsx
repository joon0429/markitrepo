import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Listing } from '@types';
import { colors, spacing, typography } from '@constants/theme';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = spacing.sm;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.md * 3) / 2; // 2 columns with margins

export default function ListingCard({ listing, onPress }: ListingCardProps) {
  const markCount = listing.markedBy.length;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: listing.photos[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {listing.title}
          </Text>

          <Text style={styles.price}>${listing.price}</Text>

          <View style={styles.footer}>
            <View style={styles.seller}>
              {listing.sellerPhotoURL && (
                <Image
                  source={{ uri: listing.sellerPhotoURL }}
                  style={styles.avatar}
                />
              )}
              <Text style={styles.username} numberOfLines={1}>
                {listing.sellerUsername}
              </Text>
            </View>

            {markCount > 0 && (
              <View style={styles.markBadge}>
                <Text style={styles.markCount}>♥ {markCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
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
    height: CARD_WIDTH * 1.3, // aspect ratio for varied heights
    backgroundColor: colors.border,
  },
  overlay: {
    padding: spacing.sm,
  },
  content: {
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
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
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
    backgroundColor: colors.error + '15', // semi-transparent red
  },
  markCount: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    fontWeight: typography.fontWeight.semibold,
  },
});
