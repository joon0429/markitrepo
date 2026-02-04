import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '@components/common/Avatar';
import { Friend } from '@types';
import { colors, spacing, typography } from '@constants/theme';

interface FriendListItemProps {
  friend: Friend;
  onPress: () => void;
  onMessage?: () => void;
}

export default function FriendListItem({ friend, onPress, onMessage }: FriendListItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Avatar uri={friend.photoURL} size="medium" name={friend.displayName} />

      <View style={styles.info}>
        <Text style={styles.username}>{friend.displayName}</Text>
        <Text style={styles.mutualFriends}>
          {friend.mutualFriendsCount} mutual {friend.mutualFriendsCount === 1 ? 'friend' : 'friends'}
        </Text>
      </View>

      {onMessage && (
        <TouchableOpacity
          style={styles.messageButton}
          onPress={(e) => {
            e.stopPropagation();
            onMessage();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.messageButtonText}>message</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
  messageButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
  },
  messageButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});
