import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '@navigation/types';
import { deserializeTransaction } from '@types';
import Avatar from '@components/common/Avatar';
import PlaceholderImage from '@components/common/PlaceholderImage';
import { colors, spacing, typography } from '@constants/theme';

type TransactionDetailRouteProp = RouteProp<ProfileStackParamList, 'TransactionDetail'>;

export default function TransactionDetailScreen() {
  const route = useRoute<TransactionDetailRouteProp>();
  const transaction = deserializeTransaction(route.params.transaction);

  const primaryPhoto = transaction.listingSnapshot.photos[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      <View style={styles.content}>
        {/* Item Photo */}
        <View style={styles.photoContainer}>
          {primaryPhoto && primaryPhoto !== 'placeholder' ? (
            <Image source={{ uri: primaryPhoto }} style={styles.photo} />
          ) : (
            <PlaceholderImage style={styles.photo} />
          )}
        </View>

        {/* Item Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>item</Text>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{transaction.listingSnapshot.title}</Text>
            <Text style={styles.itemDescription}>
              {transaction.listingSnapshot.description}
            </Text>
            <View style={styles.itemMetadata}>
              <Text style={styles.itemCloset}>
                closet: {transaction.listingSnapshot.closet}
              </Text>
            </View>
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>sale price</Text>
          <Text style={styles.price}>${transaction.price.toFixed(2)}</Text>
        </View>

        {/* Buyer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>buyer</Text>
          <View style={styles.userInfo}>
            <Avatar
              uri={transaction.buyerPhotoURL}
              size={48}
              username={transaction.buyerUsername}
            />
            <View style={styles.userText}>
              <Text style={styles.username}>@{transaction.buyerUsername}</Text>
            </View>
          </View>
        </View>

        {/* Seller Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>seller</Text>
          <View style={styles.userInfo}>
            <Avatar
              uri={transaction.sellerPhotoURL}
              size={48}
              username={transaction.sellerUsername}
            />
            <View style={styles.userText}>
              <Text style={styles.username}>@{transaction.sellerUsername}</Text>
            </View>
          </View>
        </View>

        {/* Transaction Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>date</Text>
          <Text style={styles.date}>
            {transaction.createdAt.toDate().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Transaction ID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>transaction id</Text>
          <Text style={styles.transactionId}>{transaction.id}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.xl,
  },
  photoContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemInfo: {
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  itemTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  itemDescription: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  itemMetadata: {
    marginTop: spacing.xs,
  },
  itemCloset: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  price: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '700',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  userText: {
    flex: 1,
  },
  username: {
    ...typography.bodyLarge,
    color: colors.text,
  },
  date: {
    ...typography.body,
    color: colors.text,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  transactionId: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
});
