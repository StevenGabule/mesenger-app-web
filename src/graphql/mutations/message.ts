import { gql } from '@apollo/client';
import { MESSAGE_FRAGMENT } from '../fragments';

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      ...MessageDetails
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessage($content: String!, $receiverId: ID!) {
    createMessage(content: $content, receiverId: $receiverId) {
      ...MessageDetails
    }
  }
  ${MESSAGE_FRAGMENT}
`;