import React from 'react';
import {
  Button,
  Grid,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import CustomPage from '../components/CustomPage';
import { selectGraphHistoryState } from '../store/slices/graph';
import { setNewAlert, deleteGraph } from '../service/redux';



function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];


const History: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let allGraphs = useSelector(selectGraphHistoryState);

  // Utility functions
  const alertHandler = () => {
    setNewAlert(dispatch, { msg: "Hello world!" });
  }

  const changePage = (page: string) => {
    history.push('/' + page);
  }

  // Utility functions
  const handleDeleteGraph = (id: string) => {
    deleteGraph(dispatch, { id });
    allGraphs = allGraphs.filter((graph: any) => graph.id != id);
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
          My Past Notes
        </Typography>

        {/* Display all past notes */}
        {allGraphs.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ borderBottom: 1.5 }}>
                  <TableCell><strong>Graph Name</strong></TableCell>
                  <TableCell align="right"><strong>Num Nodes</strong></TableCell>
                  <TableCell align="right"><strong>Num Edges</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allGraphs.map((graph: any) => (
                  <TableRow
                    key={graph.id}
                    sx={{
                      borderBottom: 1.5,
                      borderTop: 1.5,
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {graph.name}
                    </TableCell>
                    <TableCell align="right">{graph.graph.nodes.length}</TableCell>
                    <TableCell align="right">{graph.graph.edges.length}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" color="primary" sx={{ width: "80px", mr: 1 }} onClick={() => changePage('display/' + graph.id + '/graph')}>
                        View
                      </Button>
                      <Button variant="outlined" color="error" sx={{ width: "80px" }} onClick={() => handleDeleteGraph(graph.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h5" sx={{ mt: 4 }}>
            No past notes found, upload some to get started!
          </Typography>
        )}

        {/* Bottom button section */}

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth onClick={() => changePage('upload')}>
              Upload New Materials
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

export default History;