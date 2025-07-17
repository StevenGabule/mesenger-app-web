import { gql } from '@apollo/client';
import { MESSAGE_FRAGMENT } from './fragments';

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageReceived {
    messageReceived {
      ...MessageDetails
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const USER_MESSAGE_SUBSCRIPTION = gql`
  subscription OnUserMessageReceived($userId: ID!) {
    messageReceived(userId: $userId) {
      ...MessageDetails
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const TYPING_SUBSCRIPTION = gql`
  subscription OnUserTyping($userId: ID!) {
    userTyping(userId: $userId) {
      userId
      isTyping
    }
  }
`;

export const USER_STATUS_SUBSCRIPTION = gql`
  subscription OnUserStatusChanged {
    userStatusChanged {
      userId
      isOnline
      lastSeen
    }
  }
`;