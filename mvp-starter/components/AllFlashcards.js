// import { useEffect, useState } from 'react';
// import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
// import { firestore } from '../firebase/firebase';
// import { useAuth } from '../firebase/auth';

// export default function AllFlashcards() {
//   const { authUser } = useAuth();
//   const [flashcards, setFlashcards] = useState([]);

//   useEffect(() => {
//     console.log(authUser);

//     const fetchFlashcards = async () => {
//       try {
//         const flashcardsCollection = collection(firestore, 'flashcards');
//         const flashcardsSnapshot = await getDocs(flashcardsCollection);
//         const flashcardsData = flashcardsSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setFlashcards(flashcardsData);
//       } catch (error) {
//         console.error('Error fetching flashcards: ', error);
//       }
//     };

//     fetchFlashcards();
//   }, []);

//   const handleFavoriteClick = async (flashcardId) => {
//     try {
//       const userRef = doc(firestore, 'users', authUser.uid);
//       const userDoc = await getDoc(userRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const favoriteFlashcards = userData.favoriteFlashcards || [];
//         const updatedFavoriteFlashcards = [...favoriteFlashcards, flashcardId];
//         await updateDoc(userRef, {
//           favoriteFlashcards: updatedFavoriteFlashcards,
//         });
//       }
//     } catch (error) {
//       console.error('Error adding flashcard to favorites: ', error);
//     }
//   };


//   return (
//     <div>
//       {flashcards.map((flashcard) => (
//         <div key={flashcard.id}>
//           <h3>Phrase: {flashcard.phrase}</h3>
//           <p>Translation: {flashcard.translation}</p>
//           <p>Category: {flashcard.category}</p>
//           <p>Jyut Ping: {flashcard.jyutPing}</p>
//           <button onClick={() => handleFavoriteClick(flashcard.id)}>Add to Favorites</button>
//         </div>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../firebase/auth';
import styles from '../styles/flashcards.module.scss'; // Import additional styles

export default function AllFlashcards() {
  const { authUser } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // State for the selected category

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
    setSelectedCategory(event.target.value); // Update the selected category state
  };

  // Filter flashcards based on the selected category
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
    </div>
  );
        }

