import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Comment } from '../../types';
import api from '../../api/axios';

interface CommentState {
    comments: Record<number, Comment[]>;  //keted by post id
    loading: boolean;
}

const initialState: CommentState = {comments: {}, loading: false};

export const fetchComments = createAsyncThunk('comments/fetch', 
    async (postId: number) => {
        const res = await api.get('/posts/${postId}/comments');
        return {postId, comments:res.data.data as Comment[]};

    }
);

export const createComment = createAsyncThunk('comments/create',
    async ({ postId, body, is_private }: { postId: number; body: string; is_private: boolean }) => {
        const res = await api.post(`/posts/${postId}/comments`, { body, is_private });
        return { postId, comment: res.data.data as Comment };
    }
);

export const deleteComment = createAsyncThunk('comments/delete', 
    async ({postId, commentId}: {postId: number, commentId: number}) => {
        await api.delete(`/comments/${commentId}`);
        return {postId, commentId};
    }
);

const commentSlice = createSlice ({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchComments.fulfilled, (state, action) => {
            state.comments[action.payload.postId] = action.payload.comments;
        })
        .addCase(createComment.fulfilled, (state, action) => {
            const { postId, comment} = action.payload;
            if (!state.comments[postId]) state.comments[postId] = [];
            state.comments[postId].unshift(comment);
        })
        .addCase(deleteComment.fulfilled, (state, action) => {
            const { postId, commentId} = action.payload;
            state.comments[postId] = state.comments[postId].filter(c => c.id !== commentId);
        });
    }
});

export const selectComments = (postId: number) => 
    (state: {comments: CommentState}) => state.comments.comments[postId] ?? [];

export default commentSlice.reducer;
    