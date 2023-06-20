import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { EmailAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Button, CircularProgress, Container, Dialog, Typography } from '@mui/material';
import { auth, firestore } from '../firebase/firebase';
import styles from '../styles/landing.module.scss';
import { useAuth } from '../firebase/auth';
import Layout from '../components/Layout';

const REDIRECT_PAGE = '/dashboard';

// Configure FirebaseUI
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: REDIRECT_PAGE,
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
};

export default function Home() {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();
  const [login, setLogin] = useState(false);

  // Redirect if finished loading and there's an existing user (user is logged in)
  useEffect(() => {
    if (!isLoading && authUser && router.pathname !== '/dashboard') {
      router.push('/dashboard');
    }
  }, [authUser, isLoading, router]);

  if (isLoading || authUser) {
    return (
      <CircularProgress
        color="inherit"
        sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      />
    );
  }

  // Function to create a new user with email and password
  const signUpWithEmailAndPassword = async (email, password) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Get the user's unique ID
      const userId = userCredential.user.uid;

      // Create a new user document in Firestore
      const userRef = firestore.collection('users').doc(userId);
      const userData = {
        email: userCredential.user.email,
        favoriteFlashcards: [],
      };
      await userRef.set(userData);

      // Log the user data in the console (optional)
      console.log('New user data:', userData);

      // Redirect to the dashboard or perform other actions
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle the error
    }
  };

  // Function to sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Create a GoogleAuthProvider instance
      const provider = new GoogleAuthProvider();

      // Sign in with Google using a pop-up window
      const userCredential = await signInWithPopup(auth, provider);

      // Get the user's unique ID
      const userId = userCredential.user.uid;

      // Check if the user document already exists in Firestore
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // User document doesn't exist, create a new one
        const userData = {
          email: userCredential.user.email,
          favoriteFlashcards: [],
        };
        await userRef.set(userData);

        // Log the user data in the console (optional)
        console.log('New user data:', userData);
      }

      // Redirect to the dashboard or perform other actions
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Handle the error
    }
  };

  return (
    <Layout>
    <div>
      <Head>
        <title>Welcome ABCs</title>
      </Head>

      <main>
        <Container className={styles.container}>
          <Typography variant="h1">Welcome to Learn Cantonese!</Typography>
          <Typography variant="h2">View Your Flashcards</Typography>
          <div className={styles.buttons}>
            <Button variant="contained" color="secondary" onClick={() => setLogin(true)}>
              Login / Register
            </Button>
          </div>
          <Dialog open={login} onClose={() => setLogin(false)}></Dialog>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={auth}
            signInSuccessUrl={REDIRECT_PAGE}
            callbacks={{
              signInWithGoogle,
              signInWithEmailAndPassword: signUpWithEmailAndPassword,
            }}
          ></StyledFirebaseAuth>
        </Container>
      </main>
    </div>
    </Layout>
  );
}
