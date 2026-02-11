import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, FeedStackParamList, NotificationsStackParamList, MapStackParamList, ProfileStackParamList, RootStackParamList } from './types';
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
import { colors, typography } from '@constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();
const FeedStack = createStackNavigator<FeedStackParamList>();
const NotificationsStack = createStackNavigator<NotificationsStackParamList>();
const MapStack = createStackNavigator<MapStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

const defaultScreenOptions = {
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

function FeedStackNavigator() {
  return (
    <FeedStack.Navigator screenOptions={defaultScreenOptions}>
      <FeedStack.Screen
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
              style={headerButtonStyles.messageButton}
              onPress={() => navigation.navigate('Conversations')}
            >
              <Ionicons name="chatbubble-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <FeedStack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{ title: 'listing' }}
      />
      <FeedStack.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={({ navigation }) => ({
          title: 'messages',
          headerRight: () => (
            <TouchableOpacity
              style={headerButtonStyles.messageButton}
              onPress={() => navigation.navigate('ComingSoon', { title: 'new message', description: 'start new conversations from here' })}
            >
              <Ionicons name="add-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <FeedStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: '' }}
      />
      <FeedStack.Screen
        name="ComingSoon"
        component={SettingsPlaceholderScreen}
        options={({ route }) => ({ title: (route.params as any)?.title || 'coming soon' })}
      />
    </FeedStack.Navigator>
  );
}

function NotificationsStackNavigator() {
  return (
    <NotificationsStack.Navigator screenOptions={defaultScreenOptions}>
      <NotificationsStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={({ navigation }) => ({
          title: 'notifications',
          headerRight: () => (
            <TouchableOpacity
              style={headerButtonStyles.messageButton}
              onPress={() => navigation.navigate('Conversations')}
            >
              <Ionicons name="chatbubble-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <NotificationsStack.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={({ navigation }) => ({
          title: 'messages',
          headerRight: () => (
            <TouchableOpacity
              style={headerButtonStyles.messageButton}
              onPress={() => navigation.navigate('ComingSoon', { title: 'new message', description: 'start new conversations from here' })}
            >
              <Ionicons name="add-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <NotificationsStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: '' }}
      />
      <NotificationsStack.Screen
        name="ComingSoon"
        component={SettingsPlaceholderScreen}
        options={({ route }) => ({ title: (route.params as any)?.title || 'coming soon' })}
      />
    </NotificationsStack.Navigator>
  );
}

function MapStackNavigator() {
  return (
    <MapStack.Navigator screenOptions={defaultScreenOptions}>
      <MapStack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'map' }}
      />
    </MapStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'profile',
          headerRight: () => (
            <TouchableOpacity
              style={headerButtonStyles.messageButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="menu-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <ProfileStack.Screen
        name="ClosetDetail"
        component={ClosetDetailScreen}
        options={{ title: '' }}
      />
      <ProfileStack.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{ title: 'edit item' }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'settings' }}
      />
      <ProfileStack.Screen
        name="SettingsPlaceholder"
        component={SettingsPlaceholderScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'edit profile' }}
      />
      <ProfileStack.Screen
        name="ArchivedListings"
        component={ArchivedListingsScreen}
        options={{ title: 'archived' }}
      />
      <ProfileStack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={({ route }) => ({
          title: route.params.type === 'purchases' ? 'purchases' : 'sales',
        })}
      />
      <ProfileStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ title: 'transaction' }}
      />
    </ProfileStack.Navigator>
  );
}

// placeholder component for tabs
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
      <Text style={tabButtonStyles.createButtonText}>+</Text>
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
        options={{ tabBarLabel: 'home' }}
      />
      <Tab.Screen
        name="NotificationsStack"
        component={NotificationsStackNavigator}
        options={{ tabBarLabel: 'notifs' }}
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
        options={{ tabBarLabel: 'map' }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'profile' }}
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
  createButtonText: {
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: -4,
  },
  createButtonLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
  },
});

const headerButtonStyles = StyleSheet.create({
  headerSpacer: {
    width: 48,
  },
  messageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
