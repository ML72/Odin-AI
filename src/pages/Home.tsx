import React from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  CssBaseline,
  Box,
  Stack,
  Link,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import { useHistory } from 'react-router';

import CustomPage from '../components/CustomPage';

const cards = [
  {
    title: "Identify Gaps",
    content: "Pinpoint missing topics in your notes by comparing your knowledge graph against lecture content.",
    thumbnail: "img/undraw_search-app_cpm0.svg",
  },
  {
    title: "Visualize Knowledge",
    content: "Transform abstract concepts into interactive knowledge graphs, providing a clear overview of relationships and themes.",
    thumbnail: "img/undraw_analytics_6mru.svg",
  },
  {
    title: "Personalize Quizzes",
    content: "Generate custom quizzes tailored to your specific knowledge gaps and learning style, optimizing your study efficiency",
    thumbnail: "img/undraw_mobile-content_yz21.svg",
  }
];

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
      <CssBaseline />
      <main>
        <Container maxWidth="sm" align="center" sx={{ my: 5 }}>
          <Box
            component="img"
            sx={{
              width: "40%",
              my: 3
            }}
            src="logo.svg"
            className="rotating-svg"
          />
          <Typography
            sx={{ pt: 2 }}
            component="h1"
            variant="h3"
            fontWeight="fontWeightMedium"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Welcome to {" "}
            <Box color="primary.main" display="inline">
              Odin AI
            </Box>
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            sx={{ pt: 1 }}
            paragraph
          >
            Unlock your learning potential with our revolutionary note-taking and lecture-analyzing approach.
          </Typography>
          <Stack
            sx={{ pt: 3 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button variant="contained" size="large" fullWidth onClick={clickUpload}>
              Upload New Materials
            </Button>
            <Button variant="outlined" size="large" fullWidth onClick={clickHistory}>
              View Past Notes
            </Button>
          </Stack>
        </Container>
        <Container sx={{ py: 7 }} maxWidth="lg">
          <Typography
            sx={{ pb: 4 }}
            component="h2"
            variant="h5"
            fontWeight="fontWeightMedium"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Transform
            {" "}<Box color="primary.main" display="inline">
              raw notes and recordings
            </Box>{" "}
            into
            {" "}<Box color="primary.main" display="inline">
              interconnected knowledge graphs
            </Box>
            , revealing key themes and identifying gaps in your understanding.
          </Typography>
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.title} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0"
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      pb: "10%",
                      pt: "2%",
                      px: "20%"
                    }}
                    image={card.thumbnail}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      fontWeight="fontWeightMedium"
                    >
                      {card.title}
                    </Typography>
                    <Typography>{card.content}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </CustomPage>
  )
};

export default Home;