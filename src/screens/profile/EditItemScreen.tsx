import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import { getListingById, updateListing, deleteListing } from '@services/firebase/listingService';
import ListingForm, { ListingFormData } from '@components/listings/ListingForm';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { Listing } from '@types';
import { colors } from '@constants/theme';

type EditItemRouteProp = RouteProp<ProfileStackParamList, 'EditItem'>;
type EditItemNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditItem'>;

export default function EditItemScreen() {
  const route = useRoute<EditItemRouteProp>();
  const navigation = useNavigation<EditItemNavigationProp>();
  const { listingId } = route.params;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getListingById(listingId);
      setListing(result);
      setLoading(false);
    }
    load();
  }, [listingId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!listing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.text }}>listing not found</Text>
      </View>
    );
  }

  const handleSubmit = async (data: ListingFormData) => {
    await updateListing(listing.id, {
      title: data.title.trim(),
      description: data.description.trim(),
      price: parseFloat(data.price),
      closet: data.closet || 'unnamed',
      visibility: data.isPrivate ? 'friends' : 'friends_plus',
    });
    navigation.goBack();
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
          onPress: async () => {
            try {
              await deleteListing(listing.id);
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('error', err.message || 'failed to delete listing');
            }
          },
        },
      ]
    );
  };

  return (
    <ListingForm
      mode="edit"
      initialData={{
        title: listing.title,
        description: listing.description,
        price: String(listing.price),
        photos: listing.photos.map((uri, i) => ({ id: String(i + 1), uri })),
        closet: listing.closet,
        isPrivate: listing.visibility === 'friends',
      }}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}
