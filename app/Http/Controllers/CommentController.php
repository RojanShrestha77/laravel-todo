<?php
namespace App\Http\Controllers;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Resources\CommentResource;

class CommentController extends Controller
{
    // Get /api/posts/{post}/comments
    public function index(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);

        $query = $post->comments()->with('user');

        // if logged in AND is the post author -> show all comments
        // otherwise show only the public comments
        $isAuthor = $request->user() && $request->user()->id === $post->user_id;

        if(!$isAuthor) {
            $query->where('is_private', false);
        }

        return CommentResource::collection($query->latest()->get());

    }

    // POST /api/posts/{post}/comments
    public function store(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);

        $request->validate([
            'body'  =>'required|string|max:1000',
            'is_private' =>'boolean',
        ]);

        $comment = Comment::create([
            'post_id'   =>$post->id,
            'user_id'   =>$request->user()->id,
            'body'      =>$request->body,
            'is_private' =>$request->is_private ?? false,

        ]);

        return new CommentResource($comment->load('user'));
    }

    // DELETE /api/comments/{id}
    public function destroy(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // only the comment author or post author can delete
        $isCommentAuthor = $request->user()->id === $comment->user_id;
        $isPostAuthor = $request->user()->id === $comment->post->user_id;

        if(!$isCommentAuthor && !$isPostAuthor) {
            return response()->json(['message' => 'unauthorized'], 403);
        }

        $comment->delete();
        return response()->json(['message' => 'Comment delete']);
    }
}