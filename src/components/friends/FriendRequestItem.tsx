import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '@components/common/Avatar';
import { FriendRequestWithMutuals } from '@types';
import { colors, spacing, typography, borderRadius } from '@constants/theme';

interface FriendRequestItemProps {
  request: FriendRequestWithMutuals;
  onAccept: () => void;
  onDecline: () => void;
}

export default function FriendRequestItem({ request, onAccept, onDecline }: FriendRequestItemProps) {
  return (
    <View style={styles.container}>
      <Avatar uri={request.fromPhotoURL} size="medium" name={request.fromUsername} />

      <View style={styles.info}>
        <Text style={styles.username}>{request.fromUsername}</Text>
        <Text style={styles.mutualFriends}>
          {request.mutualFriendsCount} mutual {request.mutualFriendsCount === 1 ? 'friend' : 'friends'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept} activeOpacity={0.7}>
          <Text style={styles.acceptButtonText}>accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineButton} onPress={onDecline} activeOpacity={0.7}>
          <Text style={styles.declineButtonText}>decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  username: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  mutualFriends: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  acceptButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  acceptButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
  declineButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.textTertiary,
    borderRadius: borderRadius.md,
  },
  declineButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
});
