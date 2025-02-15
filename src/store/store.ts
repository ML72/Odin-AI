import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import { uiSlice } from "./slices/ui";

const combinedReducer = combineReducers({
    [uiSlice.name]: uiSlice.reducer
});

const persistConfig = {
  key: 'template-app-root',
  whitelist: [],
  storage
}
const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: [thunk]
});

export const persistor = persistStore(store);