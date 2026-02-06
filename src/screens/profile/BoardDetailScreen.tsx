import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import { mockListings } from '@services/mock/listings';
import ListingCard from '@components/listings/ListingCard';
import { serializeListing } from '@types';
import { colors, spacing, typography } from '@constants/theme';

type BoardDetailRouteProp = RouteProp<ProfileStackParamList, 'BoardDetail'>;
type BoardDetailNavigationProp = StackNavigationProp<ProfileStackParamList, 'BoardDetail'>;

export default function BoardDetailScreen() {
  const route = useRoute<BoardDetailRouteProp>();
  const navigation = useNavigation<BoardDetailNavigationProp>();
  const { boardName } = route.params;

  const [refreshing, setRefreshing] = useState(false);

  // filter listings by board/closet name
  const boardListings = mockListings.filter(listing => listing.closet === boardName);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleListingPress = (listingId: string) => {
    navigation.navigate('EditItem', { listingId });
  };

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
        showsVerticalScrollIndicator={false}
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
