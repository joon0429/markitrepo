import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import ProfileHeader from '@components/profile/ProfileHeader';
import SearchBar from '@components/common/SearchBar';
import BoardCard from '@components/profile/BoardCard';
import { mockUsers } from '@services/mock/listings';
import { getUserStats } from '@services/mock/profiles';
import { colors, spacing, typography } from '@constants/theme';
import { Board } from '@types/profile';

type ProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

// current user (will be replaced with actual auth later)
const currentUser = mockUsers[0]; // sarah_parker

// mock boards for the profile
const mockBoards: Board[] = [
  {
    id: '1',
    name: 'unnamed',
    itemCount: 0,
    previewPhotos: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'clothes',
    itemCount: 7,
    previewPhotos: ['placeholder', 'placeholder', 'placeholder', 'placeholder'],
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'shoes',
    itemCount: 3,
    previewPhotos: ['placeholder', 'placeholder'],
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'furniture',
    itemCount: 5,
    previewPhotos: ['placeholder', 'placeholder', 'placeholder'],
    createdAt: new Date(),
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('tag1');
  const stats = getUserStats(currentUser.uid);

  const handleEditProfile = () => {
    Alert.alert('edit profile', 'editing profile (coming soon)');
  };

  const handleBoardPress = (boardId: string) => {
    const board = mockBoards.find(b => b.id === boardId);
    if (board) {
      navigation.navigate('BoardDetail', { boardName: board.name });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* profile header */}
        <ProfileHeader
          user={currentUser}
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
        <FlatList
          data={mockBoards}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <BoardCard
              board={item}
              onPress={() => handleBoardPress(item.id)}
            />
          )}
          contentContainerStyle={styles.boardsListContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
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
    backgroundColor: colors.text,
  },
  tagText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  activeTagText: {
    color: colors.background,
  },
  boardsListContent: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
});
