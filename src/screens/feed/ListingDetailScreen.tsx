import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useRoute, RouteProp, useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { FeedStackParamList, MainTabParamList } from '@navigation/types';
import { Ionicons } from '@expo/vector-icons';
import PhotoCarousel from '@components/listings/PhotoCarousel';
import Avatar from '@components/common/Avatar';
import { useListingDetail } from '@hooks/useListingDetail';
import { useAuth } from '@contexts/AuthContext';
import { createConversation } from '@services/firebase/messageService';
import { serializeConversation, Conversation } from '@types';
import { Timestamp } from 'firebase/firestore';
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

  const { user, userProfile } = useAuth();
  const { isMarked, markCount, toggleMark, doubleTapMark } = useListingDetail(listing);

  const handleMark = () => {
    toggleMark();
  };

  const handleDoubleTap = () => {
    doubleTapMark();
  };

  const handleMessageSeller = async () => {
    if (!user?.uid || !userProfile?.username) return;

    // don't message yourself
    if (listing.sellerId === user.uid) {
      Alert.alert('', 'this is your own listing');
      return;
    }

    try {
      const conversationId = await createConversation(
        listing.id,
        listing.title,
        user.uid,
        userProfile.username,
        listing.sellerId,
        listing.sellerUsername
      );

      // build a conversation object for navigation
      const now = Timestamp.now();
      const conv: Conversation = {
        id: conversationId,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPhotoURL: listing.photos?.[0] || 'placeholder',
        participantIds: [user.uid, listing.sellerId],
        participants: {
          [user.uid]: { username: userProfile.username },
          [listing.sellerId]: { username: listing.sellerUsername },
        },
        unreadCount: { [user.uid]: 0, [listing.sellerId]: 0 },
        createdAt: now,
        updatedAt: now,
      };

      navigation.navigate('Chat' as any, {
        conversationId,
        conversation: serializeConversation(conv),
      });
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to start conversation');
    }
  };

  const handleViewProfile = () => {
    Alert.alert(
      'view profile',
      `${listing.sellerUsername}'s profile (coming soon)`,
      [{ text: 'ok' }]
    );
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
      <ScrollView showsVerticalScrollIndicator={true}>
        {/* photo carousel */}
        <PhotoCarousel photos={listing.photos} onDoubleTap={handleDoubleTap} />

        <View style={styles.content}>
          {/* title with share button */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{listing.title}</Text>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Ionicons name="share-outline" size={22} color={colors.text} />
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
              <Ionicons name="bookmark" size={18} color={colors.primary} />
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
          <Ionicons name={isMarked ? 'bookmark' : 'bookmark-outline'} size={18} color={isMarked ? colors.text : '#FFFFFF'} />
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
          <Ionicons name="send-outline" size={16} color={colors.text} />
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
    backgroundColor: colors.primary,
    gap: spacing.xs,
  },
  markButtonActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  markButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
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
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  messageButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
});
