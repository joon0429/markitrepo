import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { colors, spacing, typography } from '@constants/theme';

interface PhotoSlot {
  id: string;
  uri?: string;
}

export default function CreateListingScreen() {
  const navigation = useNavigation();

  // form state
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [closet, setCloset] = useState('');
  const [visibility, setVisibility] = useState<'friends' | 'friends_plus'>('friends');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddPhoto = (slotId: string) => {
    // mock image picker - in real implementation, use expo-image-picker
    Alert.alert(
      'add photo',
      'choose source',
      [
        {
          text: 'camera',
          onPress: () => mockAddPhoto(slotId),
        },
        {
          text: 'photo library',
          onPress: () => mockAddPhoto(slotId),
        },
        {
          text: 'cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const mockAddPhoto = (slotId: string) => {
    // mock photo URL for demonstration
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const timestamp = Date.now();
    const mockPhotoUrl = `https://picsum.photos/800/1000?random=${timestamp}`;
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === slotId ? { ...photo, uri: mockPhotoUrl } : photo
      )
    );
  };

  const handleRemovePhoto = (slotId: string) => {
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === slotId ? { ...photo, uri: undefined } : photo
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // check if at least one photo
    const hasPhoto = photos.some(photo => photo.uri);
    if (!hasPhoto) {
      newErrors.photos = 'at least one photo is required';
    }

    // check title
    if (!title.trim()) {
      newErrors.title = 'title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'title must be at least 3 characters';
    }

    // check price
    if (!price.trim()) {
      newErrors.price = 'price is required';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'price must be a positive number';
    }

    // check description
    if (!description.trim()) {
      newErrors.description = 'description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'description must be at least 10 characters';
    }

    // check closet
    if (!closet.trim()) {
      newErrors.closet = 'closet is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      return;
    }

    // mock listing creation
    Alert.alert(
      'success',
      'listing created! (mock)',
      [
        {
          text: 'ok',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  // count how many photos have been added
  const photoCount = photos.filter(photo => photo.uri).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* photo picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            photos ({photoCount}/4)
            {errors.photos && <Text style={styles.errorInline}> - {errors.photos}</Text>}
          </Text>
          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={photo.id} style={styles.photoSlot}>
                {photo.uri ? (
                  <TouchableOpacity
                    style={styles.photoContainer}
                    onPress={() => handleRemovePhoto(photo.id)}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri: photo.uri }} style={styles.photo} />
                    <View style={styles.removeButton}>
                      <Text style={styles.removeButtonText}>×</Text>
                    </View>
                    {index === 0 && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryBadgeText}>cover</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.photoPlaceholder}
                    onPress={() => handleAddPhoto(photo.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.photoPlaceholderIcon}>+</Text>
                    <Text style={styles.photoPlaceholderText}>
                      {index === 0 ? 'add cover photo' : 'add photo'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* title */}
        <View style={styles.section}>
          <Input
            label="title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. vintage levi's denim jacket"
            error={errors.title}
          />
        </View>

        {/* price */}
        <View style={styles.section}>
          <Input
            label="price"
            value={price}
            onChangeText={setPrice}
            placeholder="0"
            keyboardType="numeric"
            error={errors.price}
          />
        </View>

        {/* description */}
        <View style={styles.section}>
          <Input
            label="description"
            value={description}
            onChangeText={setDescription}
            placeholder="describe the condition, size, and why you're selling"
            multiline
            numberOfLines={4}
            error={errors.description}
          />
        </View>

        {/* closet */}
        <View style={styles.section}>
          <Input
            label="closet"
            value={closet}
            onChangeText={setCloset}
            placeholder="e.g. vintage finds, sneakers, electronics"
            error={errors.closet}
          />
          <Text style={styles.hint}>
            organize your items by creating custom closets
          </Text>
        </View>

        {/* visibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>who can see this?</Text>
          <View style={styles.visibilityButtons}>
            <TouchableOpacity
              style={[
                styles.visibilityButton,
                visibility === 'friends' && styles.visibilityButtonActive,
              ]}
              onPress={() => setVisibility('friends')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.visibilityButtonText,
                  visibility === 'friends' && styles.visibilityButtonTextActive,
                ]}
              >
                friends only
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.visibilityButton,
                visibility === 'friends_plus' && styles.visibilityButtonActive,
              ]}
              onPress={() => setVisibility('friends_plus')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.visibilityButtonText,
                  visibility === 'friends_plus' && styles.visibilityButtonTextActive,
                ]}
              >
                friends + friends of friends
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* create button */}
        <Button
          title="create listing"
          onPress={handleCreate}
          style={styles.createButton}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  errorInline: {
    color: colors.error,
    textTransform: 'none',
    fontSize: typography.fontSize.xs,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  photoSlot: {
    width: '50%',
    padding: spacing.xs,
  },
  photoContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.background,
    fontSize: 24,
    lineHeight: 24,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  primaryBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
  photoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderIcon: {
    fontSize: 32,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  photoPlaceholderText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  hint: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  visibilityButtons: {
    gap: spacing.sm,
  },
  visibilityButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  visibilityButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  visibilityButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  visibilityButtonTextActive: {
    color: colors.primary,
  },
  createButton: {
    marginTop: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
