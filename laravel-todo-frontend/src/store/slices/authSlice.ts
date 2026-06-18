import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

interface AuthState {
    user: User | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        //  action: setCredentials
        // payload: { user, token}
        setCredentials: (state, action: PayloadAction<{ user: User; token: string}>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        },
        // action: clearCredentials
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },

    }
});

export const { setCredentials, clearCredentials} = authSlice.actions;

//selectores = functions that pickl a piece of state
export const selectUser = (state: { auth: AuthState}) => state.auth.user;
export const selectToken = (state: {auth: AuthState}) => state.auth.token;

export default authSlice.reducer;