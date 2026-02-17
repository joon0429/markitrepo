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
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

export default function ProfileHeader({
  user,
  stats,
  isOwnProfile,
  onAddFriend,
  onEditProfile,
  onFollowersPress,
  onFollowingPress,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      {/* profile picture and stats row */}
      <View style={styles.topRow}>
        <Avatar uri={user.photoURL} size="large" name={user.displayName} />

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.listingCount || 0}</Text>
            <Text style={styles.statLabel}>items</Text>
          </View>
          <TouchableOpacity style={styles.statItem} onPress={onFollowersPress} activeOpacity={0.7}>
            <Text style={styles.statNumber}>{stats.followersCount || 0}</Text>
            <Text style={styles.statLabel}>followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={onFollowingPress} activeOpacity={0.7}>
            <Text style={styles.statNumber}>{stats.followingCount || 0}</Text>
            <Text style={styles.statLabel}>following</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* name, username, and bio */}
      <View style={styles.infoSection}>
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        {user.bio && (
          <Text style={styles.bioText}>{user.bio}</Text>
        )}
      </View>

      {/* edit profile button */}
      {isOwnProfile ? (
        <TouchableOpacity style={styles.editButton} onPress={onEditProfile} activeOpacity={0.7}>
          <Text style={styles.editButtonText}>edit profile</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addFriendButton} onPress={onAddFriend} activeOpacity={0.7}>
          <Text style={styles.addFriendText}>add friend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginTop: spacing.xs / 2,
  },
  infoSection: {
    marginBottom: spacing.md,
  },
  displayName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  username: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bioText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  editButton: {
    width: '100%',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  addFriendButton: {
    width: '100%',
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  addFriendText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
});
