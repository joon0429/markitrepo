import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useRoute, RouteProp, useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { FeedStackParamList, MainTabParamList } from '@navigation/types';
import PhotoCarousel from '@components/listings/PhotoCarousel';
import Avatar from '@components/common/Avatar';
import { colors, spacing, typography } from '@constants/theme';

type ListingDetailRouteProp = RouteProp<FeedStackParamList, 'ListingDetail'>;

type ListingDetailNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FeedStackParamList, 'ListingDetail'>,
  BottomTabNavigationProp<MainTabParamList>
>;

export default function ListingDetailScreen() {
  const route = useRoute<ListingDetailRouteProp>();
  const navigation = useNavigation<ListingDetailNavigationProp>();
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
    // navigate to chat screen with this listing context
    // for now, show placeholder alert since chat integration needs conversation ID
    Alert.alert(
      'send message',
      `this would open a chat with ${listing.sellerUsername} about "${listing.title}"`,
      [{ text: 'ok' }]
    );
    // TODO: when firebase is integrated, create/navigate to conversation
    // navigation.navigate('MessagesStack', {
    //   screen: 'Chat',
    //   params: { conversationId: 'xxx', conversation: {...} }
    // });
  };

  const handleViewProfile = () => {
    // navigate to seller's profile
    Alert.alert(
      'view profile',
      `this would navigate to ${listing.sellerUsername}'s profile`,
      [{ text: 'ok' }]
    );
    // TODO: when user profile screen is added to navigation
    // navigation.navigate('ProfileStack', {
    //   screen: 'UserProfile',
    //   params: { userId: listing.sellerId }
    // });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `check out this ${listing.title} for $${listing.price} on mark.it!`,
        title: listing.title,
      });
    } catch (error) {
      Alert.alert('error', 'could not share listing');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* photo carousel */}
        <PhotoCarousel photos={listing.photos} onDoubleTap={handleDoubleTap} />

        <View style={styles.content}>
          {/* title with share button */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{listing.title}</Text>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
          </View>

          {/* seller info */}
          <TouchableOpacity style={styles.seller} activeOpacity={0.7} onPress={handleViewProfile}>
            <Avatar
              uri={listing.sellerPhotoURL}
              size="small"
              name={listing.sellerUsername}
            />
            <Text style={styles.sellerName}>{listing.sellerUsername}</Text>
          </TouchableOpacity>

          {/* marked by count */}
          {markCount > 0 && (
            <View style={styles.markCount}>
              <Text style={styles.markIcon}>🔖</Text>
              <Text style={styles.markText}>
                {markCount} {markCount === 1 ? 'person' : 'people'} marked it!
              </Text>
            </View>
          )}

          {/* description */}
          <Text style={styles.description}>{listing.description}</Text>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* bottom action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.markButton, isMarked && styles.markButtonActive]}
          onPress={handleMark}
          activeOpacity={0.8}
        >
          <Text style={styles.markButtonIcon}>{isMarked ? '🔖' : '🔖'}</Text>
          <Text style={[styles.markButtonText, isMarked && styles.markButtonTextActive]}>
            {isMarked ? 'marked' : 'mark it'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleMessageSeller}
          activeOpacity={0.8}
        >
          <Text style={styles.messageButtonText}>send message</Text>
          <Text style={styles.messageButtonIcon}>✈</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  shareButton: {
    padding: spacing.sm,
    marginLeft: spacing.md,
  },
  shareIcon: {
    fontSize: typography.fontSize.xl,
    color: colors.text,
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sellerName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  markCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  markIcon: {
    fontSize: typography.fontSize.md,
  },
  markText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: typography.fontSize.md * 1.6,
  },
  bottomSpacer: {
    height: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  markButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.text,
    gap: spacing.xs,
  },
  markButtonActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  markButtonIcon: {
    fontSize: typography.fontSize.md,
  },
  markButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
  markButtonTextActive: {
    color: colors.text,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: colors.background,
    gap: spacing.xs,
  },
  messageButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  messageButtonIcon: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
});
