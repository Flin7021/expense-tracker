
import React from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '../styles/flashcards.module.scss'

const FavoriteFlashcard = ({ flashcard, onDelete }) => {
  const handleDelete = () => {
    onDelete(flashcard.id);
  };

  return (
    <div className={styles.flashcard}>
      <h3>Phrase: {flashcard.phrase}</h3>
      <p>Translation: {flashcard.translation}</p>
      <p>Category: {flashcard.category}</p>
      <p>Jyut Ping: {flashcard.jyutPing}</p>
      <IconButton onClick={handleDelete} aria-label="Delete">
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default FavoriteFlashcard;
