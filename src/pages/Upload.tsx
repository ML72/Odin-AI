import React, { useState } from 'react';
import { Button, Container, Typography, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import CustomPage from '../components/CustomPage';
import { setNewAlert } from '../service/alert';

const Upload: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedUserPdfFile, setSelectedUserPdfFile] = useState<File | null>(null);
  const [selectedMp4File, setSelectedMp4File] = useState<File | null>(null);

  const alertHandler = () => {
    setNewAlert(dispatch, { msg: "Hello world!" });
  }

  const changePage = (page: string) => {
    history.push('/' + page);
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedUserPdfFile(file);
      console.log("File selected:", file);

       // Read the data (example code, can delete later)
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // const pdfData = e.target.result; // This will be the PDF data (e.g., as a base64 string or ArrayBuffer)
          //  Now you can use this pdfData. For example, you can send it to backend for processing.
        }
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedUserPdfFile(null);
      setNewAlert(dispatch, { msg: "Invalid file type. Please upload a PDF.", alertType: "error" });
    }
  }

  const handleMp4FileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'video/mp4') { // Corrected MIME type check
      setSelectedMp4File(file);
      console.log("MP4 file selected:", file);
      // ... (Optional:  You might want to do something with the video file here)
    } else {
      setSelectedMp4File(null);
      console.error("Invalid file type. Please upload an MP4.");
       setNewAlert(dispatch, { msg: "Invalid file type. Please upload an MP4.", alertType: "error" });
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
              id="user-pdf-upload" // Important: Add an ID to the input element
              accept=".pdf" // Specify accepted file types
              style={{ display: 'none' }} // Hide the input element
              onChange={handleFileUpload}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => document.getElementById('user-pdf-upload')?.click()} // Trigger click on the hidden input
            >
              {selectedUserPdfFile ? selectedUserPdfFile.name : "Upload Notes (.pdf)"} {/* Display file name or default text */}
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
              id="mp4-upload" // Unique ID for MP4 input
              accept=".mp4" // or "video/mp4" (both should work)
              style={{ display: 'none' }}
              onChange={handleMp4FileUpload}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => document.getElementById('mp4-upload')?.click()}
            >
              {selectedMp4File ? selectedMp4File.name : "Upload Video (.mp4)"}
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