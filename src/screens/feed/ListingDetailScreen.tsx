import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share, Modal, FlatList } from 'react-native';
import { useRoute, RouteProp, useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { FeedStackParamList, MainTabParamList, RootStackParamList } from '@navigation/types';
import { Ionicons } from '@expo/vector-icons';
import PhotoCarousel from '@components/listings/PhotoCarousel';
import Avatar from '@components/common/Avatar';
import { useListingDetail } from '@hooks/useListingDetail';
import { useAuth } from '@contexts/AuthContext';
import { createConversation } from '@services/firebase/messageService';
import { getUserProfile } from '@services/firebase/userService';
import { serializeConversation, Conversation, User } from '@types';
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
  const { isMarked, markCount, toggleMark, doubleTapMark, markAsSold, archive } = useListingDetail(listing);

  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [markedByUsers, setMarkedByUsers] = useState<User[]>([]);
  const [loadingBuyers, setLoadingBuyers] = useState(false);

  const isSeller = user?.uid === listing.sellerId;
  const isSold = listing.status === 'sold';
  const isArchived = listing.status === 'archived';
  const canMarkAsSold = isSeller && listing.status === 'available' && listing.markedBy.length > 0;
  const canArchive = isSeller && listing.status === 'available';

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

  const handleShowBuyerModal = async () => {
    setLoadingBuyers(true);
    setShowBuyerModal(true);
    try {
      // Fetch user profiles for all who marked
      const users = await Promise.all(
        listing.markedBy.map((userId) => getUserProfile(userId))
      );
      setMarkedByUsers(users.filter((u): u is User => u !== null));
    } catch (err) {
      Alert.alert('error', 'failed to load buyers');
    } finally {
      setLoadingBuyers(false);
    }
  };

  const handleSelectBuyer = async (buyerId: string) => {
    try {
      setShowBuyerModal(false);
      const transactionId = await markAsSold(buyerId);
      // Navigate to transaction success screen
      (navigation as any).navigate('TransactionSuccess', { transactionId });
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to mark as sold');
    }
  };

  const handleArchive = async () => {
    Alert.alert(
      'archive listing',
      'are you sure you want to archive this listing? it will be hidden from your profile.',
      [
        { text: 'cancel', style: 'cancel' },
        {
          text: 'archive',
          style: 'destructive',
          onPress: async () => {
            try {
              await archive();
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('error', err.message || 'failed to archive');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {/* photo carousel */}
        <PhotoCarousel photos={listing.photos} onDoubleTap={handleDoubleTap} />

        <View style={styles.content}>
          {/* title with share button */}
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{listing.title}</Text>
              {isSold && (
                <View style={styles.soldBadge}>
                  <Text style={styles.soldBadgeText}>sold</Text>
                </View>
              )}
            </View>
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

          {/* seller actions */}
          {isSeller && listing.status === 'available' && (
            <View style={styles.sellerActions}>
              {canMarkAsSold && (
                <TouchableOpacity
                  style={styles.sellerActionButton}
                  onPress={handleShowBuyerModal}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                  <Text style={styles.sellerActionText}>mark as sold</Text>
                </TouchableOpacity>
              )}
              {canArchive && (
                <TouchableOpacity
                  style={styles.sellerActionButton}
                  onPress={handleArchive}
                >
                  <Ionicons name="archive-outline" size={20} color={colors.textSecondary} />
                  <Text style={styles.sellerActionText}>archive</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* bottom action buttons */}
      {!isSeller && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.markButton,
              isMarked && styles.markButtonActive,
              (isSold || isArchived) && styles.markButtonDisabled,
            ]}
            onPress={handleMark}
            activeOpacity={0.8}
            disabled={isSold || isArchived}
          >
            <Ionicons
              name={isMarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isSold || isArchived ? colors.textSecondary : isMarked ? colors.text : '#FFFFFF'}
            />
            <Text
              style={[
                styles.markButtonText,
                isMarked && styles.markButtonTextActive,
                (isSold || isArchived) && styles.markButtonTextDisabled,
              ]}
            >
              {isSold ? 'sold' : isMarked ? 'marked' : 'mark it'}
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
      )}

      {/* buyer selection modal */}
      <Modal
        visible={showBuyerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBuyerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>select buyer</Text>
              <TouchableOpacity onPress={() => setShowBuyerModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {loadingBuyers ? (
              <Text style={styles.modalLoading}>loading...</Text>
            ) : (
              <FlatList
                data={markedByUsers}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.buyerItem}
                    onPress={() => handleSelectBuyer(item.uid)}
                  >
                    <Avatar uri={item.photoURL} size={40} username={item.username} />
                    <View style={styles.buyerInfo}>
                      <Text style={styles.buyerUsername}>@{item.username}</Text>
                      {item.displayName && (
                        <Text style={styles.buyerDisplayName}>{item.displayName}</Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
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
  titleContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  soldBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  soldBadgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
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
  sellerActions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  sellerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sellerActionText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
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
  markButtonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  markButtonTextDisabled: {
    color: colors.textSecondary,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  modalLoading: {
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  buyerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  buyerInfo: {
    flex: 1,
  },
  buyerUsername: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  buyerDisplayName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
