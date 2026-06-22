import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../../types";
import api from "../../api/axios";

interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostState = { posts: [], loading: false, error: null};

// createAsyncThunk is mainly used to handle loading success, and error states for async actions (like API Calls).
export const fetchPosts = createAsyncThunk('posts/fetchAll', async () => {
    const res = await api.get('/posts');
    return res.data.data as Post[];
});

export const createPost = createAsyncThunk('posts/create', async (postData: { title: string; body: string }) => {
    const res = await api.post('/posts', postData);
    return res.data.data as Post;
});

export const updatePost = createAsyncThunk('posts/update',
    async ({id, data}: {id: number; data: {title?: string; body?: string}}) => {
        const res = await api.put(`/posts/${id}`, data);
        return res.data.data as Post;
    }
);

export const deletePost = createAsyncThunk('posts/delete', async (id: number) => {
    await api.delete(`/posts/${id}`);
    return id;
});

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state,action) => {
                state.loading = false,
                state.error = action.error.message ?? 'Failed';
            })
            .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
                state.posts.unshift(action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action:PayloadAction<Post>) => {
                const i = state.posts.findIndex(p=>p.id === action.payload.id);
                if (i !== -1) state.posts[i] = action.payload; 
            })
            .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
                state.posts = state.posts.filter(p=>p.id !== action.payload);

            });
            
    },
});

export const selectPosts = (state: { posts: PostState}) => state.posts.posts;
export const selectPostLoading = (state: { posts: PostState}) => state.posts.loading;

export default postSlice.reducer;
