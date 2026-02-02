import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FeedStackParamList } from '@navigation/types';
import PhotoCarousel from '@components/listings/PhotoCarousel';
import Button from '@components/common/Button';
import { colors, spacing, typography } from '@constants/theme';

type ListingDetailRouteProp = RouteProp<FeedStackParamList, 'ListingDetail'>;

export default function ListingDetailScreen() {
  const route = useRoute<ListingDetailRouteProp>();
  const { listing } = route.params;

  // mock current user id for marking logic
  const currentUserId = 'mock-user-1';
  const [isMarked, setIsMarked] = useState(
    listing.markedBy.includes(currentUserId)
  );
  const [markCount, setMarkCount] = useState(listing.markedBy.length);

  const handleMark = () => {
    if (isMarked) {
      // unmark
      setIsMarked(false);
      setMarkCount(markCount - 1);
    } else {
      // mark
      setIsMarked(true);
      setMarkCount(markCount + 1);
    }
  };

  const handleDoubleTap = () => {
    if (!isMarked) {
      setIsMarked(true);
      setMarkCount(markCount + 1);
    }
  };

  const handleMessageSeller = () => {
    // navigate to messages (placeholder for now)
    alert('messaging coming soon');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <PhotoCarousel photos={listing.photos} onDoubleTap={handleDoubleTap} />

      <View style={styles.content}>
        {/* title and price */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.closet}>{listing.closet}</Text>
          </View>
          <Text style={styles.price}>${listing.price}</Text>
        </View>

        {/* mark button */}
        <TouchableOpacity
          style={[styles.markButton, isMarked && styles.markButtonActive]}
          onPress={handleMark}
          activeOpacity={0.8}
        >
          <Text style={[styles.markIcon, isMarked && styles.markIconActive]}>
            {isMarked ? '♥' : '♡'}
          </Text>
          <Text style={[styles.markText, isMarked && styles.markTextActive]}>
            {isMarked ? 'marked' : 'mark it'}
            {markCount > 0 && ` (${markCount})`}
          </Text>
        </TouchableOpacity>

        {/* seller info */}
        <TouchableOpacity style={styles.seller} activeOpacity={0.7}>
          {listing.sellerPhotoURL && (
            <Image
              source={{ uri: listing.sellerPhotoURL }}
              style={styles.sellerAvatar}
            />
          )}
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{listing.sellerUsername}</Text>
            <Text style={styles.sellerMeta}>
              {listing.visibility === 'friends' ? 'friend' : 'friend of friend'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>description</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>

        {/* marked by (if any) */}
        {markCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              marked by {markCount} {markCount === 1 ? 'person' : 'people'}
            </Text>
            <Text style={styles.markedByHint}>
              social pressure feature - seller can see who marked this
            </Text>
          </View>
        )}

        {/* message seller button */}
        <Button
          title="message seller"
          onPress={handleMessageSeller}
          style={styles.messageButton}
        />

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  titleContainer: {
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  closet: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'lowercase',
  },
  price: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  markButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginBottom: spacing.lg,
  },
  markButtonActive: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  markIcon: {
    fontSize: typography.fontSize.xl,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  markIconActive: {
    color: colors.error,
  },
  markText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  markTextActive: {
    color: colors.error,
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: spacing.lg,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
    marginRight: spacing.md,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  sellerMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: typography.fontSize.md * 1.5,
  },
  markedByHint: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  messageButton: {
    marginTop: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
