import { gql } from '@apollo/client';
import { USER_FRAGMENT, MESSAGE_FRAGMENT } from './fragments';

// Get current user
export const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    currentUser {
      ...UserDetails
    }
  }
  ${USER_FRAGMENT}
`;

// Get all users (for selecting who to message)
export const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      ...UserDetails
    }
  }
  ${USER_FRAGMENT}
`;

// Get messages between two users
export const GET_MESSAGES_QUERY = gql`
  query GetMessages($userId: ID!) {
    messages(userId: $userId) {
      ...MessageDetails
    }
  }
  ${MESSAGE_FRAGMENT}
`;

// Get conversation list (all conversations)
export const GET_CONVERSATIONS_QUERY = gql`
  query GetConversations {
    conversations {
      id
      lastMessage {
        ...MessageDetails
      }
      participant {
        ...UserDetails
      }
      unreadCount
    }
  }
  ${MESSAGE_FRAGMENT}
  ${USER_FRAGMENT}
`;

// Alternative: Get messages with pagination
export const GET_MESSAGES_PAGINATED_QUERY = gql`
  query GetMessagesPaginated($userId: ID!, $limit: Int!, $offset: Int!) {
    messages(userId: $userId, limit: $limit, offset: $offset) {
      messages {
        ...MessageDetails
      }
      hasMore
      totalCount
    }
  }
  ${MESSAGE_FRAGMENT}
`;