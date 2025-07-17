import React, { useState } from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { GET_USERS_QUERY } from '../graphql';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';

export const NewChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, loading, error } = useQuery(GET_USERS_QUERY);

  const handleUserPress = (user: User) => {
    navigation.replace('Chat', {
      userId: user.id,
      userName: user.username,
    });
  };

  const renderUser = ({ item }: { item: User }) => {
    // Don't show current user in the list
    if (item.id === currentUser?.id) return null;

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleUserPress(item)}
      >
        <Avatar
          rounded
          size="medium"
          title={item.username.substring(0, 2).toUpperCase()}
          containerStyle={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          {item.email && (
            <Text style={styles.email}>{item.email}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading users</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }

  const users = data?.users || [];
  const filteredUsers = users.filter((user: User) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users found' : 'No users available'}
            </Text>
          </View>
        }
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
  searchContainer: {
    backgroundColor: 'white',
  },
  searchInputContainer: {
    backgroundColor: '#f0f0f0',
  },
  listContainer: {
    paddingVertical: 8,
  },
  userItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
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
});