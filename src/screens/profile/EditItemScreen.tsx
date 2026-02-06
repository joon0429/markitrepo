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
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import { mockListings } from '@services/mock/listings';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Dropdown from '@components/common/Dropdown';
import { colors, spacing, typography } from '@constants/theme';

type EditItemRouteProp = RouteProp<ProfileStackParamList, 'EditItem'>;
type EditItemNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditItem'>;

interface PhotoSlot {
  id: string;
  uri?: string;
}

export default function EditItemScreen() {
  const route = useRoute<EditItemRouteProp>();
  const navigation = useNavigation<EditItemNavigationProp>();
  const { listingId } = route.params;

  // find the listing to edit
  const listing = mockListings.find(l => l.id === listingId);

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text>listing not found</Text>
      </View>
    );
  }

  // form state (initialized with existing listing data)
  const [photos, setPhotos] = useState<PhotoSlot[]>(
    listing.photos.map((uri, index) => ({ id: String(index + 1), uri }))
  );
  const [title, setTitle] = useState(listing.title);
  const [price, setPrice] = useState(String(listing.price));
  const [description, setDescription] = useState(listing.description);
  const [closet, setCloset] = useState(listing.closet);
  const [isPrivate, setIsPrivate] = useState(listing.visibility === 'friends');
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
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      setPrice(parts[0] + '.' + parts.slice(1).join(''));
    } else {
      setPrice(cleaned);
    }
  };

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleSave = () => {
    Alert.alert(
      'success',
      'listing updated! (mock)',
      [
        {
          text: 'ok',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'delete listing',
      'are you sure you want to delete this listing? this cannot be undone.',
      [
        { text: 'cancel', style: 'cancel' },
        {
          text: 'delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('deleted', 'listing deleted (mock)');
            navigation.goBack();
          },
        },
      ]
    );
  };

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
          <Text style={styles.sectionTitle}>photos ({photoCount}/4)</Text>
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
            placeholder="add description..."
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
          <Text style={styles.sectionTitle}>privacy</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>make this a private listing</Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        {/* save button */}
        <Button
          title="save changes"
          onPress={handleSave}
          style={styles.saveButton}
        />

        {/* delete button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>delete listing</Text>
        </TouchableOpacity>

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
    color: colors.background,
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
  saveButton: {
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
