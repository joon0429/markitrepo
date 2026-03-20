import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import CreateListingScreen from '@screens/listings/CreateListingScreen';
import ListingConfirmScreen from '@screens/listings/ListingConfirmScreen';
import TransactionSuccessScreen from '@screens/transactions/TransactionSuccessScreen';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { RootStackParamList } from './types';
import { colors, typography } from '@constants/theme';

const Stack = createStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

export default function AppNavigator() {
  const { user, loading } = useAuth();
  console.log('[nav] AppNavigator render, user:', user?.uid ?? null, 'loading:', loading);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="CreateListing"
              component={CreateListingScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: false,
                headerShown: true,
                headerTitle: 'sell an item',
                headerBackTitle: 'cancel',
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerTitleStyle: {
                  color: colors.text,
                  fontWeight: typography.fontWeight.semibold,
                },
              }}
            />
            <Stack.Screen
              name="ListingConfirm"
              component={ListingConfirmScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: 'confirm listing',
                headerLeft: () => null,
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerTitleStyle: {
                  color: colors.text,
                  fontWeight: typography.fontWeight.semibold,
                },
              }}
            />
            <Stack.Screen
              name="TransactionSuccess"
              component={TransactionSuccessScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: 'transaction complete',
                headerLeft: () => null,
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerTitleStyle: {
                  color: colors.text,
                  fontWeight: typography.fontWeight.semibold,
                },
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
