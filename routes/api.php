<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/posts',       [PostController::class, 'index']);
Route::get('/posts/{id}',  [PostController::class, 'show']);

Route::get('/posts/{postId}/comments', [CommentController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/posts',        [PostController::class, 'store']);
    Route::put('/posts/{id}',    [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);

    Route::post('/posts/{postId}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}',         [CommentController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users',            [AdminController::class, 'users']);
    Route::delete('/users/{id}',    [AdminController::class, 'deleteUser']);
    Route::get('/posts',            [AdminController::class, 'posts']);
    Route::delete('/posts/{id}',    [AdminController::class, 'deletePost']);
    Route::get('/comments',         [AdminController::class, 'comments']);
    Route::delete('/comments/{id}', [AdminController::class, 'deleteComment']);
});
