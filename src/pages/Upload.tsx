import React, { useState } from 'react';
import { Button, Container, Typography, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import CustomPage from '../components/CustomPage';
import { setNewAlert } from '../service/alert';
import { addNewGraph } from '../service/graph';
import { handleUpload } from '../service/upload';
import { Graph } from '../service/graphs/graph';

const Upload: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedUserPngFile, setSelectedUserPngFile] = useState<File | null>(null);
  const [selectedMp3File, setSelectedMp3File] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(-1);

  const changePage = (page: string) => {
    history.push('/' + page);
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
      setSelectedUserPngFile(file);
      console.log("File selected:", file);
    } else {
      setSelectedUserPngFile(null);
      setNewAlert(dispatch, { msg: "Invalid file type. Please upload a PNG file.", alertType: "error" });
    }
  }

  const handleMp3FileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'audio/mpeg') {
      setSelectedMp3File(file);
      console.log("MP3 file selected:", file);
    } else {
      setSelectedMp3File(null);
      console.error("Invalid file type. Please upload an MP3.");
       setNewAlert(dispatch, { msg: "Invalid file type. Please upload an MP3.", alertType: "error" });
    }
  }

  // Handle submitting the form
  const generateGraph = async () => {
    if (progress > -1) {
      setNewAlert(dispatch, { msg: "You already have a generation request being processed!", alertType: "error" });
      return;
    }

    if (selectedUserPngFile || selectedMp3File) {
      // Submit the form
      setProgress(0);
      setNewAlert(dispatch, { msg: "Your data is being processed, please wait...", alertType: "success" });
      let [graphName, graphData, graphStats]: any = await handleUpload(selectedUserPngFile, selectedMp3File, setProgress);

      // Save to redux
      const id = addNewGraph(dispatch, { name: graphName, graph: graphData, stats: graphStats });
      setNewAlert(dispatch, { msg: "Your knowledge graph and analytics have been generated!", alertType: "success" });
      setProgress(100);

      // Change page
      changePage('display/' + id + '/graph');
    } else {
      setNewAlert(dispatch, { msg: "Please upload either your notes, the lecture materials, or both!", alertType: "error" });
    }
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
            <input
              type="file"
              id="user-png-upload" // Unique ID for PNG input
              accept=".png" // Specify accepted file types
              style={{ display: 'none' }} // Hide the input element
              onChange={handleFileUpload}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => document.getElementById('user-png-upload')?.click()}
            >
              {selectedUserPngFile ? selectedUserPngFile.name : "Upload Notes (.png)"}
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
            <input
              type="file"
              id="mp3-upload" // Unique ID for MP3 input
              accept=".mp3" // or "audio/mpeg" (both should work)
              style={{ display: 'none' }}
              onChange={handleMp3FileUpload}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => document.getElementById('mp3-upload')?.click()}
            >
              {selectedMp3File ? selectedMp3File.name : "Upload Audio (.mp3)"}
            </Button>
          </Grid>
        </Grid>

        {/* Generate output section */}

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={6}>
            <Button variant="contained" color='primary' fullWidth onClick={generateGraph}>
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