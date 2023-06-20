import { useEffect, useState } from 'react';
import { collection, getDocs, where, query, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../firebase/auth';
import CircularProgress from '@mui/material/CircularProgress';
import Layout from '../components/Layout';

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
    <Layout>
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <h2>Your Favorite Flashcards:</h2>
      {favoriteFlashcards.map((flashcard) => (
        <Flashcard key={flashcard.id} flashcard={flashcard} />
      ))}
    </div>
    </Layout>
  );
}
