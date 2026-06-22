<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/posts',        [PostController::class, 'index']);
Route::get('/posts/{slug}', [PostController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',       [AuthController::class, 'logout']);
    Route::post('/posts',        [PostController::class, 'store']);
    Route::put('/posts/{id}',    [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
});  // <-- semicolon was missing
