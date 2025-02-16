import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import CustomPage from '../components/CustomPage';
import { setNewAlert } from '../service/redux';

const DisplayStats: React.FC = () => {
  const dispatch = useDispatch();

  const alertHandler = () => {
    setNewAlert(dispatch, { msg: "Hello world!" });
  }
  
  return (
    <CustomPage>
      <Typography align="center" variant="body1" sx={{ mt: 3, mx: 2 }}>
        This is the display stats page.
      </Typography>
      <Container sx={{ my: 3 }}>
        <Button variant="contained" fullWidth onClick={alertHandler}>
          Click me!
        </Button>
      </Container>
    </CustomPage>
  )
};

export default DisplayStats;