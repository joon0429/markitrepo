import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronLeft, ChevronRight, UserPlus, Search, Users } from 'lucide-react-native';
import { ProfileStackParamList } from '@navigation/types';
import SearchBar from '@components/common/SearchBar';
import FriendListItem from '@components/friends/FriendListItem';
import Avatar from '@components/common/Avatar';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { useFriends } from '@hooks/useFriends';
import { colors, spacing, typography } from '@constants/theme';

const Tab = createMaterialTopTabNavigator();

type FriendsNavigationProp = StackNavigationProp<ProfileStackParamList, 'Friends'>;
type FriendsRouteProp = RouteProp<ProfileStackParamList, 'Friends'>;

function FriendRequestsRow() {
  const navigation = useNavigation<FriendsNavigationProp>();
  const { requests } = useFriends();

  if (requests.length === 0) return null;

  const previewAvatars = requests.slice(0, 3);

  return (
    <TouchableOpacity
      style={styles.requestsRow}
      onPress={() => navigation.navigate('FriendRequests')}
      activeOpacity={0.7}
    >
      <View style={styles.requestsAvatarStack}>
        {previewAvatars.map((req, index) => (
          <View key={req.id} style={[styles.stackedAvatar, { marginLeft: index > 0 ? -10 : 0 }]}>
            <Avatar uri={req.fromPhotoURL} size="small" name={req.fromUsername} />
          </View>
        ))}
      </View>

      <View style={styles.requestsInfo}>
        <Text style={styles.requestsTitle}>friend requests</Text>
        <Text style={styles.requestsSubtitle}>
          {requests[0].fromUsername}{requests.length > 1 ? ` + ${requests.length - 1} ${requests.length - 1 === 1 ? 'other' : 'others'}` : ''}
        </Text>
      </View>

      <View style={styles.requestsRight}>
        <View style={styles.requestsBadge} />
        <ChevronRight size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

function FollowersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const { friends, loading, refresh, searchFriends } = useFriends();

  const filteredFriends = searchFriends(searchQuery);

  if (loading && friends.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FriendRequestsRow />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="search"
      />

      {filteredFriends.length === 0 ? (
        searchQuery ? (
          <EmptyState
            icon={<Search size={64} color={colors.textTertiary} />}
            title="no results"
            description={`no friends found matching "${searchQuery}"`}
          />
        ) : (
          <EmptyState
            icon={<Users size={64} color={colors.textTertiary} />}
            title="no followers yet"
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
              onPress={() => {}}
            />
          )}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

function FollowingTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const { friends, loading, refresh, searchFriends } = useFriends();

  const filteredFriends = searchFriends(searchQuery);

  if (loading && friends.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="search"
      />

      {filteredFriends.length === 0 ? (
        searchQuery ? (
          <EmptyState
            icon={<Search size={64} color={colors.textTertiary} />}
            title="no results"
            description={`no friends found matching "${searchQuery}"`}
          />
        ) : (
          <EmptyState
            icon={<Users size={64} color={colors.textTertiary} />}
            title="not following anyone"
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
              onPress={() => {}}
            />
          )}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

export default function FriendsScreen() {
  const navigation = useNavigation<FriendsNavigationProp>();
  const route = useRoute<FriendsRouteProp>();
  const initialTab = route.params?.initialTab || 'followers';

  return (
    <View style={styles.screenContainer}>
      {/* custom header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>friends</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('AddFriends')}
          activeOpacity={0.7}
        >
          <UserPlus size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        initialRouteName={initialTab}
        screenOptions={{
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarIndicatorStyle: { backgroundColor: colors.white },
          tabBarStyle: {
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            textTransform: 'lowercase',
          },
        }}
      >
        <Tab.Screen
          name="followers"
          component={FollowersTab}
          options={{ title: 'followers' }}
        />
        <Tab.Screen
          name="following"
          component={FollowingTab}
          options={{ title: 'following' }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  requestsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  requestsAvatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedAvatar: {
    borderWidth: 2,
    borderColor: colors.background,
    borderRadius: 999,
  },
  requestsInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  requestsTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  requestsSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  requestsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  requestsBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
