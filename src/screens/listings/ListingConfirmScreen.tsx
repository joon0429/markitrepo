import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import EmptyState from '@components/common/EmptyState';
import Button from '@components/common/Button';
import { colors, spacing } from '@constants/theme';

type ConfirmNavigationProp = StackNavigationProp<RootStackParamList, 'ListingConfirm'>;

export default function ListingConfirmScreen() {
  const navigation = useNavigation<ConfirmNavigationProp>();

  const handleReturnHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <EmptyState
          icon="checkmark-circle-outline"
          title="listing created!"
          description="your item is now visible to your network"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="return to home"
          onPress={handleReturnHome}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
});
