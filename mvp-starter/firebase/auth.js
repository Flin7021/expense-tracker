/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, firestore } from './firebase';
import {
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as authSignOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
  flashcards: [],
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
    setAuthUser({
      uid: user.uid,
      email: user.email,
      flashcards: [],
    });
    setIsLoading(false);
  };

  const signOut = () => authSignOut(auth).then(clear);

  const signUpWithEmailAndPassword = async (email, password) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Get the user's unique ID
      const userId = userCredential.user.uid;

      // Create a new user document in Firestore
      const userRef = firestore.collection('users').doc(userId);
      const userData = {
        email: userCredential.user.email,
        flashcards: [],
      };
      await userRef.set(userData);

      // Redirect to the dashboard or perform other actions
      // router.push('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle the error
    }
  };

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, handleAuthStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    isLoading,
    signOut,
    signUpWithEmailAndPassword,
  };
}

export function AuthUserProvider({ children }) {
  const auth = useFireBaseAuth();
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
}

export const useAuth = () => useContext(AuthUserContext);
