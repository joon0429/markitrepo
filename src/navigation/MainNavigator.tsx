import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Plus, MessageCircle, Menu, Home, Bell, MapPin, User, PlusCircle } from 'lucide-react-native';
import {
  MainTabParamList,
  FeedStackParamList,
  NotificationsStackParamList,
  MapStackParamList,
  ProfileStackParamList,
  RootStackParamList,
} from './types';
import FeedScreen from '@screens/feed/FeedScreen';
import ListingDetailScreen from '@screens/feed/ListingDetailScreen';
import ConversationsScreen from '@screens/messages/ConversationsScreen';
import ChatScreen from '@screens/messages/ChatScreen';
import NotificationsScreen from '@screens/notifications/NotificationsScreen';
import MapScreen from '@screens/map/MapScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import ClosetDetailScreen from '@screens/profile/ClosetDetailScreen';
import EditItemScreen from '@screens/profile/EditItemScreen';
import SettingsScreen from '@screens/profile/SettingsScreen';
import SettingsPlaceholderScreen from '@screens/profile/SettingsPlaceholderScreen';
import EditProfileScreen from '@screens/profile/EditProfileScreen';
import ArchivedListingsScreen from '@screens/profile/ArchivedListingsScreen';
import TransactionHistoryScreen from '@screens/transactions/TransactionHistoryScreen';
import TransactionDetailScreen from '@screens/transactions/TransactionDetailScreen';
import FriendsScreen from '@screens/friends/FriendsScreen';
import FriendRequestsScreen from '@screens/friends/FriendRequestsScreen';
import AddFriendsScreen from '@screens/friends/AddFriendsScreen';
import { colors, typography } from '@constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();
const FeedStackNav = createStackNavigator<FeedStackParamList>();
const NotificationsStackNav = createStackNavigator<NotificationsStackParamList>();
const MapStackNav = createStackNavigator<MapStackParamList>();
const ProfileStackNav = createStackNavigator<ProfileStackParamList>();

const defaultScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    color: colors.text,
    fontWeight: typography.fontWeight.semibold,
  },
};

// shared messaging screens -- used in both FeedStack and NotificationsStack
function addMessagingScreens<T extends { Conversations: undefined; Chat: any; ComingSoon: any }>(
  Stack: ReturnType<typeof createStackNavigator<T>>
) {
  return (
    <>
      <Stack.Screen
        name={'Conversations' as any}
        component={ConversationsScreen}
        options={({ navigation }: any) => ({
          title: 'messages',
          headerRight: () => (
            <TouchableOpacity
              style={headerButtonStyles.headerButton}
              onPress={() => navigation.navigate('ComingSoon', { title: 'new message', description: 'start new conversations from here' })}
            >
              <Plus size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name={'Chat' as any}
        component={ChatScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name={'ComingSoon' as any}
        component={SettingsPlaceholderScreen}
        options={({ route }: any) => ({
          title: (route.params as { title: string })?.title || 'coming soon',
        })}
      />
    </>
  );
}

function FeedStackNavigator() {
  return (
    <FeedStackNav.Navigator screenOptions={defaultScreenOptions}>
      <FeedStackNav.Screen
        name="Feed"
        component={FeedScreen}
        options={({ navigation }) => ({
          title: 'mark.it',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.text,
          },
          headerLeft: () => <View style={headerButtonStyles.headerSpacer} />,
          headerRight: () => (
            <TouchableOpacity
              style={headerButtonStyles.headerButton}
              onPress={() => navigation.navigate('Conversations')}
            >
              <MessageCircle size={22} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <FeedStackNav.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{ title: 'listing' }}
      />
      {addMessagingScreens(FeedStackNav)}
    </FeedStackNav.Navigator>
  );
}

function NotificationsStackNavigator() {
  return (
    <NotificationsStackNav.Navigator screenOptions={defaultScreenOptions}>
      <NotificationsStackNav.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={({ navigation }) => ({
          title: 'notifications',
          headerRight: () => (
            <TouchableOpacity
              style={headerButtonStyles.headerButton}
              onPress={() => navigation.navigate('Conversations')}
            >
              <MessageCircle size={22} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      {addMessagingScreens(NotificationsStackNav)}
    </NotificationsStackNav.Navigator>
  );
}

function MapStackNavigator() {
  return (
    <MapStackNav.Navigator screenOptions={defaultScreenOptions}>
      <MapStackNav.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'map' }}
      />
    </MapStackNav.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStackNav.Navigator screenOptions={defaultScreenOptions}>
      <ProfileStackNav.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'profile',
          headerRight: () => (
            <TouchableOpacity
              style={headerButtonStyles.headerButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Menu size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <ProfileStackNav.Screen
        name="ClosetDetail"
        component={ClosetDetailScreen}
        options={{ title: '' }}
      />
      <ProfileStackNav.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{ title: 'edit item' }}
      />
      <ProfileStackNav.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'settings' }}
      />
      <ProfileStackNav.Screen
        name="SettingsPlaceholder"
        component={SettingsPlaceholderScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <ProfileStackNav.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'edit profile' }}
      />
      <ProfileStackNav.Screen
        name="ArchivedListings"
        component={ArchivedListingsScreen}
        options={{ title: 'archived' }}
      />
      <ProfileStackNav.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={({ route }) => ({
          title: route.params.type === 'purchases' ? 'purchases' : 'sales',
        })}
      />
      <ProfileStackNav.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ title: 'transaction' }}
      />
      <ProfileStackNav.Screen
        name="Friends"
        component={FriendsScreen}
        options={{ headerShown: false }}
      />
      <ProfileStackNav.Screen
        name="FriendRequests"
        component={FriendRequestsScreen}
        options={{ title: 'friend requests' }}
      />
      <ProfileStackNav.Screen
        name="AddFriends"
        component={AddFriendsScreen}
        options={{ title: 'add friends' }}
      />
    </ProfileStackNav.Navigator>
  );
}

// placeholder component for create tab
function TabPlaceholder() {
  return null;
}

// custom create button component
function CreateTabButton(props: any) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      {...props}
      style={[props.style, tabButtonStyles.createButton]}
      onPress={(e) => {
        e.preventDefault();
        navigation.navigate('CreateListing');
      }}
    >
      <PlusCircle size={28} color={colors.primary} />
      <Text style={tabButtonStyles.createButtonLabel}>create</Text>
    </TouchableOpacity>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen
        name="FeedStack"
        component={FeedStackNavigator}
        options={{
          tabBarLabel: 'home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="NotificationsStack"
        component={NotificationsStackNavigator}
        options={{
          tabBarLabel: 'notifs',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CreateTab"
        component={TabPlaceholder}
        options={{
          tabBarLabel: 'create',
          tabBarButton: CreateTabButton,
        }}
      />
      <Tab.Screen
        name="MapStack"
        component={MapStackNavigator}
        options={{
          tabBarLabel: 'map',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const tabButtonStyles = StyleSheet.create({
  createButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    marginTop: 2,
  },
});

const headerButtonStyles = StyleSheet.create({
  headerSpacer: {
    width: 48,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
