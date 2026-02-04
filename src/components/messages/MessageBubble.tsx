import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import Avatar from '@components/common/Avatar';
import { Message } from '@types';
import { colors, spacing, typography, borderRadius } from '@constants/theme';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
}

export default function MessageBubble({ message, isOwnMessage, showAvatar = false, avatarUrl }: MessageBubbleProps) {
  const timestamp = format(message.timestamp.toDate(), 'h:mm a');

  return (
    <View style={[styles.container, isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer]}>
      {!isOwnMessage && showAvatar && (
        <Avatar uri={avatarUrl} size="small" name={message.senderUsername} />
      )}

      {!isOwnMessage && !showAvatar && <View style={styles.avatarSpacer} />}

      <View style={[styles.bubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.text, isOwnMessage ? styles.ownText : styles.otherText]}>
          {message.text}
        </Text>
      </View>

      {isOwnMessage && <View style={styles.avatarSpacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarSpacer: {
    width: 32,
    marginHorizontal: spacing.xs,
  },
  bubble: {
    maxWidth: '70%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.divider,
    borderBottomLeftRadius: 4,
    marginLeft: spacing.xs,
  },
  text: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md * 1.4,
  },
  ownText: {
    color: colors.background,
  },
  otherText: {
    color: colors.text,
  },
});
