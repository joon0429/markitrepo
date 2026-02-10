import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ConversationListItem from '@components/messages/ConversationListItem';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { useAuth } from '@contexts/AuthContext';
import { useConversations } from '@hooks/useConversations';
import { Conversation, serializeConversation } from '@types';
import { colors } from '@constants/theme';

type MessagesNavigationProp = StackNavigationProp<any>;

export default function ConversationsScreen() {
  const navigation = useNavigation<MessagesNavigationProp>();
  const { user } = useAuth();
  const { conversations, loading, refresh } = useConversations();
  const currentUserId = user?.uid || '';

  const handleRefresh = async () => {
    await refresh();
  };

  const handleConversationPress = (conversation: Conversation) => {
    navigation.navigate('Chat', {
      conversationId: conversation.id,
      conversation: serializeConversation(conversation),
    });
  };

  if (loading && conversations.length === 0) {
    return <LoadingSpinner />;
  }

  if (!loading && conversations.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="chatbubbles-outline"
          title="no messages yet"
          description="start a conversation by marking a listing"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationListItem
            conversation={item}
            currentUserId={currentUserId}
            onPress={() => handleConversationPress(item)}
          />
        )}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
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
