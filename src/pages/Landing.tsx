import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import CustomPage from '../components/CustomPage';
import { setNewAlert } from '../service/alert';

const Landing: React.FC = () => {
  const dispatch = useDispatch();

  const alertHandler = () => {
    setNewAlert(dispatch, { msg: "Hello world!" });
  }
  
  return (
    <CustomPage>
      <Typography align="center" variant="body1" sx={{ mt: 3, mx: 2 }}>
        This is boilerplate code placed here for your convenience. Please modify for your own use.
      </Typography>
      <Container sx={{ mt: 3 }}>
        <Button variant="contained" fullWidth onClick={alertHandler}>
          Click me!
        </Button>
      </Container>
    </CustomPage>
  )
};

export default Landing;