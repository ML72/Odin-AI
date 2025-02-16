import { v4 as uuidv4 } from 'uuid';
import { addAlert, removeAlert } from '../store/slices/ui';
import { addGraph, removeGraph } from '../store/slices/graph';
import { Graph } from './graphs/graph';

export const setNewAlert = (
    dispatch: any,
    { msg, alertType = 'success', timeout = 5000 }: { msg: string, alertType?: string, timeout?: number }
) => {

    const id = uuidv4();
    dispatch(addAlert({
        msg, alertType, id
    }));

    setTimeout(() => {
        dispatch(removeAlert({ id }));
    }, timeout);
}

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

// Removes a graph from history
export const deleteGraph = (
    dispatch: any,
    { id } : { id: string }
) => {
    
    dispatch(removeGraph({ id }));
    setNewAlert(dispatch, { msg: "Graph " + id + " has been deleted!", alertType: "success" });
}
