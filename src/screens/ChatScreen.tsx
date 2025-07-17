import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useQuery, useMutation } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import { MessageBubble } from '../components/MessageBubble';
import { 
  GET_MESSAGES_QUERY, 
  SEND_MESSAGE_MUTATION, 
  USER_MESSAGE_SUBSCRIPTION 
} from '../graphql';
import { Message } from '../types';
import { useAuth } from '../context/AuthContext';

export const ChatScreen: React.FC = () => {
  const route = useRoute<any>();
  const { userId, userName } = route.params;
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data, loading, error, subscribeToMore } = useQuery(
    GET_MESSAGES_QUERY,
    {
      variables: { userId },
      fetchPolicy: 'cache-and-network',
    }
  );

  const [sendMessage, { loading: sending }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: (cache, { data: { sendMessage } }) => {
        // Only update cache for our own sent messages
        const existingMessages = cache.readQuery({
          query: GET_MESSAGES_QUERY,
          variables: { userId },
        }) as any;

        cache.writeQuery({
          query: GET_MESSAGES_QUERY,
          variables: { userId },
          data: {
            messages: [...(existingMessages?.messages || []), sendMessage],
          },
        });
      },
    }
  );

  useEffect(() => {
    // Subscribe to messages sent TO the current user
    const unsubscribe = subscribeToMore({
      document: USER_MESSAGE_SUBSCRIPTION,
      variables: { userId: user?.id }, // Current user's ID to receive messages
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        
        const newMessage = subscriptionData.data.messageReceived;
        
        // Only add messages from this specific conversation
        // Check if the message is from the user we're chatting with
        if (newMessage.senderId !== userId) {
          return prev; // Not from this conversation
        }
        
        // Don't add if message already exists
        if (prev.messages.some((msg: Message) => msg.id === newMessage.id)) {
          return prev;
        }

        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        };
      },
    });

    return () => unsubscribe();
  }, [userId, user?.id, subscribeToMore]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({
        variables: {
          input: {
            content: message.trim(),
            receiverId: userId,
          },
        },
      });
      setMessage('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  if (loading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading messages</Text>
      </View>
    );
  }

  const messages = data?.messages || [];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Start a conversation with {userName}
            </Text>
          </View>
        }
      />
      
      <View style={styles.inputContainer}>
        <Input
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
          containerStyle={styles.textInput}
          inputContainerStyle={styles.textInputInner}
          multiline
        />
        <Button
          icon={{ name: 'send', color: 'white', size: 20 }}
          onPress={handleSend}
          loading={sending}
          disabled={!message.trim() || sending}
          buttonStyle={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
  },
  textInputInner: {
    borderBottomWidth: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
  },
});