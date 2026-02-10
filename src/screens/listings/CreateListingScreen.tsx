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
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Dropdown from '@components/common/Dropdown';
import { useAuth } from '@contexts/AuthContext';
import { createListing } from '@services/firebase/listingService';
import { CreateListingInput } from '@types';
import { colors, spacing, typography } from '@constants/theme';

interface PhotoSlot {
  id: string;
  uri?: string;
}

export default function CreateListingScreen() {
  const navigation = useNavigation();
  const { user, userProfile } = useAuth();
  const [creating, setCreating] = useState(false);

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
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // closet options for dropdown
  const closetOptions = [
    { label: 'unnamed', value: 'unnamed' },
    { label: 'clothes', value: 'clothes' },
    { label: 'shoes', value: 'shoes' },
    { label: 'furniture', value: 'furniture' },
    { label: 'add more...', value: 'add_more' },
  ];

  // character and word limits
  const TITLE_LIMIT = 50;
  const DESCRIPTION_WORD_LIMIT = 50;

  const handleAddPhoto = (slotId: string) => {
    // placeholder for image picker - in real implementation, use expo-image-picker
    Alert.alert(
      'can upload picture!',
      'this will use the apple ui to take a photo or choose from camera roll',
      [
        {
          text: 'ok',
          onPress: () => mockAddPhoto(slotId),
        },
      ]
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

  const handleTitleChange = (text: string) => {
    if (text.length <= TITLE_LIMIT) {
      setTitle(text);
    }
  };

  const handleDescriptionChange = (text: string) => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount <= DESCRIPTION_WORD_LIMIT || text.length < description.length) {
      setDescription(text);
    }
  };

  const handlePriceChange = (text: string) => {
    // remove non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      setPrice(parts[0] + '.' + parts.slice(1).join(''));
    } else {
      setPrice(cleaned);
    }
  };

  const formatPriceDisplay = (value: string): string => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return `$${num.toFixed(2)}`;
  };

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // check if at least one photo
    const hasPhoto = photos.some(photo => photo.uri);
    if (!hasPhoto) {
      newErrors.photos = 'at least one photo is required';
    }

    // check title (max 50 characters)
    if (!title.trim()) {
      newErrors.title = 'item name is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'item name must be at least 3 characters';
    } else if (title.length > TITLE_LIMIT) {
      newErrors.title = `item name must be ${TITLE_LIMIT} characters or less`;
    }

    // check price (must be valid number)
    if (!price.trim()) {
      newErrors.price = 'price is required';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'price must be a positive number';
    }

    // check description (max 50 words)
    const wordCount = getWordCount(description);
    if (!description.trim()) {
      newErrors.description = 'description is required';
    } else if (wordCount < 3) {
      newErrors.description = 'description must be at least 3 words';
    } else if (wordCount > DESCRIPTION_WORD_LIMIT) {
      newErrors.description = `description must be ${DESCRIPTION_WORD_LIMIT} words or less`;
    }

    // check closet
    if (!closet.trim()) {
      newErrors.closet = 'closet is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm() || !user?.uid || !userProfile?.username) {
      return;
    }

    setCreating(true);
    try {
      const input: CreateListingInput = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        photoURIs: photos.filter(p => p.uri).map(p => p.uri!),
        closet: closet || 'unnamed',
        category: undefined,
        visibility: isPrivate ? 'friends' : 'friends_plus',
      };

      await createListing(user.uid, userProfile.username, input);

      Alert.alert(
        'success',
        'listing created!',
        [
          {
            text: 'ok',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to create listing');
    } finally {
      setCreating(false);
    }
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
        showsVerticalScrollIndicator={true}
      >
        {/* photo picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            add photos ({photoCount}/4)
            {errors.photos && <Text style={styles.errorInline}> - {errors.photos}</Text>}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoRow}
            contentContainerStyle={styles.photoRowContent}
          >
            {photos.map((photo, index) => (
              <View key={photo.id} style={styles.photoSlot}>
                {photo.uri ? (
                  <TouchableOpacity
                    style={[
                      styles.photoContainer,
                      index === 0 && styles.photoContainerFirst,
                    ]}
                    onPress={() => handleRemovePhoto(photo.id)}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri: photo.uri }} style={styles.photo} />
                    <View style={styles.removeButton}>
                      <Text style={styles.removeButtonText}>×</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.photoPlaceholder,
                      index === 0 && styles.photoPlaceholderFirst,
                    ]}
                    onPress={() => handleAddPhoto(photo.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.photoPlaceholderIcon}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* item name */}
        <View style={styles.section}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>item name</Text>
            <Text style={styles.charCount}>{title.length}/{TITLE_LIMIT}</Text>
          </View>
          <Input
            value={title}
            onChangeText={handleTitleChange}
            placeholder="add title..."
            error={errors.title}
          />
        </View>

        {/* price */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>price</Text>
          <Input
            value={price}
            onChangeText={handlePriceChange}
            placeholder="$0.00"
            keyboardType="decimal-pad"
            error={errors.price}
          />
        </View>

        {/* description */}
        <View style={styles.section}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>description</Text>
            <Text style={styles.charCount}>
              {getWordCount(description)}/{DESCRIPTION_WORD_LIMIT} words
            </Text>
          </View>
          <Input
            value={description}
            onChangeText={handleDescriptionChange}
            placeholder="example: gray tommy hilfiger t-shirt, large, worn maybe 10 times? sort of long."
            multiline
            numberOfLines={4}
            error={errors.description}
          />
        </View>

        {/* closet */}
        <View style={styles.section}>
          <Dropdown
            label="board / closet"
            value={closet}
            onChange={(value) => {
              if (value === 'add_more') {
                Alert.alert('add more boards', 'create custom boards (coming soon)');
              } else {
                setCloset(value);
              }
            }}
            options={closetOptions}
            placeholder="select a board..."
            error={errors.closet}
          />
        </View>

        {/* visibility toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>why are you selling this?</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>make this a private listing</Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        {/* create button */}
        <Button
          title="add listing"
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
  photoRow: {
    marginHorizontal: -spacing.lg,
  },
  photoRowContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  photoSlot: {
    width: 110,
    height: 110,
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.border,
  },
  photoContainerFirst: {
    borderColor: colors.textSecondary,
    borderWidth: 3,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: typography.fontWeight.bold,
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderFirst: {
    borderColor: colors.textSecondary,
    borderWidth: 3,
    backgroundColor: colors.surface + '99',
  },
  photoPlaceholderIcon: {
    fontSize: 32,
    color: colors.textTertiary,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  inputLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  charCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  toggleLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  createButton: {
    marginTop: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
