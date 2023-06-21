import React from 'react';
import styles from '../styles/flashcards.module.scss'

const FavoriteFlashcard = ({ flashcard }) => {
  return (
    <div className={styles.flashcard}>
      <h3>Phrase: {flashcard.phrase}</h3>
      <p>Translation: {flashcard.translation}</p>
      <p>Category: {flashcard.category}</p>
      <p>Jyut Ping: {flashcard.jyutPing}</p>
    </div>
  );
};

export default FavoriteFlashcard;
