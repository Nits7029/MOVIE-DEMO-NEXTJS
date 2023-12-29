'use client'

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MOVIE } from '@/apollo/client/graphql/query/movie.query';
import MovieForm from '@/components/MovieForm';

export default function MovieUpdate({ params }) {

  const [movieData, setMovieData] = useState()

  const { data, loading, refetch } = useQuery(GET_MOVIE, {
    variables: {
      id: params?.id
    },
    fetchPolicy: "cache-and-network",
    skip: !params?.id
  })

  useEffect(() => {
    if (data?.getMovie) {
      setMovieData(data?.getMovie)
    }
  }, [data])


  return (
    <MovieForm
      operation="edit"
      editData={movieData}
    />
  )

}