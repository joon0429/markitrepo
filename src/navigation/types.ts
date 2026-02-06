import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { SerializableListing, SerializableConversation } from '@types';

// root stack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  CreateListing: undefined; // modal presentation
};

// auth stack
export type AuthStackParamList = {
  Login: undefined;
};

// main tabs
export type MainTabParamList = {
  FeedStack: NavigatorScreenParams<FeedStackParamList>; // home tab
  NotificationsStack: NavigatorScreenParams<NotificationsStackParamList>;
  CreateTab: undefined; // placeholder tab that triggers modal
  MapStack: NavigatorScreenParams<MapStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// feed stack
export type FeedStackParamList = {
  Feed: undefined;
  ListingDetail: { listing: SerializableListing };
  UserProfile: { userId: string };
  Conversations: undefined;
  Chat: { conversationId: string; conversation: SerializableConversation };
};

// create stack
export type CreateStackParamList = {
  CreateListing: undefined;
  EditListing: { listingId: string };
};

// messages stack
export type MessagesStackParamList = {
  Conversations: undefined;
  Chat: { conversationId: string; conversation: SerializableConversation };
};

// friends stack
export type FriendsStackParamList = {
  Friends: undefined;
  FriendRequests: undefined;
  AddFriend: undefined;
};

// notifications stack
export type NotificationsStackParamList = {
  Notifications: undefined;
  Conversations: undefined;
  Chat: { conversationId: string; conversation: SerializableConversation };
};

// map stack
export type MapStackParamList = {
  Map: undefined;
};

// profile stack
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  MyListings: undefined;
  Settings: undefined;
  BoardDetail: { boardName: string };
  EditItem: { listingId: string };
};

// navigation prop types
export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
export type FeedNavigationProp = StackNavigationProp<FeedStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
