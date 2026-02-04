import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MessageBubble from '@components/messages/MessageBubble';
import MessageInput from '@components/messages/MessageInput';
import ListingContextCard from '@components/messages/ListingContextCard';
import { getMessages } from '@services/mock/messages';
import { Message, SerializableConversation, SerializableListing, serializeListing } from '@types';
import { mockListings } from '@services/mock/listings';
import { colors } from '@constants/theme';
import { v4 as uuidv4 } from 'uuid';

const CURRENT_USER_ID = 'user-1'; // sarah_parker

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

  const { conversationId, conversation } = route.params;

  const [messages, setMessages] = useState(getMessages(conversationId));
  const [inputText, setInputText] = useState('');

  // get other participant
  const otherUserId = conversation.participantIds.find(id => id !== CURRENT_USER_ID) || '';
  const otherParticipant = conversation.participants[otherUserId];

  // set header title
  useEffect(() => {
    navigation.setOptions({
      title: otherParticipant?.username || 'chat',
    });
  }, [navigation, otherParticipant]);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const newMessage: Message = {
      id: uuidv4(),
      conversationId,
      senderId: CURRENT_USER_ID,
      senderUsername: 'sarah_parker',
      text: inputText.trim(),
      timestamp: { toDate: () => new Date() } as any,
      readBy: [CURRENT_USER_ID],
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');

    // scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // show confirmation
    Alert.alert('message sent', 'your message has been sent (mock)');
  };

  const handleListingPress = () => {
    // find listing by id
    const listing = mockListings.find(l => l.id === conversation.listingId);
    if (listing) {
      navigation.navigate('ListingDetail', { listing: serializeListing(listing) });
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwnMessage = item.senderId === CURRENT_USER_ID;
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
          showsVerticalScrollIndicator={false}
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
