import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import localforage from 'localforage';
import { dataFormulatorReducer } from './dfSlice';

export type AppDispatch = typeof store.dispatch;

const persistConfig = {
  key: 'root',
  storage: localforage,
};

const persistedReducer = persistReducer(persistConfig, dataFormulatorReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;