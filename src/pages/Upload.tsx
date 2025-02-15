import React from 'react';
import { Button, Container, Typography, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import CustomPage from '../components/CustomPage';
import { setNewAlert } from '../service/alert';

const Upload: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const alertHandler = () => {
    setNewAlert(dispatch, { msg: "Hello world!" });
  }

  const changePage = (page: string) => {
    history.push('/' + page);
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
          Upload Your Notes
        </Typography>

        {/* Your notes section */}
        
        <Typography variant="h5" sx={{ mt: 3}}>
          Your Notes
        </Typography>

        <Typography variant="body1">
          Upload your notes to generate a visual graph of important concepts and themes to help you study more effectively. Unlock key insights and connections between topics to help you better understand your course material.
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={4}>
            <Button variant="contained" color='primary' fullWidth>
              Upload Notes (.pdf)
            </Button>
          </Grid>
        </Grid>

        {/* Lecture notes section */}

        <Typography variant="h5" sx={{ mt: 3}}>
          Lecture Material
        </Typography>
        
        <Typography variant='body1'>
          Upload your lecture slides, notes, or any other material you have for a course. Our system will analyze the text and generate a graph of the most important concepts and themes. If you also uploaded your notes as well, we can identify gaps in your understanding and help you focus on the most important topics.
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={4}>
            <Button variant="contained" color='primary' fullWidth>
              Upload Video (.mp4)
            </Button>
          </Grid>
        </Grid>

        {/* Generate output section */}

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={6}>
            <Button variant="contained" color='primary' fullWidth onClick={() => changePage('/display')}>
              Generate Graph
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" color='primary' fullWidth onClick={() => changePage('')}>
              Back
            </Button>
          </Grid>
        </Grid>
      </Container>
    </CustomPage>
  )
};

export default Upload;