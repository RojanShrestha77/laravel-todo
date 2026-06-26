<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users()
    {
        return response()->json(User::select('id', 'name', 'email', 'role', 'created_at')->get());

    }  //select the specified columns from teh users table and return to the user(frontend)

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete admin'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'User delete']);
    }

    public function posts()
    {
        $posts = Post::with('user')->latest()->get()->map(fn($p) => [
            'id' => $p->id,
            'title' => $p->title,
            'slug'  => $p->slug,
            'author' => $p->user->name,
            'created_at' => $p->created_at->toDateString(),

        ]); //with return the post with the user related to it
        return response() -> json($posts);
    }

    public function deletePost($id)
    {
        Post::findOrFail($id)->delete();
        return response()->json(['message' => 'Post delete']);
    }
    
    public function comments()
    {
        $comments = Comment::with(['user', 'post'])->latest()->get()->map(fn($c)=>[
            'id'         => $c->id,
            'body'       => $c->body,
            'is_private' => $c->is_private,
            'author'     => $c->user->name,
            'post_title' => $c->post->title,
            'created_at' => $c->created_at->toDateString(),
        ]);
        return response()->json($comments);
    }

    public function deleteComment($id)
    {
        Comment::findOrFail($id)->delete();
        return response()->json(['message' => 'Comment delete']);
    }
}
