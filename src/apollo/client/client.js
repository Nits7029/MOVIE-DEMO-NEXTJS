"use client";
import React from 'react'
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client'
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error";
import { persistCache } from "apollo-cache-persist";


if (typeof window !== 'undefined') {
  try {
    // See above for additional options, including other storage providers.
    persistCache({
      cache: new InMemoryCache(),
      storage: window.localStorage,
    });
  } catch (error) {
    console.error('Error restoring Apollo cache', error);
  }
}



const signOut = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/signin" // redirect user to login page
};

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions, path }) => {
      if (extensions.code === 'UNAUTHENTICATED') {
        signOut()
      }
    });
  }
});

const httpLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-and-network'
    }
  },
  cache: new InMemoryCache({ addTypename: false }),
})

export default client