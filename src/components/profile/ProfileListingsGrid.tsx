import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ListingCard from '@components/listings/ListingCard';
import EmptyState from '@components/common/EmptyState';
import { mockListings } from '@services/mock/listings';
import { Listing, SerializableListing, serializeListing } from '@types';
import { colors, spacing } from '@constants/theme';

interface ProfileListingsGridProps {
  userId: string;
  onRefresh: () => void;
  refreshing: boolean;
}

type ProfileNavigationProp = StackNavigationProp<any>;

export default function ProfileListingsGrid({ userId, onRefresh, refreshing }: ProfileListingsGridProps) {
  const navigation = useNavigation<ProfileNavigationProp>();

  // filter listings by userId
  const userListings = mockListings.filter(listing => listing.sellerId === userId);

  const handleCardPress = (listing: Listing) => {
    navigation.navigate('ListingDetail', { listing: serializeListing(listing) });
  };

  if (userListings.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="no listings yet"
        description="this user hasn't posted any items"
      />
    );
  }

  return (
    <FlatList
      data={userListings}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <ListingCard
          listing={item}
          onPress={() => handleCardPress(item)}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
