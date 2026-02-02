import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList, FeedStackParamList, CreateStackParamList, MessagesStackParamList, FriendsStackParamList, ProfileStackParamList } from './types';
import FeedScreen from '@screens/feed/FeedScreen';
import CreateListingScreen from '@screens/listings/CreateListingScreen';
import ConversationsScreen from '@screens/messages/ConversationsScreen';
import FriendsScreen from '@screens/friends/FriendsScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import { colors } from '@constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

// helper function to create simple stack navigators
function createSimpleStack<T extends {}>(
  Stack: any,
  screenName: string,
  component: React.ComponentType<any>,
  title: string
) {
  return function StackNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen name={screenName} component={component} options={{ title }} />
      </Stack.Navigator>
    );
  };
}

const FeedStackNavigator = createSimpleStack(
  createStackNavigator<FeedStackParamList>(),
  'Feed',
  FeedScreen,
  'feed'
);

const CreateStackNavigator = createSimpleStack(
  createStackNavigator<CreateStackParamList>(),
  'CreateListing',
  CreateListingScreen,
  'create'
);

const MessagesStackNavigator = createSimpleStack(
  createStackNavigator<MessagesStackParamList>(),
  'Conversations',
  ConversationsScreen,
  'messages'
);

const FriendsStackNavigator = createSimpleStack(
  createStackNavigator<FriendsStackParamList>(),
  'Friends',
  FriendsScreen,
  'friends'
);

const ProfileStackNavigator = createSimpleStack(
  createStackNavigator<ProfileStackParamList>(),
  'Profile',
  ProfileScreen,
  'profile'
);

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="FeedStack"
        component={FeedStackNavigator}
        options={{ tabBarLabel: 'feed' }}
      />
      <Tab.Screen
        name="CreateStack"
        component={CreateStackNavigator}
        options={{ tabBarLabel: 'create' }}
      />
      <Tab.Screen
        name="MessagesStack"
        component={MessagesStackNavigator}
        options={{ tabBarLabel: 'messages' }}
      />
      <Tab.Screen
        name="FriendsStack"
        component={FriendsStackNavigator}
        options={{ tabBarLabel: 'friends' }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'profile' }}
      />
    </Tab.Navigator>
  );
}
