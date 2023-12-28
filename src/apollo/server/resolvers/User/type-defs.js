import gql from 'graphql-tag';

export const userGQLSchema = gql`
input signInInput {
  email: String!
  password: String!
}

type User {
  _id: ID
  email: String
  firstName: String
  lastName: String
  isActive: Boolean
}

type SignInRes {
  token: String
  user: User
}

type Query {
    getUser(id: String): User
  }

type Mutation {
  signIn(input: signInInput!): SignInRes
}

`;