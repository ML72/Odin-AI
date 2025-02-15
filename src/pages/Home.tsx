import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useHistory } from 'react-router';

import CustomPage from '../components/CustomPage';

const Home: React.FC = () => {
  const history = useHistory();
  
  const clickUpload = () => {
      history.push('/upload');
  }
  
  return (
    <CustomPage>
      <Typography align="center" variant="body1" sx={{ mt: 3, mx: 2 }}>
        This is the home page.
      </Typography>
      <Container sx={{ my: 3 }}>
        <Button variant="contained" fullWidth onClick={clickUpload}>
          Upload
        </Button>
      </Container>
    </CustomPage>
  )
};

export default Home;