// import { useEffect, useState } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { firestore } from '../firebase/firebase';

// export default function AllFlashcards() {
//   const [flashcards, setFlashcards] = useState([]);

//   useEffect(() => {
//     const fetchFlashcards = async () => {
//       try {
//         const flashcardsCollection = collection(firestore, 'flashcards');
//         const flashcardsSnapshot = await getDocs(flashcardsCollection);
//         const flashcardsData = flashcardsSnapshot.docs.map(doc => ({
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

//   return (
//     <div>
//       {flashcards.map(flashcard => (
//         <div key={flashcard.id}>
//           <h3>Phrase: {flashcard.phrase}</h3>
//           <p>Translation: {flashcard.translation}</p>
//           <p>Category: {flashcard.category}</p>
//           <p>Jyut Ping: {flashcard.jyutPing}</p>
//         </div>
//       ))}
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../firebase/auth';

export default function AllFlashcards() {
  const { authUser } = useAuth();
  const [flashcards, setFlashcards] = useState([]);

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

  const handleFavoriteClick = async (flashcardId) => {
    try {
      const userRef = doc(firestore, 'users', authUser.uid);
      await updateDoc(userRef, {
        flashcards: [...authUser.flashcards, flashcardId],
      });
    } catch (error) {
      console.error('Error adding flashcard to favorites: ', error);
    }
  };

  return (
    <div>
      {flashcards.map((flashcard) => (
        <div key={flashcard.id}>
          <h3>Phrase: {flashcard.phrase}</h3>
          <p>Translation: {flashcard.translation}</p>
          <p>Category: {flashcard.category}</p>
          <p>Jyut Ping: {flashcard.jyutPing}</p>
          <button onClick={() => handleFavoriteClick(flashcard.id)}>Add to Favorites</button>
        </div>
      ))}
    </div>
  );
}
