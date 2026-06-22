import { configureStore } from '@reduxjs/toolkit';
import postReducer from './slices/postSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        posts: postReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
