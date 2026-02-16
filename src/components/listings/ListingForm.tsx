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
import { TextInput as PaperTextInput } from 'react-native-paper';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Dropdown from '@components/common/Dropdown';
import { colors, spacing, typography } from '@constants/theme';

interface PhotoSlot {
  id: string;
  uri?: string;
}

export interface ListingFormData {
  title: string;
  description: string;
  price: string;
  photos: PhotoSlot[];
  closet: string;
  isPrivate: boolean;
}

interface ListingFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    title: string;
    description: string;
    price: string;
    photos: PhotoSlot[];
    closet: string;
    isPrivate: boolean;
  };
  loading?: boolean;
  onSubmit: (data: ListingFormData) => Promise<void>;
  onDelete?: () => void;
  submitLabel?: string;
}

const TITLE_LIMIT = 50;
const DESCRIPTION_WORD_LIMIT = 50;

const closetOptions = [
  { label: 'unnamed', value: 'unnamed' },
  { label: 'accessories', value: 'accessories' },
  { label: 'clothes', value: 'clothes' },
  { label: 'furniture', value: 'furniture' },
  { label: 'shoes', value: 'shoes' },
  { label: 'add more...', value: 'add_more' },
];

const defaultPhotos: PhotoSlot[] = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
];

export default function ListingForm({
  mode,
  initialData,
  loading = false,
  onSubmit,
  onDelete,
  submitLabel,
}: ListingFormProps) {
  const [photos, setPhotos] = useState<PhotoSlot[]>(
    initialData?.photos || defaultPhotos
  );
  const [title, setTitle] = useState(initialData?.title || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [closet, setCloset] = useState(initialData?.closet || '');
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate || false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleAddPhoto = (slotId: string) => {
    Alert.alert(
      'can upload picture!',
      'this will use the apple ui to take a photo or choose from camera roll',
      [{ text: 'ok', onPress: () => mockAddPhoto(slotId) }]
    );
  };

  const mockAddPhoto = (slotId: string) => {
    const timestamp = Date.now();
    const mockPhotoUrl = `https://picsum.photos/800/1000?random=${timestamp}`;
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === slotId ? { ...photo, uri: mockPhotoUrl } : photo
      )
    );
  };

  const handleRemovePhoto = (slotId: string) => {
    setPhotos(prev =>
      prev.map(photo =>
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
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount <= DESCRIPTION_WORD_LIMIT || text.length < description.length) {
      setDescription(text);
    }
  };

  const handlePriceChange = (text: string) => {
    let cleaned = text.replace(/[^0-9.]/g, '');
    const dotIndex = cleaned.indexOf('.');
    if (dotIndex !== -1) {
      cleaned = cleaned.slice(0, dotIndex + 1) + cleaned.slice(dotIndex + 1).replace(/\./g, '');
      const decimals = cleaned.slice(dotIndex + 1);
      if (decimals.length > 2) {
        cleaned = cleaned.slice(0, dotIndex + 3);
      }
    }
    setPrice(cleaned);
    const num = parseFloat(cleaned);
    if (!isNaN(num) && num > 9999.99) {
      setErrors(prev => ({ ...prev, price: 'price limit $10k' }));
    } else {
      setErrors(prev => {
        const { price: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'item name is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'item name must be at least 3 characters';
    } else if (title.length > TITLE_LIMIT) {
      newErrors.title = `item name must be ${TITLE_LIMIT} characters or less`;
    }

    if (!price.trim()) {
      newErrors.price = 'price is required';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'price must be a positive number';
    } else if (Number(price) > 9999.99) {
      newErrors.price = 'maximum price is $9,999.99';
    }

    const wordCount = getWordCount(description);
    if (!description.trim()) {
      newErrors.description = 'description is required';
    } else if (wordCount > DESCRIPTION_WORD_LIMIT) {
      newErrors.description = `description must be ${DESCRIPTION_WORD_LIMIT} words or less`;
    }

    if (!closet.trim()) {
      newErrors.closet = 'closet is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        price,
        photos,
        closet,
        isPrivate,
      });
    } catch (err: any) {
      Alert.alert('error', err.message || `failed to ${mode} listing`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClosetChange = (value: string) => {
    if (value === 'add_more') {
      Alert.prompt(
        'create new closet',
        'enter a name for your new closet:',
        [
          { text: 'cancel', style: 'cancel' },
          {
            text: 'create',
            onPress: (inputValue) => {
              if (inputValue && inputValue.trim()) {
                setCloset(inputValue.trim().toLowerCase());
              }
            },
          },
        ],
        'plain-text'
      );
    } else {
      setCloset(value);
    }
  };

  const photoCount = photos.filter(p => p.uri).length;

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
            {mode === 'create' ? 'add photos' : 'photos'} ({photoCount}/4)
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
                      <Text style={styles.removeButtonText}>x</Text>
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
          <Input
            floatingLabel
            label="item name"
            value={title}
            onChangeText={handleTitleChange}
            placeholder="add item name..."
            error={errors.title}
          />
          <Text style={styles.counterBelow}>{title.length}/{TITLE_LIMIT}</Text>
        </View>

        {/* price */}
        <View style={styles.section}>
          <Input
            floatingLabel
            label="price"
            value={price}
            onChangeText={handlePriceChange}
            placeholder="0.00"
            keyboardType="decimal-pad"
            left={<PaperTextInput.Affix text="$" />}
            error={errors.price}
          />
        </View>

        {/* description */}
        <View style={styles.section}>
          <Input
            floatingLabel
            label="description"
            value={description}
            onChangeText={handleDescriptionChange}
            placeholder="add description (size, condition, and so on)"
            multiline
            numberOfLines={4}
            error={errors.description}
          />
          <Text style={styles.counterBelow}>
            {getWordCount(description)}/{DESCRIPTION_WORD_LIMIT} words
          </Text>
        </View>

        {/* closet */}
        <View style={styles.section}>
          <Dropdown
            label="closet"
            value={closet}
            onChange={handleClosetChange}
            options={closetOptions}
            placeholder="select a closet..."
            error={errors.closet}
          />
        </View>

        {/* visibility toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>mutual friends toggle</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>make private listing</Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        {/* submit button */}
        <Button
          title={submitLabel || (mode === 'create' ? 'add listing' : 'save changes')}
          onPress={handleSubmit}
          loading={submitting || loading}
          style={styles.submitButton}
        />

        {/* delete button (edit mode only) */}
        {mode === 'edit' && onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>delete listing</Text>
          </TouchableOpacity>
        )}

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
    color: colors.white,
    fontSize: 16,
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
  counterBelow: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
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
  submitButton: {
    marginTop: spacing.md,
  },
  deleteButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.error,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
