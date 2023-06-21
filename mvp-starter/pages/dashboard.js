import { useEffect, useState } from 'react';
import { collection, getDocs, where, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../firebase/auth';
import CircularProgress from '@mui/material/CircularProgress';
import Layout from '../components/Layout';
import FavoriteFlashcard from '../components/FavoriteFlashcard';

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
      const fetchFavoriteFlashcards = async () => {
        try {
          const flashcardsCollection = collection(firestore, 'flashcards');

          const flashcards = await Promise.all(
            authUser.favoriteFlashcards.map(async (flashcardId) => {
              const flashcardDoc = await getDoc(doc(flashcardsCollection, flashcardId));
              if (flashcardDoc.exists()) {
                const flashcardData = flashcardDoc.data();
                return {
                  id: flashcardDoc.id,
                  ...flashcardData,
                };
              }
            })
          );

          setFavoriteFlashcards(flashcards.filter(Boolean));
        } catch (error) {
          console.error('Error fetching favorite flashcards: ', error);
        }
      };

      fetchFavoriteFlashcards();
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
        {favoriteFlashcards.length > 0 ? (
          favoriteFlashcards.map((flashcard) => (
            <FavoriteFlashcard key={flashcard.id} flashcard={flashcard} />
          ))
        ) : (
          <p>No favorite flashcards found.</p>
        )}
      </div>
    </Layout>
  );
}
