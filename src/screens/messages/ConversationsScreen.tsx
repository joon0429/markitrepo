import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ConversationListItem from '@components/messages/ConversationListItem';
import EmptyState from '@components/common/EmptyState';
import { getConversations } from '@services/mock/messages';
import { Conversation, SerializableConversation, serializeConversation } from '@types';
import { colors, spacing } from '@constants/theme';

// current user id (will be replaced with actual auth later)
const CURRENT_USER_ID = 'user-1'; // sarah_parker

type MessagesNavigationProp = StackNavigationProp<any>;

export default function ConversationsScreen() {
  const navigation = useNavigation<MessagesNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  const conversations = getConversations();

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleConversationPress = (conversation: Conversation) => {
    navigation.navigate('Chat', {
      conversationId: conversation.id,
      conversation: serializeConversation(conversation),
    });
  };

  if (conversations.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="💬"
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
            currentUserId={CURRENT_USER_ID}
            onPress={() => handleConversationPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
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
