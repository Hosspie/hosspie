import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { HttpLink } from '@apollo/client/link/http';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const httpLink = new HttpLink({
  uri: `${API_URL}/graphql`,
});

const authLink = new SetContextLink(async (prevContext) => {
  const token = await SecureStore.getItemAsync('session');

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
