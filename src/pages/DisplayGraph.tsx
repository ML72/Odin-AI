import 'katex/dist/katex.min.css';

import React, { useState, useEffect } from 'react';
import { Button, Grid, Container, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { GraphCanvas, lightTheme, nodeSizeProvider } from 'reagraph';
import { useHistory, useParams } from 'react-router';
import Latex from 'react-latex-next';

import CustomPage from '../components/CustomPage';
import { setNewAlert } from '../service/alert';

const DisplayGraph: React.FC = () => {
  const [nodes, setNodes] = useState<any>([]);
  const [edges, setEdges] = useState<any>([]);
  const [heading, setHeading] = useState<string>("Select a node to view details!");
  const [body, setBody] = useState<string>("Learn more about different topics and connections between topics by selecting nodes or edges.");
  const dispatch = useDispatch();
  const history = useHistory();
  const params: any = useParams();

  const alertHandler = () => {
    setNewAlert(dispatch, { msg: "Hello world!" });
  }

  const changePage = (page: string) => {
    history.push('/' + page);
  }

  // DEMO CODE TO SEE IF IT WORKS
  useEffect(() => {
    setNodes(
      [
        {
            id: '1',
            label: '1',
            sublabel: "xxx yyy"
          },
          {
            id: '2',
            label: '2'
          }
      ]);
    
    setEdges([
      {
        source: '1',
        target: '2',
        id: '1-2',
        label: '1-2'
      },
      {
        source: '2',
        target: '1',
        id: '2-1',
        label: '2-1'
      }
    ]);
      
  }, []);

  // Define graph theme
  const THEME_COLOR = '#9674FF';
  const graphTheme = {
    ...lightTheme,
    canvas: {
      background: '#F5F5F5',
      fog: '#F5F5F5'
    },
    node: {
      ...lightTheme.node,
      fill: THEME_COLOR,
      activeFill: '#BBD0FF',
      label: {
        color: THEME_COLOR,
        activeColor: '#BBD0FF',
      },
    },
    edge: {
      ...lightTheme.edge,
      fill: '#C3B1FA',
      activeFill: '#BBD0FF',
    },
    arrow: {
      ...lightTheme.arrow,
      fill: '#C3B1FA',
      activeFill: '#BBD0FF',
    }
  };
  
  return (
    <CustomPage>
      <Container background="red" sx={{ my: 3 }}>
        <Typography variant="h3" sx={{
          mt: 3,
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #E2C1FA, #C3B1FA, #B6CBFA)',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          Knowledge Graph
        </Typography>

        <Grid container sx={{ mt: 1 }}>
          <Grid item xs={8}>
            <Box sx={{
              position: 'absolute',
              width: window.innerWidth < 1000 ? '60%' :
                (
                  window.innerWidth < 1450 ? '50%' :
                    (
                      window.innerWidth < 1600 ? '45%' :
                        '40%'
                    )
                ),
              height: '80%'
            }}>
              <GraphCanvas
                nodes={nodes}
                edges={edges}
                theme={graphTheme}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            {/* Display node details */}
            <Typography variant="h5">
              {heading}
            </Typography>
            <Typography variant="body1">
              <Latex>
                {body}
              </Latex>
            </Typography>

            {/* Buttons */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
              <Grid item xs={6}>
                <Button variant="contained" color='primary' fullWidth onClick={() => changePage('display/' + params.id + '/stats')}>
                  View Analytics
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color='primary' fullWidth onClick={() => changePage('')}>
                  Home
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

      </Container>
    </CustomPage>
  )
};

export default DisplayGraph;