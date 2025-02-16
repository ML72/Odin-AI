import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import { uiSlice } from "./slices/ui";
import { graphSlice } from './slices/graph';

const combinedReducer = combineReducers({
    [uiSlice.name]: uiSlice.reducer,
    [graphSlice.name]: graphSlice.reducer
});

const persistConfig = {
  key: 'odinx-ai-root',
  whitelist: [graphSlice.name],
  storage
}
const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: [thunk]
});

export const persistor = persistStore(store);
