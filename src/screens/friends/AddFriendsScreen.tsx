import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Search, XCircle, Users } from 'lucide-react-native';
import Avatar from '@components/common/Avatar';
import EmptyState from '@components/common/EmptyState';
import { searchUsers } from '@services/firebase/friendService';
import { useFriends } from '@hooks/useFriends';
import { useAuth } from '@contexts/AuthContext';
import { User } from '@types';
import { colors, spacing, typography, borderRadius } from '@constants/theme';

export default function AddFriendsScreen() {
  const { user } = useAuth();
  const { sendRequest, friends } = useFriends();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const users = await searchUsers(text.trim());
      // filter out current user
      const filtered = users.filter(u => u.uid !== user?.uid);
      setResults(filtered);
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to search');
    } finally {
      setSearching(false);
    }
  }, [user?.uid]);

  const handleAddFriend = async (username: string, uid: string) => {
    try {
      await sendRequest(username);
      setSentRequests(prev => new Set(prev).add(uid));
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to send request');
    }
  };

  const isFriend = (uid: string) => friends.some(f => f.uid === uid);
  const isRequestSent = (uid: string) => sentRequests.has(uid);

  const renderUser = ({ item }: { item: User }) => {
    const alreadyFriend = isFriend(item.uid);
    const alreadySent = isRequestSent(item.uid);

    return (
      <View style={styles.userRow}>
        <Avatar uri={item.photoURL} size="medium" name={item.displayName} />

        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.displayName}>{item.displayName}</Text>
        </View>

        {alreadyFriend ? (
          <View style={styles.friendBadge}>
            <Text style={styles.friendBadgeText}>friends</Text>
          </View>
        ) : alreadySent ? (
          <View style={styles.sentBadge}>
            <Text style={styles.sentBadgeText}>requested</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddFriend(item.username, item.uid)}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
          placeholder="search by username"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
            <XCircle size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {results.length === 0 && query.length > 0 && !searching ? (
        <EmptyState
          icon={<Search size={64} color={colors.textTertiary} />}
          title="no users found"
          description={`no users matching "${query}"`}
        />
      ) : results.length === 0 && query.length === 0 ? (
        <EmptyState
          icon={<Users size={64} color={colors.textTertiary} />}
          title="find friends"
          description="search for users by their username"
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.uid}
          renderItem={renderUser}
          showsVerticalScrollIndicator={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 40,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
    padding: 0,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  username: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  displayName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  addButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  friendBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  friendBadgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  sentBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  sentBadgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
});
