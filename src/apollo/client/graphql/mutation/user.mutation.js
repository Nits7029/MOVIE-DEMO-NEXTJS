import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  mutation signIn($input: signInInput!){
    signIn(input:$input) {
      token
      user {
        _id
        email
        firstName
        lastName
        isActive
      }
    }
}
`