import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Listing, serializeListing } from '@types';
import { FeedStackParamList } from '@navigation/types';
import { useListings } from '@hooks/useListings';
import ListingCard from '@components/listings/ListingCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import EmptyState from '@components/common/EmptyState';
import { colors, spacing, typography } from '@constants/theme';

const Tab = createMaterialTopTabNavigator();

type FeedNavigationProp = StackNavigationProp<FeedStackParamList, 'Feed'>;

function FeedList({ visibility }: { visibility: 'friends' | 'friends_plus' }) {
  const navigation = useNavigation<FeedNavigationProp>();
  const { listings, loading, refresh } = useListings(visibility);

  const handleRefresh = async () => {
    await refresh();
  };

  const handleCardPress = (listing: Listing) => {
    navigation.navigate('ListingDetail', { listing: serializeListing(listing) });
  };

  if (loading && listings.length === 0) {
    return <LoadingSpinner />;
  }

  if (!loading && listings.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="pricetag-outline"
          title="no listings yet"
          description="add friends to see their listings here"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => handleCardPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

function FriendsTab() {
  return <FeedList visibility="friends" />;
}

function FriendsPlusTab() {
  return <FeedList visibility="friends_plus" />;
}

export default function FeedScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarIndicatorStyle: { backgroundColor: colors.primary },
        tabBarStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.bold,
          textTransform: 'none',
        },
      }}
    >
      <Tab.Screen
        name="my friends"
        component={FriendsTab}
        options={{ title: 'my friends' }}
      />
      <Tab.Screen
        name="friends of friends"
        component={FriendsPlusTab}
        options={{ title: 'friends of friends' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
});
