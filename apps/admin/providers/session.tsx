import { createContext, useContext, type PropsWithChildren } from 'react';

import { useStorageState } from '@/hooks/useStorageState';

const AuthContext = createContext<{
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: async () => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return context;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              setSession('xxx');
              resolve();
            }, 2000);
          });
        },
        signOut: () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              setSession(null);
              resolve();
            }, 2000);
          });
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
