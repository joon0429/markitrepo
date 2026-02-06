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
import BoardDetailScreen from '@screens/profile/BoardDetailScreen';
import EditItemScreen from '@screens/profile/EditItemScreen';
import { colors, typography } from '@constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();
const FeedStack = createStackNavigator<FeedStackParamList>();
const NotificationsStack = createStackNavigator<NotificationsStackParamList>();
const MapStack = createStackNavigator<MapStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

function FeedStackNavigator() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="Feed"
        component={FeedScreen}
        options={({ navigation }) => ({
          title: 'mark.it',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
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
        options={{ title: '' }}
      />
      <FeedStack.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{ title: 'messages' }}
      />
      <FeedStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: '' }}
      />
    </FeedStack.Navigator>
  );
}

function NotificationsStackNavigator() {
  return (
    <NotificationsStack.Navigator>
      <NotificationsStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <NotificationsStack.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{ title: 'messages' }}
      />
      <NotificationsStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: '' }}
      />
    </NotificationsStack.Navigator>
  );
}

function MapStackNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
    </MapStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'profile' }}
      />
      <ProfileStack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={{ title: '' }}
      />
      <ProfileStack.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{ title: 'edit item' }}
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
        tabBarInactiveTintColor: colors.textSecondary,
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
