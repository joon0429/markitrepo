import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { getArchivedListings, unarchiveListing } from '@services/firebase/listingService';
import ListingCard from '@components/listings/ListingCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import EmptyState from '@components/common/EmptyState';
import { Listing } from '@types';
import { colors, spacing, typography } from '@constants/theme';

type ArchivedListingsNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'ArchivedListings'
>;

export default function ArchivedListingsScreen() {
  const navigation = useNavigation<ArchivedListingsNavigationProp>();
  const { user } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const results = await getArchivedListings(user.uid);
      setListings(results);
    } catch (err) {
      console.error('failed to load archived listings:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const handleListingPress = (listingId: string) => {
    navigation.navigate('EditItem', { listingId });
  };

  const handleUnarchive = async (listingId: string) => {
    try {
      await unarchiveListing(listingId);
      // Remove from local state
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (err) {
      console.error('failed to unarchive:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (listings.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="archive-outline"
          title="no archived items"
          description="items you archive will appear here"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>archived items</Text>
        <Text style={styles.itemCount}>{listings.length} items</Text>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.listingWrapper}>
            <ListingCard
              listing={item}
              onPress={() => handleListingPress(item.id)}
            />
            <TouchableOpacity
              style={styles.unarchiveButton}
              onPress={() => handleUnarchive(item.id)}
            >
              <Text style={styles.unarchiveText}>unarchive</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="archive-outline"
            title="no archived items"
            description="items you archive will appear here"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  itemCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  listContent: {
    padding: spacing.md,
  },
  listingWrapper: {
    flex: 1,
    marginBottom: spacing.md,
  },
  unarchiveButton: {
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  unarchiveText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});
