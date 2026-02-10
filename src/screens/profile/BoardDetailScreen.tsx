import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { getListingsByCloset } from '@services/firebase/listingService';
import ListingCard from '@components/listings/ListingCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import EmptyState from '@components/common/EmptyState';
import { Listing } from '@types';
import { colors, spacing, typography } from '@constants/theme';

type BoardDetailRouteProp = RouteProp<ProfileStackParamList, 'BoardDetail'>;
type BoardDetailNavigationProp = StackNavigationProp<ProfileStackParamList, 'BoardDetail'>;

export default function BoardDetailScreen() {
  const route = useRoute<BoardDetailRouteProp>();
  const navigation = useNavigation<BoardDetailNavigationProp>();
  const { user } = useAuth();
  const { boardName } = route.params;

  const [boardListings, setBoardListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const results = await getListingsByCloset(user.uid, boardName);
      setBoardListings(results);
    } catch (err) {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [user?.uid, boardName]);

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.boardName}>{boardName}</Text>
        <Text style={styles.itemCount}>{boardListings.length} items</Text>
      </View>

      <FlatList
        data={boardListings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => handleListingPress(item.id)}
          />
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
  boardName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemCount: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
