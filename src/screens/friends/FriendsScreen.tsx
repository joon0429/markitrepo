import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SearchBar from '@components/common/SearchBar';
import FriendListItem from '@components/friends/FriendListItem';
import FriendRequestItem from '@components/friends/FriendRequestItem';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { useFriends } from '@hooks/useFriends';
import { colors, spacing, typography } from '@constants/theme';

const Tab = createMaterialTopTabNavigator();

function FriendsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const { friends, loading, refresh, searchFriends } = useFriends();

  const filteredFriends = searchFriends(searchQuery);

  const handleRefresh = async () => {
    await refresh();
  };

  const handleFriendPress = (friendId: string) => {
    Alert.alert('view profile', `navigate to user profile (coming soon)`);
  };

  const handleMessage = (friendId: string) => {
    Alert.alert('message', `start conversation (coming soon)`);
  };

  if (loading && friends.length === 0) {
    return <LoadingSpinner />;
  }

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
            icon="search-outline"
            title="no results"
            description={`no friends found matching "${searchQuery}"`}
          />
        ) : (
          <EmptyState
            icon="people-outline"
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
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={loading}
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
  const { requests, loading, refresh, acceptRequest, declineRequest } = useFriends();

  const handleRefresh = async () => {
    await refresh();
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to accept request');
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to decline request');
    }
  };

  if (loading && requests.length === 0) {
    return <LoadingSpinner />;
  }

  if (requests.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="checkmark-circle-outline"
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
