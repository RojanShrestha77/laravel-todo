<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Http\Resources\TodoResource;
use Illuminate\Support\Facades\Cache;

class TodoController extends Controller
{
    private function clearTodoCache(int $userId): void
    {
        Cache::tags(["todos.user.{$userId}"])->flush();
    }
    // GET /api/todos - get all todos
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $page = $request->get('page', 1);
        $sort = $request->get('sort', 'desc');
        $search = $request->get('search', '');
        $completed = $request->get('completed', '');

        // unique cache key per user + filters
        $cacheKey = "todos.user.{$userId}.page.{$page}.sort.{$sort}.search.{$search}.completed.{$completed}";

        $todos = Cache::tags(["todos.user.{$userId}"])->remember($cacheKey, now()->addMinutes(5), function () use($request) {
            $query = $request->user()->todos();

            if($request->has('completed')) {
                $query->where('completed', filter_var($request->completed, FILTER_VALIDATE_BOOLEAN));
            }

            if($request->has('search')) {
                $query->where('title', 'like', '%'.$request->search. '%');
            }

            $query->orderBy('created_at', $request->get('sort', 'desc'));

            return $query->paginate(5);
        });
        return TodoResource::collection($todos);
    }

    // GET /api/todos/{id} - get single todo
    public function show(Request $request, $id)
    {
        try {
            $todo = $request->user()->todos()->findOrFail($id);
            return new TodoResource($todo);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Todo not found'], 404);
        }
    }

    // POST /api/todos - create a todo
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        // $todo = Todo::create($request->all());
        $todo = $request->user()->todos()->create($request->all());
        $this->clearTodoCache($request->user()->id);
        return new TodoResource($todo);
    }

    // PUT /api/todos/{id} - update a todo
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'title'     => 'sometimes|string|max:255',
                'completed' => 'sometimes|boolean',
            ]);

            // $todo = Todo::findOrFail($id);
            $todo = $request->user()->todos()->findOrFail($id);    //finds todo by id but only within the users todos
            $todo->update($request->all());
            $this->clearTodoCache($request->user()->id);
            return new TodoResource($todo);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Todo not found'], 404);
        }
    }

    // DELETE /api/todos/{id} - delete a todo
    public function destroy(Request $request, $id)
    {
        try {
            $todo = $request->user()->todos()->findOrFail($id);
            $todo->delete();
            $this->clearTodoCache($request->user()->id); 
            return response()->json(['message' => 'Todo deleted'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Todo not found'], 404);
        }
    }
}