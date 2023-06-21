import { useEffect, useState } from 'react';
import { collection, getDocs, where, query, onSnapshot, doc, getDoc, deleteDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../firebase/auth';
import CircularProgress from '@mui/material/CircularProgress';
import Layout from '../components/Layout';
import FavoriteFlashcard from '../components/FavoriteFlashcard';
import Link from 'next/link'; 
import styles from '../styles/dashboard.module.scss'


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


  const handleDelete = async (flashcardId) => {
    try {
      // Create a reference to the user's document
      const userDocRef = doc(firestore, 'users', authUser.uid);

      // Remove the flashcard ID from the favoriteFlashcards array
      await updateDoc(userDocRef, {
        favoriteFlashcards: arrayRemove(flashcardId)
      });

      // Update the favoriteFlashcards state by filtering out the deleted flashcard
      setFavoriteFlashcards((prevFlashcards) =>
        prevFlashcards.filter((flashcard) => flashcard.id !== flashcardId)
      );
    } catch (error) {
      console.error('Error deleting flashcard: ', error);
    }
  };



  return (
    <Layout>
      <div>
        <h1>Welcome to Your Dashboard</h1>
        <Link href="/flashcards">Go to Flashcards</Link> {/* Add the link to /flashcards */}
        <h2>Your Favorite Flashcards:</h2>
        <div className={styles.flashcardsContainer}>
        {favoriteFlashcards.length > 0 ? (
          favoriteFlashcards.map((flashcard) => (
            <FavoriteFlashcard key={flashcard.id} flashcard={flashcard} onDelete={handleDelete} className={styles.flashcard}/>
          ))
        ) : (
          <p>No favorite flashcards found.</p>
        )}
      </div>
      </div>
    </Layout>
  );
}
