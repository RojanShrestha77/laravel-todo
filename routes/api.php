use App\Http\Controllers\CommentController;

// public — fetch comments for a post
Route::get('/posts/{postId}/comments', [CommentController::class, 'index']);

// auth required — create and delete
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts/{postId}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}',         [CommentController::class, 'destroy']);
});
