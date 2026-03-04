import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { PropsWithChildren } from 'react';

import { apolloClient } from '@/lib/apollo/client';

export function ApolloProvider({ children }: PropsWithChildren) {
  return <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>;
}
