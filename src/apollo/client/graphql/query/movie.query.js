import { gql } from '@apollo/client';

export const GET_MOVIES = gql`
query GetMovies($page: Int, $limit: Int) {
  getMovies(page: $page, limit: $limit) {
    count
    data {
      _id
      title
      year
      poster
      createdBy {
        _id
        email
      }
      createdAt
      updatedAt
    }
  }
}
`

export const GET_MOVIE = gql`
query GetMovie($id: ID) {
  getMovie(id: $id) {
      _id
      title
      year
      poster
      createdBy {
        _id
        email
      }
      createdAt
      updatedAt
    }
}
`