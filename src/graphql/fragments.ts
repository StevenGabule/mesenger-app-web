import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserDetails on User {
    id
    username
    email
    createdAt
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageDetails on Message {
    id
    content
    senderId
    receiverId
    createdAt
    sender {
      ...UserDetails
    }
    receiver {
      ...UserDetails
    }
  }
  ${USER_FRAGMENT}
`;