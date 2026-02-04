import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, typography } from '@constants/theme';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  uri?: string;
  size?: AvatarSize;
  onPress?: () => void;
  name?: string; // for fallback initial
}

const SIZES: Record<AvatarSize, number> = {
  small: 32,
  medium: 48,
  large: 80,
  xlarge: 100,
};

const FONT_SIZES: Record<AvatarSize, number> = {
  small: typography.fontSize.sm,
  medium: typography.fontSize.lg,
  large: typography.fontSize.xxxl,
  xlarge: 40,
};

export default function Avatar({ uri, size = 'medium', onPress, name }: AvatarProps) {
  const avatarSize = SIZES[size];
  const fontSize = FONT_SIZES[size];

  const getInitial = () => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const content = (
    <View style={[styles.container, { width: avatarSize, height: avatarSize }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { width: avatarSize, height: avatarSize }]} />
      ) : (
        <View style={[styles.fallback, { width: avatarSize, height: avatarSize }]}>
          <Text style={[styles.initial, { fontSize }]}>{getInitial()}</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  image: {
    borderRadius: borderRadius.round,
    backgroundColor: colors.border,
  },
  fallback: {
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    color: colors.background,
    fontWeight: typography.fontWeight.semibold,
  },
});