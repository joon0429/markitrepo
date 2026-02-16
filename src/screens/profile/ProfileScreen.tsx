import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import ProfileHeader from '@components/profile/ProfileHeader';
import SearchBar from '@components/common/SearchBar';
import ClosetCard from '@components/profile/ClosetCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import EmptyState from '@components/common/EmptyState';
import { useProfile } from '@hooks/useProfile';
import { colors, spacing } from '@constants/theme';

type ProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const { profile, closets, stats, loading, error } = useProfile();

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleClosetPress = (closetId: string) => {
    const closet = closets.find(c => c.id === closetId);
    if (closet) {
      navigation.navigate('ClosetDetail', { closetName: closet.name });
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

        {/* closets grid */}
        {closets.length === 0 ? (
          <EmptyState
            icon="grid-outline"
            title="no closets yet"
            description="create a listing to start organizing your items"
          />
        ) : (
        <FlatList
          data={closets}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <ClosetCard
              closet={item}
              onPress={() => handleClosetPress(item.id)}
            />
          )}
          contentContainerStyle={styles.closetsListContent}
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
  closetsListContent: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
});
