import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../fragments';

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        ...UserDetails
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserDetails
      }
    }
  }
  ${USER_FRAGMENT}
`;