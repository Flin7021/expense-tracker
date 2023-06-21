import React from 'react';

const FavoriteFlashcard = ({ flashcard }) => {
  return (
    <div>
      <h3>Phrase: {flashcard.phrase}</h3>
      <p>Translation: {flashcard.translation}</p>
      <p>Category: {flashcard.category}</p>
      <p>Jyut Ping: {flashcard.jyutPing}</p>
    </div>
  );
};

export default FavoriteFlashcard;
