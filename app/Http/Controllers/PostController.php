<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Resources\PostResource;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index() //this get all posts api
    {
        $posts = Post::with('user')->latest()->paginate(10);
        return PostResource::collection($posts);

    }  

    public function show($slug)
    {
        $post = Post::with('user')->where('slug', $slug)->firstOrFail();
        return new PostResource($post);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',

        ]);

        $post = $request->user()->posts()->create([
            'title' => $request->title,
            'slug' => Str::slug($request->title).'-'.uniqid(),
            'body' => $request->body,
        ]);

        return new PostResource($post->load('user'));
    }

    public function update(Request $request, $id)
    {
        $post = $request->user()->posts()->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
        ]);

        $post -> update($request->only('title', 'body'));
        return new PostResource($post->load('user'));
    }

    public function destroy(Request $request, $id)
    {
        $post = $request->user()->posts()->findOrFail($id);
        $post->delete();
        return response()->json(['message' =>'Post deleted']);
    }

}