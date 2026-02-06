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
      {/* profile picture and stats row */}
      <View style={styles.topRow}>
        <Avatar uri={user.photoURL} size="large" name={user.displayName} />

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.listingCount || 54}</Text>
            <Text style={styles.statLabel}>items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.followersCount || 2365}</Text>
            <Text style={styles.statLabel}>followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.followingCount || 2481}</Text>
            <Text style={styles.statLabel}>following</Text>
          </View>
        </View>
      </View>

      {/* username and bio */}
      <View style={styles.infoSection}>
        <Text style={styles.username}>{user.displayName}</Text>
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
  username: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
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
    backgroundColor: colors.divider,
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
    color: colors.background,
  },
});
