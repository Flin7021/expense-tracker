import AllFlashcards from '../components/AllFlashcards';
import styles from '../styles/flashcards.module.scss';

export default function FlashcardsPage() {
  return (
    <div className={styles.flashcardsPage}>
      <h1 className={styles.pageTitle}>Flashcards</h1>
      <div className={styles.flashcardsContainer}>
        <AllFlashcards />
      </div>
    </div>
  );
}
