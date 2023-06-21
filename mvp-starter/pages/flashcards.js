import AllFlashcards from '../components/AllFlashcards';
import Layout from '../components/Layout';
import styles from '../styles/flashcards.module.scss';
import { useRouter } from 'next/router';

export default function FlashcardsPage() {
  const router = useRouter();

  const handleDashboardLinkClick = async () => {
    await router.push('/dashboard'); // Navigate to dashboard page
    router.reload(); // Reload the dashboard page
  };

  return (
    <Layout>
      <div className={styles.flashcardsPage}>
        <h1 className={styles.pageTitle}>Flashcards</h1>
        <button onClick={handleDashboardLinkClick}>Go to Dashboard And Review!</button>
        <div className={styles.flashcardsContainer}>
          <AllFlashcards />
        </div>
      </div>
    </Layout>
  );
}
