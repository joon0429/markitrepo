import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { getTransaction } from '@services/firebase/transactionService';
import { Transaction } from '@types';
import EmptyState from '@components/common/EmptyState';
import Button from '@components/common/Button';
import LoadingSpinner from '@components/common/LoadingSpinner';
import Avatar from '@components/common/Avatar';
import { colors, spacing, typography } from '@constants/theme';

type TransactionSuccessNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TransactionSuccess'
>;
type TransactionSuccessRouteProp = RouteProp<RootStackParamList, 'TransactionSuccess'>;

export default function TransactionSuccessScreen() {
  const navigation = useNavigation<TransactionSuccessNavigationProp>();
  const route = useRoute<TransactionSuccessRouteProp>();
  const { transactionId } = route.params;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await getTransaction(transactionId);
        setTransaction(data);
      } catch (err) {
        console.error('failed to load transaction:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          params: {
            screen: 'ProfileStack',
            params: { screen: 'Profile' },
          },
        },
      ],
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!transaction) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert-circle-outline"
          title="transaction not found"
          description="unable to load transaction details"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.successSection}>
          <EmptyState
            icon="checkmark-circle-outline"
            title="item sold!"
            description="transaction completed successfully"
          />
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>buyer</Text>
          <View style={styles.buyerInfo}>
            <Avatar
              uri={transaction.buyerPhotoURL}
              size={48}
              username={transaction.buyerUsername}
            />
            <View style={styles.buyerText}>
              <Text style={styles.buyerUsername}>@{transaction.buyerUsername}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>item</Text>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{transaction.listingSnapshot.title}</Text>
            <Text style={styles.itemPrice}>${transaction.price.toFixed(2)}</Text>
          </View>

          <Text style={styles.sectionTitle}>closet</Text>
          <Text style={styles.itemCloset}>{transaction.listingSnapshot.closet}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="done" onPress={handleDone} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  successSection: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  detailsSection: {
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  buyerText: {
    flex: 1,
  },
  buyerUsername: {
    ...typography.bodyLarge,
    color: colors.text,
  },
  itemInfo: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    gap: spacing.xs,
  },
  itemTitle: {
    ...typography.bodyLarge,
    color: colors.text,
    fontWeight: '600',
  },
  itemPrice: {
    ...typography.h3,
    color: colors.primary,
  },
  itemCloset: {
    ...typography.body,
    color: colors.text,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
});
