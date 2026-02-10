import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import ProfileHeader from '@components/profile/ProfileHeader';
import SearchBar from '@components/common/SearchBar';
import BoardCard from '@components/profile/BoardCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import EmptyState from '@components/common/EmptyState';
import { useProfile } from '@hooks/useProfile';
import { colors, spacing, typography } from '@constants/theme';

type ProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('tag1');

  const { profile, boards, stats, loading, error } = useProfile();

  const handleEditProfile = () => {
    Alert.alert('edit profile', 'editing profile (coming soon)');
  };

  const handleBoardPress = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      navigation.navigate('BoardDetail', { boardName: board.name });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="person-outline"
          title="profile not found"
          description={error || 'could not load your profile'}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {/* profile header */}
        <ProfileHeader
          user={profile}
          stats={stats}
          isOwnProfile={true}
          onEditProfile={handleEditProfile}
        />

        {/* search bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="search..."
        />

        {/* filter tags */}
        <View style={styles.tagsContainer}>
          <TouchableOpacity
            style={[styles.tag, activeTag === 'tag1' && styles.activeTag]}
            onPress={() => setActiveTag('tag1')}
          >
            <Text style={[styles.tagText, activeTag === 'tag1' && styles.activeTagText]}>
              tag1
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tag, activeTag === 'tag2' && styles.activeTag]}
            onPress={() => setActiveTag('tag2')}
          >
            <Text style={[styles.tagText, activeTag === 'tag2' && styles.activeTagText]}>
              tag2
            </Text>
          </TouchableOpacity>
        </View>

        {/* boards grid */}
        {boards.length === 0 ? (
          <EmptyState
            icon="grid-outline"
            title="no boards yet"
            description="create a listing to start organizing your items"
          />
        ) : (
        <FlatList
          data={boards}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <BoardCard
              board={item}
              onPress={() => handleBoardPress(item.id)}
            />
          )}
          contentContainerStyle={styles.boardsListContent}
          showsVerticalScrollIndicator={true}
          scrollEnabled={false}
        />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  activeTag: {
    backgroundColor: colors.primary,
  },
  tagText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  activeTagText: {
    color: '#FFFFFF',
  },
  boardsListContent: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
});
