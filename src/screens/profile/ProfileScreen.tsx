import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProfileHeader from '@components/profile/ProfileHeader';
import ProfileListingsGrid from '@components/profile/ProfileListingsGrid';
import BoardCard from '@components/profile/BoardCard';
import { mockUsers } from '@services/mock/listings';
import { getBoardsByUser, getUserStats } from '@services/mock/profiles';
import { colors, spacing, typography } from '@constants/theme';

const Tab = createMaterialTopTabNavigator();

// current user (will be replaced with actual auth later)
const currentUser = mockUsers[0]; // sarah_parker

function ListingsTab() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <View style={styles.tabContainer}>
      <ProfileListingsGrid
        userId={currentUser.uid}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}

function BoardsTab() {
  const [refreshing, setRefreshing] = useState(false);

  const boards = getBoardsByUser(currentUser.uid);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleBoardPress = (boardId: string) => {
    Alert.alert('board detail', `view listings in this board (coming soon)`);
  };

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <BoardCard
            board={item}
            onPress={() => handleBoardPress(item.id)}
          />
        )}
        contentContainerStyle={styles.boardsListContent}
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

export default function ProfileScreen() {
  const stats = getUserStats(currentUser.uid);

  const handleEditProfile = () => {
    Alert.alert('edit profile', 'editing profile (coming soon)');
  };

  return (
    <View style={styles.container}>
      <ProfileHeader
        user={currentUser}
        stats={stats}
        isOwnProfile={true}
        onEditProfile={handleEditProfile}
      />

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
          name="all listings"
          component={ListingsTab}
          options={{ title: 'all listings' }}
        />
        <Tab.Screen
          name="boards"
          component={BoardsTab}
          options={{ title: 'boards' }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  boardsListContent: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
