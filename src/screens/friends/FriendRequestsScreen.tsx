import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import FriendRequestItem from '@components/friends/FriendRequestItem';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { CheckCircle } from 'lucide-react-native';
import { useFriends } from '@hooks/useFriends';
import { colors } from '@constants/theme';

export default function FriendRequestsScreen() {
  const { requests, loading, refresh, acceptRequest, declineRequest } = useFriends();

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to accept request');
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to decline request');
    }
  };

  if (loading && requests.length === 0) {
    return <LoadingSpinner />;
  }

  if (requests.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon={<CheckCircle size={64} color={colors.textTertiary} />}
          title="no pending requests"
          description="you're all caught up"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendRequestItem
            request={item}
            onAccept={() => handleAccept(item.id)}
            onDecline={() => handleDecline(item.id)}
          />
        )}
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
});
