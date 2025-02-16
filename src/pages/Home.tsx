import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useHistory } from 'react-router';

import CustomPage from '../components/CustomPage';

const Home: React.FC = () => {
  const history = useHistory();
  
  const clickUpload = () => {
      history.push('/upload');
  }

  const clickHistory = () => {
      history.push('/history');
  }
  
  return (
    <CustomPage>
      <Container sx={{ my: 3}}>
        <Typography variant="h3" sx={{
          mt: 3,
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #E2C1FA, #C3B1FA, #B6CBFA)',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          Welcome to Odin AI
        </Typography>

        <Typography variant="h5" sx={{ mt: 3}}>
          Unlock your learning potential with our revolutionary note-taking and lecture-analyzing app!
        </Typography>

        <Typography variant="body1">
          We effortlessly transform raw notes and lecture recordings into interconnected knowledge graphs, revealing key themes and identifying gaps in your understanding. Visualize your knowledge, generate personalized quizzes, and conquer your studies with ease.
        </Typography>

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth onClick={clickUpload}>
              Upload New Materials
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" fullWidth onClick={clickHistory}>
              View Past Notes
            </Button>
          </Grid>
        </Grid>
      </Container>
    </CustomPage>
  )
};

export default Home;