import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { useTransactions } from '@hooks/useTransactions';
import { Transaction, serializeTransaction } from '@types';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import PlaceholderImage from '@components/common/PlaceholderImage';
import { colors, spacing, typography } from '@constants/theme';

type TransactionHistoryNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'TransactionHistory'
>;
type TransactionHistoryRouteProp = RouteProp<ProfileStackParamList, 'TransactionHistory'>;

export default function TransactionHistoryScreen() {
  const navigation = useNavigation<TransactionHistoryNavigationProp>();
  const route = useRoute<TransactionHistoryRouteProp>();
  const { type } = route.params;
  const { user } = useAuth();

  const { transactions, loading, error, refresh } = useTransactions(
    user?.uid || '',
    type
  );

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate('TransactionDetail', {
      transaction: serializeTransaction(transaction),
    });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const otherUser =
      type === 'purchases'
        ? { username: item.sellerUsername, photoURL: item.sellerPhotoURL }
        : { username: item.buyerUsername, photoURL: item.buyerPhotoURL };

    const primaryPhoto = item.listingSnapshot.photos[0];

    return (
      <TouchableOpacity
        style={styles.transactionCard}
        onPress={() => handleTransactionPress(item)}
      >
        <View style={styles.photoContainer}>
          {primaryPhoto && primaryPhoto !== 'placeholder' ? (
            <Image source={{ uri: primaryPhoto }} style={styles.photo} />
          ) : (
            <PlaceholderImage style={styles.photo} />
          )}
        </View>

        <View style={styles.transactionInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.listingSnapshot.title}
          </Text>
          <Text style={styles.otherUser} numberOfLines={1}>
            {type === 'purchases' ? 'from' : 'to'} @{otherUser.username}
          </Text>
          <Text style={styles.transactionDate}>
            {item.createdAt.toDate().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && transactions.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert-circle-outline"
          title="error loading transactions"
          description={error}
        />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="receipt-outline"
          title={type === 'purchases' ? 'no purchases yet' : 'no sales yet'}
          description={
            type === 'purchases'
              ? "items you've bought will appear here"
              : "items you've sold will appear here"
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'center',
  },
  photoContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  transactionInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  itemTitle: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.semibold,
  },
  otherUser: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  transactionDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: typography.fontSize.lg,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
