
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../firebase/auth';
import styles from '../styles/navbar.module.scss';

export default function NavBar() {
  const {authUser, signOut} = useAuth();

  const handleSignOut = () => {
    console.log("Sign out button clicked"); // Added console.log statement
    signOut();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={styles.appbar}>
        <Toolbar className={styles.toolbar}>
          <Container className={styles.container}>
            <Typography variant="h3" sx={{ flexGrow: 1, alignSelf: "center" }}>
              ADD SOME MORE CARDS, YO
            </Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {authUser?.email}
              </Typography>
              <Button variant="text" color="secondary" onClick={handleSignOut}>
                Logout
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
