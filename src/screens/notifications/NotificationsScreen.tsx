import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationsStackParamList } from '@navigation/types';
import { Ionicons } from '@expo/vector-icons';
import PlaceholderImage from '@components/common/PlaceholderImage';
import { colors, spacing, typography } from '@constants/theme';

type NotificationsNavigationProp = StackNavigationProp<NotificationsStackParamList, 'Notifications'>;

const FILTER_TAGS = ['all', 'friend requests', 'item updates', 'mark updates'];

interface Notification {
  id: string;
  type: 'follow' | 'mark' | 'like' | 'message' | 'friend_request';
  text: string;
  timestamp: string;
  actionLabel?: string;
  hasItemThumbnail?: boolean;
}

const priorityNotifications: Notification[] = [
  {
    id: 'p1',
    type: 'friend_request',
    text: 'alex_chen started following you.',
    timestamp: '12s',
    actionLabel: 'requested',
  },
  {
    id: 'p2',
    type: 'friend_request',
    text: 'maya.lin started following you.',
    timestamp: '45s',
    actionLabel: 'requested',
  },
  {
    id: 'p3',
    type: 'mark',
    text: 'jordan_w marked your vintage jacket listing.',
    timestamp: '2m',
    hasItemThumbnail: true,
  },
];

const last7DaysNotifications: Notification[] = [
  {
    id: 'w1',
    type: 'like',
    text: 'sam_k, priya.r and 4 others liked your listing: nike dunks low.',
    timestamp: '6h',
    hasItemThumbnail: true,
  },
  {
    id: 'w2',
    type: 'mark',
    text: 'taylor_m marked your mid century desk.',
    timestamp: '1d',
    hasItemThumbnail: true,
  },
  {
    id: 'w3',
    type: 'friend_request',
    text: 'chris.b and riley_j accepted your friend request.',
    timestamp: '1d',
    actionLabel: 'following',
  },
  {
    id: 'w4',
    type: 'mark',
    text: 'dana.w unmarked your leather boots listing.',
    timestamp: '2d',
    hasItemThumbnail: true,
  },
  {
    id: 'w5',
    type: 'friend_request',
    text: 'noah_p started following you.',
    timestamp: '3d',
    actionLabel: 'follow back',
  },
  {
    id: 'w6',
    type: 'like',
    text: 'emma.s liked your listing: cozy knit sweater.',
    timestamp: '4d',
    hasItemThumbnail: true,
  },
];

const last30DaysNotifications: Notification[] = [
  {
    id: 'm1',
    type: 'friend_request',
    text: 'olivia.k followed you back automatically.',
    timestamp: '8d',
    actionLabel: 'following',
  },
  {
    id: 'm2',
    type: 'mark',
    text: 'liam_t and 2 others marked your wooden bookshelf.',
    timestamp: '10d',
    hasItemThumbnail: true,
  },
  {
    id: 'm3',
    type: 'friend_request',
    text: 'ava.m started following you.',
    timestamp: '12d',
    actionLabel: 'following',
  },
  {
    id: 'm4',
    type: 'like',
    text: 'lucas_r, zoe.c and 8 others liked your listing: vintage denim jacket.',
    timestamp: '15d',
    hasItemThumbnail: true,
  },
  {
    id: 'm5',
    type: 'mark',
    text: 'mia_h marked your running shoes listing.',
    timestamp: '21d',
    hasItemThumbnail: true,
  },
  {
    id: 'm6',
    type: 'friend_request',
    text: 'ethan.w accepted your friend request.',
    timestamp: '25d',
    actionLabel: 'following',
  },
];

function NotificationItem({ item }: { item: Notification }) {
  return (
    <View style={styles.notifItem}>
      <PlaceholderImage style={styles.notifAvatar} />
      <View style={styles.notifContent}>
        <Text style={styles.notifText}>
          {item.text} <Text style={styles.notifTime}>{item.timestamp}</Text>
        </Text>
      </View>
      {item.actionLabel && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.actionLabel === 'following' && styles.actionButtonSecondary,
          ]}
        >
          <Text
            style={[
              styles.actionButtonText,
              item.actionLabel === 'following' && styles.actionButtonTextSecondary,
            ]}
          >
            {item.actionLabel}
          </Text>
        </TouchableOpacity>
      )}
      {item.hasItemThumbnail && (
        <PlaceholderImage style={styles.notifThumbnail} />
      )}
    </View>
  );
}

export default function NotificationsScreen() {
  const navigation = useNavigation<NotificationsNavigationProp>();
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>notifications</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Conversations')} style={styles.messagesButton}>
          <Ionicons name="chatbubble-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* filter tags - horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {FILTER_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.filterTag, activeFilter === tag && styles.filterTagActive]}
            onPress={() => setActiveFilter(tag)}
          >
            <Text style={[styles.filterTagText, activeFilter === tag && styles.filterTagTextActive]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* notification list */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* priority section */}
        <Text style={styles.sectionHeader}>priority</Text>
        {priorityNotifications.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}

        {/* last 7 days section */}
        <Text style={styles.sectionHeader}>last 7 days</Text>
        {last7DaysNotifications.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}

        {/* last 30 days section */}
        <Text style={styles.sectionHeader}>last 30 days</Text>
        {last30DaysNotifications.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  messagesButton: {
    padding: spacing.xs,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  filterTagActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterTagText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  filterTagTextActive: {
    color: colors.background,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  notifAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.sm + 4,
  },
  notifContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  notifText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: typography.fontSize.sm * 1.4,
  },
  notifTime: {
    color: colors.textTertiary,
    fontWeight: typography.fontWeight.regular,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary,
    minWidth: 90,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
  actionButtonTextSecondary: {
    color: colors.text,
  },
  notifThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
