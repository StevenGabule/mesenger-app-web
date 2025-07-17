import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { FAB } from 'react-native-elements';
import { ConversationItem } from '../components/ConversationItem';
import { GET_CONVERSATIONS_QUERY, MESSAGE_SUBSCRIPTION } from '../graphql';
import { useAuth } from '../context/AuthContext';

export const ConversationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  
  const { data, loading, error, refetch, subscribeToMore } = useQuery(
    GET_CONVERSATIONS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    // Subscribe to new messages
    const unsubscribe = subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        
        // Update conversations list with new message
        // This is a simplified version - you might need to adjust based on your schema
        return {
          ...prev,
          conversations: prev.conversations.map((conv: any) => {
            if (conv.participant.id === subscriptionData.data.messageReceived.senderId ||
                conv.participant.id === subscriptionData.data.messageReceived.receiverId) {
              return {
                ...conv,
                lastMessage: subscriptionData.data.messageReceived,
              };
            }
            return conv;
          }),
        };
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore]);

  const renderConversation = ({ item }: { item: any }) => (
    <ConversationItem
      participant={item.participant}
      lastMessage={item.lastMessage}
      unreadCount={item.unreadCount}
    />
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
        <Text style={styles.errorText}>Error loading conversations</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }

  const conversations = data?.conversations || [];

  return (
    <View style={styles.container}>
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to start a new conversation
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor="#007AFF"
            />
          }
        />
      )}
      
      <FAB
        icon={{ name: 'add', color: 'white' }}
        color="#007AFF"
        style={styles.fab}
        onPress={() => navigation.navigate('NewChat')}
      />
    </View>
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
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});