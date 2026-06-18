import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Todo } from "../../types";
import api from "../../api/axios";

interface TodoState {
    todos: Todo[];
    loading:boolean;
    error: string | null;
}

const initialState: TodoState = {
    todos: [],
    loading: false,
    error: null,
};

// createAsyncThunk = handles async API Calls
// it automatically creates 3 actions: pending. fulffilled.rejected

export const fetchTodos = createAsyncThunk('todos/fetch', async () => {
    const res = await api.get('/todos');
    return res.data.data as Todo[];
    
});

export const createTodo = createAsyncThunk('todos/create', async (title: string) => {
    const res = await api.post('/todos', { title })
    return res.data.data as Todo;
});

export const updateTodo = createAsyncThunk('todos/update', async (todo: Todo) => {
    const res = await api.put(`/todos/${todo.id}`, todo);
    return res.data.data as Todo;
});

export const deleteTodo = createAsyncThunk('todos/delete', async (id: number) => {
    await api.delete(`/todos/${id}`);
    return id;   //return the id so we can remove it from state
})

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // fetchTodos
        builder.addCase(fetchTodos.pending, (state) => {
            state.loading = true,
            state.error = null;
        })
        .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
            state.loading = false,
            state.todos = action.payload;
        })
        .addCase(fetchTodos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message ?? 'Failed to fetch todos';
        })

        // createTodo
        builder.addCase(
            createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
                state.todos.unshift(action.payload); //add to top of the list
            }
        )

        // update todo
        builder.addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
            const index = state.todos.findIndex(t => t.id === action.payload.id);
            if (index !== -1) state.todos[index] = action.payload; //replace in place
        })

    }
});

// selectores 
export const selectTodos = (state: {todos: TodoState}) => state.todos.todos;
export const selectTodosLoading = (state: {todos: TodoState}) => state.todos.loading;
export const selectTodosError = (state: {todos: TodoState}) => state.todos.error;

export default todoSlice.reducer;