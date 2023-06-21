import AllFlashcards from '../components/AllFlashcards';
import Layout from '../components/Layout';
import styles from '../styles/flashcards.module.scss';
import Link from 'next/link'; // Import Link component


export default function FlashcardsPage() {
  return (
    <Layout>
    <Link href="/dashboard">Go to Dashboard And Review!</Link> {/* Add the link to /flashcards */}
    <div className={styles.flashcardsPage}>
      <h1 className={styles.pageTitle}>Flashcards</h1>
      <div className={styles.flashcardsContainer}>
        <AllFlashcards />
      </div>
    </div>
    </Layout>
  );
}
