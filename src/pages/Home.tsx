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
        <Typography align="center" variant="body1" sx={{ mt: 3, mx: 2 }}>
          This is the home page.
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