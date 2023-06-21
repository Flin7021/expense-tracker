import { createContext, useContext, useState, useEffect } from 'react';
import { auth, firestore } from './firebase';
import {
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as authSignOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, collection, setDoc, getDoc } from 'firebase/firestore';

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
  favoriteFlashcards: [],
});

export default function useFireBaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };


  const handleAuthStateChanged = async (user) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }

    const userRef = doc(collection(firestore, 'users'), user.uid);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAuthUser({
          uid: user.uid,
          email: user.email,
          favoriteFlashcards: userData.favoriteFlashcards || [], 
        });
      } else {
        // User document doesn't exist, create a new one
        await setDoc(userRef, {
          email: user.email,
          favoriteFlashcards: [],
        });
        setAuthUser({
          uid: user.uid,
          email: user.email,
          favoriteFlashcards: [],
        });
      }
    } catch (error) {
      console.error('Error retrieving user data: ', error);
      clear();
    }

    setIsLoading(false);
  };


  const signOut = () => authSignOut(auth).then(clear);

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, handleAuthStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    isLoading,
    signOut,
  };
}

export function AuthUserProvider({ children }) {
  const auth = useFireBaseAuth();
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
}

export const useAuth = () => useContext(AuthUserContext);
