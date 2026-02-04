import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SearchBar from '@components/common/SearchBar';
import FriendListItem from '@components/friends/FriendListItem';
import FriendRequestItem from '@components/friends/FriendRequestItem';
import EmptyState from '@components/common/EmptyState';
import { mockFriends, mockFriendRequests, searchFriends } from '@services/mock/friends';
import { colors, spacing, typography } from '@constants/theme';

const Tab = createMaterialTopTabNavigator();

function FriendsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredFriends = searchFriends(searchQuery);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleFriendPress = (friendId: string) => {
    Alert.alert('view profile', `navigate to user profile ${friendId} (coming soon)`);
  };

  const handleMessage = (friendId: string) => {
    Alert.alert('message', `start conversation with ${friendId} (coming soon)`);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="search friends"
      />

      {filteredFriends.length === 0 ? (
        searchQuery ? (
          <EmptyState
            icon="🔍"
            title="no results"
            description={`no friends found matching "${searchQuery}"`}
          />
        ) : (
          <EmptyState
            icon="👋"
            title="no friends yet"
            description="add friends to see them here"
          />
        )
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <FriendListItem
              friend={item}
              onPress={() => handleFriendPress(item.uid)}
              onMessage={() => handleMessage(item.uid)}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

function RequestsTab() {
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState(mockFriendRequests);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleAccept = (requestId: string) => {
    Alert.alert('accept friend', `accepted friend request ${requestId}`);
    // remove from list (in real app, would update Firebase)
    setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
  };

  const handleDecline = (requestId: string) => {
    Alert.alert('decline friend', `declined friend request ${requestId}`);
    // remove from list (in real app, would update Firebase)
    setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
  };

  if (requests.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="✅"
          title="no pending requests"
          description="you're all caught up"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendRequestItem
            request={item}
            onAccept={() => handleAccept(item.id)}
            onDecline={() => handleDecline(item.id)}
          />
        )}
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

export default function FriendsScreen() {
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
        name="requests"
        component={RequestsTab}
        options={{ title: 'requests' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
