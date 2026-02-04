import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '@components/common/Avatar';
import { User } from '@types';
import { UserStats } from '@types/profile';
import { colors, spacing, typography, borderRadius } from '@constants/theme';

interface ProfileHeaderProps {
  user: User;
  stats: UserStats;
  isOwnProfile: boolean;
  onAddFriend?: () => void;
  onEditProfile?: () => void;
}

export default function ProfileHeader({ user, stats, isOwnProfile, onAddFriend, onEditProfile }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Avatar uri={user.photoURL} size="large" name={user.displayName} />
      </View>

      <Text style={styles.username}>{user.displayName}</Text>

      <Text style={styles.stats}>
        {stats.friendCount} friends • {stats.salesCount} sales
      </Text>

      <View style={styles.buttonRow}>
        {isOwnProfile ? (
          <TouchableOpacity style={styles.editButton} onPress={onEditProfile} activeOpacity={0.7}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addFriendButton} onPress={onAddFriend} activeOpacity={0.7}>
            <Text style={styles.addFriendText}>+ add friend</Text>
          </TouchableOpacity>
        )}
      </View>

      {user.bio && (
        <View style={styles.bioSection}>
          <Text style={styles.bioIcon}>📢</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },
  topSection: {
    marginBottom: spacing.sm,
  },
  username: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stats: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  addFriendButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  addFriendText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
  editButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.divider,
    borderRadius: borderRadius.md,
  },
  editIcon: {
    fontSize: typography.fontSize.md,
  },
  bioSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.divider,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    width: '100%',
  },
  bioIcon: {
    fontSize: typography.fontSize.md,
    marginRight: spacing.sm,
  },
  bioText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: typography.fontSize.sm * 1.5,
  },
});
