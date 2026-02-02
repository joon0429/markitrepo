import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { SerializableListing } from '@types';

// root stack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// auth stack
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

// main tabs
export type MainTabParamList = {
  FeedStack: NavigatorScreenParams<FeedStackParamList>;
  CreateStack: NavigatorScreenParams<CreateStackParamList>;
  MessagesStack: NavigatorScreenParams<MessagesStackParamList>;
  FriendsStack: NavigatorScreenParams<FriendsStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// feed stack
export type FeedStackParamList = {
  Feed: undefined;
  ListingDetail: { listing: SerializableListing };
  UserProfile: { userId: string };
};

// create stack
export type CreateStackParamList = {
  CreateListing: undefined;
  EditListing: { listingId: string };
};

// messages stack
export type MessagesStackParamList = {
  Conversations: undefined;
  Chat: { conversationId: string; listingId: string };
};

// friends stack
export type FriendsStackParamList = {
  Friends: undefined;
  FriendRequests: undefined;
  AddFriend: undefined;
};

// profile stack
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  MyListings: undefined;
  Settings: undefined;
};

// navigation prop types
export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
export type FeedNavigationProp = StackNavigationProp<FeedStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
