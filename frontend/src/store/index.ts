import { configureStore } from '@reduxjs/toolkit';
import githubReducer from './slices/githubSlice';
import portifolioReducer from './slices/portifolioSlice';

const store = configureStore({
  reducer: {
    github: githubReducer,
    portifolio: portifolioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
