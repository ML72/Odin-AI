import 'katex/dist/katex.min.css';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Grid, Container, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { GraphCanvas, GraphCanvasRef, lightTheme, nodeSizeProvider, useSelection } from 'reagraph';
import { useHistory, useParams } from 'react-router';
import { selectGraphHistoryState } from '../store/slices/graph';
import { chain_pipeline, gen_question, update_graph_weights } from '../service/external/quiz_gen';
import Latex from 'react-latex-next';

import CustomPage from '../components/CustomPage';
import { setNewAlert } from '../service/redux';
import { Graph, N, Edge } from '../service/graphs/graph';

const DisplayGraph: React.FC = () => {
  const [nodes, setNodes] = useState<any>([]);
  const [edges, setEdges] = useState<any>([]);
  const [adjNodes, setAdjNodes] = useState<any>([]);
  const [heading, setHeading] = useState<string>("Select a node to view details!");
  const [body, setBody] = useState<string>("Learn more about different topics and connections between topics by selecting nodes or edges.");
  const [question, setQuestion] = useState<{ question: string, answer: string, difficulty: number, answerShown: boolean } | null>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const params: any = useParams();
  const fudge = 5;
  const edgeFudge = 3;
  const edgeThreshold = 37.5;

  // Utility functions
  const changePage = (page: string) => {
    history.push('/' + page);
  }

  const normalizeEdgeWeights = (edges: Edge[]) => {
    let max = 0;
    for (let edge of edges) {
      if (edge.weight > max) {
        max = edge.weight;
      }
    }

    for (let edge of edges) {
      edge.weight = edge.weight / max;
      if (edge.weight * edgeFudge >= edgeThreshold) {
        edge.weight = edgeThreshold;
      } else {
        edge.weight = Math.log(edge.weight + 1);
        edge.weight *= edgeFudge;
      }
    }
  }

  const handleGenerateQuestion = async (graph: Graph) => {

    const result = chain_pipeline(graph);

    if (result) {
      const { chain_list, chains } = result;
      const next_q = await gen_question(chain_list[0], chains[0]);
      setNewAlert(dispatch, { msg: "Generating personalized question...", alertType: "info" });

      update_graph_weights(chains[0], graph, next_q['difficulty']);
      console.log(next_q);
      setQuestion({
        ...next_q,
        answerShown: false
      });
    } else {
      setNewAlert(dispatch, { msg: "Failed to generate question, graph is too small", alertType: "error" });
    }
  };

  const normalizeNodeWeights = (nodes: N[]) => {
    let max = 0;
    for (let node of nodes) {
      if (node.weight > max) {
        max = node.weight;
      }
    }

    for (let node of nodes) {
      node.weight = node.weight / max;
      node.weight *= fudge;
    }
  }

  const generateGraph = (graph: Graph) => {
    // Based on the type of edge that occurs the most as an outgoing edge from a node
    // color the node accordingly
    let outgoingEdges = new Map<number, [number, number]>();
    for (let edge of graph.edges) {
      if (!outgoingEdges.has(edge.from.id)) {
        outgoingEdges.set(edge.from.id, [0, 0]);
      } 
      if (!outgoingEdges.has(edge.to.id)) {
        outgoingEdges.set(edge.to.id, [0, 0]);
      }
      if (edge.ground_truth) {
        outgoingEdges.get(edge.from.id)![0]++;
      } else {
        outgoingEdges.get(edge.from.id)![1]++;
      }
      if (edge.ground_truth) {
        outgoingEdges.get(edge.to.id)![0]++;
      } else {
        outgoingEdges.get(edge.to.id)![1]++;
      }
    }

    for (let node of graph.nodes) {
      if (!outgoingEdges.has(node.id)) {
        console.log(outgoingEdges.get(node.id)![0]);
      }
    }

    // Generate nodes
    let nodeData = [];
    for (let node of graph.nodes) {
      let fillColor = '#9674FF'; // Default color
      const outgoingCount = outgoingEdges.get(node.id) ? outgoingEdges.get(node.id)![0] : 0;
      let totalEdges = outgoingEdges.get(node.id) ? outgoingEdges.get(node.id)![1] : 1; // Avoid division by zero
      totalEdges += outgoingCount;

      // Calculate the ratio of outgoing edges
      const ratio = Math.min(outgoingCount / totalEdges, 1); // Ensure ratio is between 0 and 1

      // Interpolate between the two colors
      const interpolateColor = (startColor: string, endColor: string, ratio: number) => {
          const start = parseInt(startColor.slice(1), 16);
          const end = parseInt(endColor.slice(1), 16);
          const r = Math.round(((start >> 16) * (1 - ratio)) + ((end >> 16) * ratio));
          const g = Math.round((((start >> 8) & 0x00FF) * (1 - ratio)) + (((end >> 8) & 0x00FF) * ratio));
          const b = Math.round(((start & 0x0000FF) * (1 - ratio)) + ((end & 0x0000FF) * ratio));
          return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
      };

      fillColor = interpolateColor('#9674FF', '#FF5972', ratio);

      console.log(fillColor);
      let newNode = {
        id: node.id.toString(),
        label: node.title,
        body: node.body,
        size: node.weight,
        fill: fillColor
      };
      nodeData.push(newNode);
    }

    // Generate edges
    let edgeData = [];
    for (let edge of graph.edges) {
      let newEdge = {
        source: edge.from.id.toString(),
        target: edge.to.id.toString(),
        id: edge.from.id.toString() + '-' + edge.to.id.toString(),
        label: edge.connection,
        size: edge.weight 
      };
      edgeData.push(newEdge);
    }
    setNodes(nodeData);
    setEdges(edgeData);
  }

  
  const allGraphs = useSelector(selectGraphHistoryState);
  const graph = allGraphs.find((graph: any) => graph.id == params.id);
  if (!graph) {
    setNewAlert(dispatch, { msg: "Graph " + params.id + " not found!", alertType: "error" });
    history.push('');
  }

  const graphRef = useRef<GraphCanvasRef | null>(null);

  // Generate graph once component is mounted
  useEffect(() => {
    normalizeEdgeWeights(graph.graph.edges);
    normalizeNodeWeights(graph.graph.nodes);
    generateGraph(graph.graph);      
  }, []);

  const onClickNode = (node: any) => {
    setHeading(node.label);
    setBody(node.body);
    setAdjNodes(edges.filter(
      (edge: any) => edge.source === node.id || edge.target === node.id
    ).map((edge: any) => {
      const otherNodeId = edge.source === node.id ? edge.target : edge.source;
      return {
        toOrFrom: edge.source === node.id ? 'to' : 'from',
        targetLabel: nodes.find((node: any) => node.id === otherNodeId)?.label,
        label: edge.label
      };
    }));
    graphRef.current?.fitNodesInView([node.id]);
  }

  const onClickEdge = (edge: any) => {
    setHeading(edge.title);
    setBody(edge.label);
  }

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
      activeFill: '#90EE90',
      label: {
        color: THEME_COLOR,
        activeColor: '#9674FF',
      },
    },
    edge: {
      ...lightTheme.edge,
      fill: '#C3B1FA',
      activeFill: '#BBD0FF',
    },
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
          {graph.name.substring(0, graph.name.indexOf("."))}
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
                edgeArrowPosition="none" 
                nodes={nodes}
                edges={edges}
                theme={graphTheme}
                onNodeClick={onClickNode}
                onEdgeClick={onClickEdge}
                ref={graphRef}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            {/* Display node details */}
            <Typography variant="h5">
              <strong>{heading}</strong>
            </Typography>
            <Typography variant="body1">
              <Latex>
                {body}
              </Latex>
            </Typography>

            {adjNodes.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1"><strong>Connections</strong></Typography>
                <ul>
                  {adjNodes.map((adjNode: any, index: number) => (
                    <li key={index}><Typography key={index} variant="body2">
                      <em>{adjNode.targetLabel}</em> ({adjNode.toOrFrom}) &rarr; {adjNode.label} 
                    </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            {/* Buttons */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
              <Grid item xs={6}>
                <Button variant="contained" color='primary' fullWidth onClick={() => handleGenerateQuestion(graph.graph)}>
                  Generate Question
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color='primary' fullWidth onClick={() => changePage('')}>
                  Home
                </Button>
              </Grid>
            </Grid>

            {/* Display generated question */}
            {question && (
              <Box sx={{ mt: 5, mb: 4 }}>
                <Typography variant="h5"><strong>Personalized Quiz Question</strong></Typography>
                <Typography variant="body1"><strong>Question:</strong> {question.question}</Typography>
                {question.answerShown && <Typography variant="body1"><strong>Answer:</strong> {question.answer}</Typography>}
                <Button variant="outlined" color='primary' sx={{ mt: 1 }} onClick={() => setQuestion({ ...question, answerShown: !question.answerShown })}>
                  {question.answerShown ? "Hide Answer" : "Show Answer"}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </CustomPage>
  )
};

export default DisplayGraph;
