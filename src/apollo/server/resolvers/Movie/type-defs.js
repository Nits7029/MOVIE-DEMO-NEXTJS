import gql from 'graphql-tag';

export const movieGQLSchema = gql`

input MovieInput {
    _id: String
    title: String
    year: Int
    poster: String
}

type Movie {
    _id: String
    title: String
    year: Int
    poster: String
    createdBy: User
    createdAt: String
    updatedAt: String
}

type paginateMovie {
    count: Int
    data: [Movie]
}

type Query {
    getMovies(page:Int limit: Int): paginateMovie
    getMovie(id: ID): Movie
}

type Mutation {
    createMovie(input: MovieInput!): Movie
    updateMovie(input: MovieInput!): Movie
}
`