import { gql } from '@apollo/client';

export const CREATE_MOVIE = gql`
  mutation CreateMovie($input: MovieInput!) {
  createMovie(input: $input) {
    _id
    title
    year
    poster
    createdAt
    updatedAt
  }
}
`

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie($input: MovieInput!) {
  updateMovie(input: $input) {
    _id
    title
    year
    poster
    createdAt
    updatedAt
  }
}
`