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

import { useEffect, useState } from 'react';
import { collection, getDocs, where, query, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { firestore } from '../firebase/firestore';
import { useAuth } from '../firebase/auth';
import Flashcards from '../components/AllFlashcards';
import CircularProgress from '@mui/material/CircularProgress';

export default function Dashboard() {
  const { authUser, isLoading } = useAuth();
  const [favoriteFlashcards, setFavoriteFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/');
    }
  }, [authUser, isLoading, router]);

  useEffect(() => {
    if (authUser) {
      const unsubscribe = onSnapshot(
        query(collection(firestore, 'flashcards'), where('favorites', 'array-contains', authUser.uid)),
        (snapshot) => {
          const flashcards = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavoriteFlashcards(flashcards);
        }
      );

      return () => unsubscribe();
    }
  }, [authUser]);

  if (isLoading) {
    return (
      <CircularProgress
        color="inherit"
        sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      />
    );
  }

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <h2>Your Favorite Flashcards:</h2>
      {favoriteFlashcards.map((flashcard) => (
        <Flashcard key={flashcard.id} flashcard={flashcard} />
      ))}
    </div>
  );
}
