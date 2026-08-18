import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { auth, db, isFirebaseConfigured } from "@/integrations/firebase/client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
      if (next) {
        void setDoc(
          doc(db, "profiles", next.uid),
          {
            displayName: next.displayName ?? next.email?.split("@")[0] ?? null,
            avatarUrl: next.photoURL ?? null,
            email: next.email ?? null,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: async () => {
          if (isFirebaseConfigured) await fbSignOut(auth);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
