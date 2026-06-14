<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\CategoryController;

Route::apiResource('todos', TodoController::class);
Route::apiResource('categories', CategoryController::class);