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
      <Avatar uri={request.fromPhotoURL} size="large" name={request.fromUsername} />

      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.displayName}>{request.fromUsername}</Text>
          {request.mutualFriendsCount > 0 && (
            <Text style={styles.mutualText}>
              followed by {request.mutualFriendsCount} mutual {request.mutualFriendsCount === 1 ? 'friend' : 'friends'}
            </Text>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.confirmButton} onPress={onAccept} activeOpacity={0.7}>
            <Text style={styles.confirmButtonText}>confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDecline} activeOpacity={0.7}>
            <Text style={styles.deleteButtonText}>delete</Text>
          </TouchableOpacity>
        </View>
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
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  info: {
    marginBottom: spacing.sm,
  },
  displayName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  mutualText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
});
