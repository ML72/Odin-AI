import { v4 as uuidv4 } from 'uuid';
import { addGraph, removeGraph } from '../store/slices/graph';
import { Graph } from './graphs/graph';

// Adds a new graph to history
// Returns ID of the new graph
export const addNewGraph = (
    dispatch: any,
    { name, graph, stats }: { name: string, graph: Graph, stats: any }
) => {

    const id = uuidv4();
    dispatch(addGraph({
        id, name, graph, stats
    }));

    return id;
}
