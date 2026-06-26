import api from "./axios";

export const getUsers    = ()           => api.get('/admin/users');
export const deleteUser  = (id: number) => api.delete(`/admin/users/${id}`);

export const getPosts    = ()           => api.get('/admin/posts');
export const deletePost  = (id: number) => api.delete(`/admin/posts/${id}`);

export const getComments   = ()           => api.get('/admin/comments');
export const deleteComment = (id: number) => api.delete(`/admin/comments/${id}`);
