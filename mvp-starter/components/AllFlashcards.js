

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../firebase/auth';
import styles from '../styles/flashcards.module.scss'; // Import additional styles

export default function AllFlashcards() {
  const { authUser } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAlreadyAddedNotification, setShowAlreadyAddedNotification] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const flashcardsCollection = collection(firestore, 'flashcards');
        const flashcardsSnapshot = await getDocs(flashcardsCollection);
        const flashcardsData = flashcardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFlashcards(flashcardsData);
      } catch (error) {
        console.error('Error fetching flashcards: ', error);
      }
    };

    fetchFlashcards();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredFlashcards = selectedCategory
  ? flashcards.filter((flashcard) => flashcard.category === selectedCategory)
  : flashcards;

  const handleFavoriteClick = async (flashcardId) => {
    try {
      const userRef = doc(firestore, 'users', authUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favoriteFlashcards = userData.favoriteFlashcards || [];
        if (favoriteFlashcards.includes(flashcardId)) {
          setShowAlreadyAddedNotification(true);
          return;
        }
        const updatedFavoriteFlashcards = [...favoriteFlashcards, flashcardId];
        await updateDoc(userRef, {
          favoriteFlashcards: updatedFavoriteFlashcards,
        });
      }
    } catch (error) {
      console.error('Error adding flashcard to favorites: ', error);
    }
  };


  return (
    <div>
      <div>
        <label htmlFor="category">Select a category:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All</option>
          <option value="Dim sum">Dim sum</option>
          <option value="Expressions">Expressions</option>
          <option value="Animal">Animals</option>
          <option value="Careers">Careers</option>
          {/* Add more options for different categories */}
        </select>
      </div>
      <div className={styles.flashcardsContainer}>
      {filteredFlashcards.map((flashcard) => (
  <div key={flashcard.id} className={styles.flashcard}>
    <h3>Phrase: {flashcard.phrase}</h3>
    <p>Translation: {flashcard.translation}</p>
    <p>Category: {flashcard.category}</p>
    <p>Jyut Ping: {flashcard.jyutPing}</p>
    <button onClick={() => handleFavoriteClick(flashcard.id)}>Add to Favorites</button>
  </div>
))}

      </div>
      {showAlreadyAddedNotification && (
        <div className={styles.notification}>Flashcard already added to favorites</div>
      )}
    </div>
  );
}
