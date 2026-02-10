import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MessageBubble from '@components/messages/MessageBubble';
import MessageInput from '@components/messages/MessageInput';
import ListingContextCard from '@components/messages/ListingContextCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { useAuth } from '@contexts/AuthContext';
import { useChat } from '@hooks/useChat';
import { getListingById } from '@services/firebase/listingService';
import { Message, SerializableConversation, serializeListing } from '@types';
import { colors } from '@constants/theme';

type ChatRouteParams = {
  Chat: {
    conversationId: string;
    conversation: SerializableConversation;
  };
};

type ChatRouteProp = RouteProp<ChatRouteParams, 'Chat'>;
type ChatNavigationProp = StackNavigationProp<any>;

export default function ChatScreen() {
  const route = useRoute<ChatRouteProp>();
  const navigation = useNavigation<ChatNavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuth();
  const currentUserId = user?.uid || '';

  const { conversationId, conversation } = route.params;
  const { messages, loading, sendMessage } = useChat(conversationId);
  const [inputText, setInputText] = useState('');

  // get other participant
  const otherUserId = conversation.participantIds.find(id => id !== currentUserId) || '';
  const otherParticipant = conversation.participants[otherUserId];

  // set header title
  useEffect(() => {
    navigation.setOptions({
      title: otherParticipant?.username || 'chat',
    });
  }, [navigation, otherParticipant]);

  const handleSend = async () => {
    if (inputText.trim().length === 0) return;

    const text = inputText.trim();
    setInputText('');

    await sendMessage(text);

    // scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleListingPress = async () => {
    const listing = await getListingById(conversation.listingId);
    if (listing) {
      navigation.navigate('ListingDetail', { listing: serializeListing(listing) });
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwnMessage = item.senderId === currentUserId;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isOwnMessage && (!previousMessage || previousMessage.senderId !== item.senderId);

    return (
      <MessageBubble
        message={item}
        isOwnMessage={isOwnMessage}
        showAvatar={showAvatar}
        avatarUrl={otherParticipant?.photoURL}
      />
    );
  };

  if (loading && messages.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={true}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListHeaderComponent={
            <ListingContextCard
              listingId={conversation.listingId}
              title={conversation.listingTitle}
              photoURL={conversation.listingPhotoURL}
              onPress={handleListingPress}
            />
          }
        />

        <MessageInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
