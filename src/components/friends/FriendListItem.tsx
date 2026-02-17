import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '@components/common/Avatar';
import { Friend } from '@types';
import { colors, spacing, typography } from '@constants/theme';

interface FriendListItemProps {
  friend: Friend;
  onPress: () => void;
}

export default function FriendListItem({ friend, onPress }: FriendListItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Avatar uri={friend.photoURL} size="medium" name={friend.displayName} />

      <View style={styles.info}>
        <Text style={styles.username}>{friend.username}</Text>
        <Text style={styles.displayName}>{friend.displayName}</Text>
      </View>
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
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  username: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  displayName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
