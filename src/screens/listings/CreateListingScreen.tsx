import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import ListingForm, { ListingFormData } from '@components/listings/ListingForm';
import { useAuth } from '@contexts/AuthContext';
import { createListing } from '@services/firebase/listingService';
import { CreateListingInput } from '@types';

export default function CreateListingScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, userProfile } = useAuth();

  const handleSubmit = async (data: ListingFormData) => {
    if (!user?.uid) {
      Alert.alert('error', 'user not logged in');
      return;
    }

    if (!userProfile?.username) {
      Alert.alert('error', 'user profile not loaded');
      return;
    }

    const input: CreateListingInput = {
      title: data.title.trim(),
      description: data.description.trim(),
      price: parseFloat(data.price),
      photoURIs: data.photos.filter(p => p.uri).map(p => p.uri!),
      closet: data.closet || 'unnamed',
      category: null,
      visibility: data.isPrivate ? 'friends' : 'friends_plus',
    };

    await createListing(user.uid, userProfile.username, input);
    navigation.replace('ListingConfirm');
  };

  return (
    <ListingForm
      mode="create"
      onSubmit={handleSubmit}
    />
  );
}
