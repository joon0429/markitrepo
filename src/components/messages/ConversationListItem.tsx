import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@components/common/Avatar';
import { Conversation } from '@types';
import { colors, spacing, typography } from '@constants/theme';

interface ConversationListItemProps {
  conversation: Conversation;
  currentUserId: string;
  onPress: () => void;
}

export default function ConversationListItem({ conversation, currentUserId, onPress }: ConversationListItemProps) {
  // get other participant
  const otherUserId = conversation.participantIds.find(id => id !== currentUserId) || '';
  const otherParticipant = conversation.participants[otherUserId];

  const unreadCount = conversation.unreadCount[currentUserId] || 0;
  const isUnread = unreadCount > 0;

  const lastMessageTime = conversation.lastMessage
    ? formatDistanceToNow(conversation.lastMessage.timestamp.toDate(), { addSuffix: false })
    : '';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Avatar uri={otherParticipant?.photoURL} size="medium" name={otherParticipant?.username} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.username, isUnread && styles.usernameUnread]}>
            {otherParticipant?.username || 'unknown'}
          </Text>
          <View style={styles.metaRow}>
            {isUnread && <View style={styles.unreadDot} />}
            <Text style={styles.timestamp}>{lastMessageTime}</Text>
          </View>
        </View>

        <Text style={[styles.preview, isUnread && styles.previewUnread]} numberOfLines={2}>
          {conversation.lastMessage?.text || 'no messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs / 2,
  },
  username: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
    color: colors.text,
    flex: 1,
  },
  usernameUnread: {
    fontWeight: typography.fontWeight.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  preview: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.4,
  },
  previewUnread: {
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
});
