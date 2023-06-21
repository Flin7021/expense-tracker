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
      <div className={styles.titleContainer}>
        <h1 className={styles.pageTitle}>Flashcards</h1>
        <div className={styles.dashboardContainer}>
        <button className={styles.dashboardButton} onClick={handleDashboardLinkClick}>Go to Dashboard And Review!</button>
        </div>
        </div>
        <div >
          <AllFlashcards />
        </div>
      </div>
    </Layout>
  );
}
