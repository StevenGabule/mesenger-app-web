import { gql } from '@apollo/client';
import { MESSAGE_FRAGMENT } from './fragments';

// Subscribe to new messages
export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageReceived {
    messageReceived {
      ...MessageDetails
    }
  }
  ${MESSAGE_FRAGMENT}
`;

// Subscribe to new messages for a specific user
export const USER_MESSAGE_SUBSCRIPTION = gql`
  subscription OnUserMessageReceived($userId: ID!) {
    messageReceived(userId: $userId) {
      ...MessageDetails
    }
  }
  ${MESSAGE_FRAGMENT}
`;

// Subscribe to typing indicators (optional)
export const TYPING_SUBSCRIPTION = gql`
  subscription OnUserTyping($userId: ID!) {
    userTyping(userId: $userId) {
      userId
      isTyping
    }
  }
`;

// Subscribe to user online status (optional)
export const USER_STATUS_SUBSCRIPTION = gql`
  subscription OnUserStatusChanged {
    userStatusChanged {
      userId
      isOnline
      lastSeen
    }
  }
`;