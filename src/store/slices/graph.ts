import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
    history: []
};

export const graphSlice = createSlice({
    name: 'graph',
    initialState,
    reducers: {
        addGraph: (state, action) => {
            let { id, name, graph, stats } = action.payload; // name is effectually ID, should be unique
            state.history.push({ id, name, graph, stats });
        },
        removeGraph: (state, action) => {
            let { id } = action.payload;
            state.history = state.history.filter((graph: any) => graph.id != id);
        }
    }
});

export const { addGraph, removeGraph } = graphSlice.actions;

export const selectGraphHistoryState = (state: any) => state.graph.history;

export default graphSlice.reducer;