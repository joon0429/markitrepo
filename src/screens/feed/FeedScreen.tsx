import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Listing, SerializableListing, serializeListing } from '@types';
import { mockListings } from '@services/mock/listings';
import ListingCard from '@components/listings/ListingCard';
import { colors, spacing, typography } from '@constants/theme';

const Tab = createMaterialTopTabNavigator();

type FeedStackParamList = {
  Feed: undefined;
  ListingDetail: { listing: SerializableListing };
  UserProfile: { userId: string };
};

type FeedNavigationProp = StackNavigationProp<FeedStackParamList, 'Feed'>;

function FeedList({ visibility }: { visibility: 'friends' | 'friends_plus' }) {
  const navigation = useNavigation<FeedNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  // filter listings by visibility
  const listings = mockListings.filter(listing => listing.visibility === visibility);

  const handleRefresh = async () => {
    setRefreshing(true);
    // simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleCardPress = (listing: Listing) => {
    navigation.navigate('ListingDetail', { listing: serializeListing(listing) });
  };

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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIndicatorStyle: { backgroundColor: colors.primary },
        tabBarStyle: { backgroundColor: colors.background },
        tabBarLabelStyle: {
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          textTransform: 'lowercase',
        },
      }}
    >
      <Tab.Screen
        name="friends"
        component={FriendsTab}
        options={{ title: 'friends' }}
      />
      <Tab.Screen
        name="friends+"
        component={FriendsPlusTab}
        options={{ title: 'friends+' }}
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
