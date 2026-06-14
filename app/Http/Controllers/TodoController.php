<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Http\Resources\TodoResource;

class TodoController extends Controller
{
    // GET /api/todos - get all todos
    public function index(Request $request)
    {
        $query = Todo::query();

        // filter by completed status
        // Get/api/todos?completed=true
        if($request -> has ('completed')) {
            $query->where('completed', filter_var($request->completed, FILTER_VALIDATE_BOOLEAN));
        }

        // filter by title search
        // GET /api/todos?search=laravel
        if($request->has('search')) {
            $query->where('title', 'like', '%'. $request->search . '%');
        }

        // sort by created_at : Get/api/todos?sort=arc
        $sort = $request->get('sort', 'desc');
        $query->orderBy('created_at', $sort);
        
        

        return TodoResource::collection($query->paginate(5));
    }

    // GET /api/todos/{id} - get single todo
    public function show($id)
    {
        try {
            $todo = Todo::findOrFail($id);
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

        $todo = Todo::create($request->all());
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

            $todo = Todo::findOrFail($id);
            $todo->update($request->all());
            return new TodoResource($todo);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Todo not found'], 404);
        }
    }

    // DELETE /api/todos/{id} - delete a todo
    public function destroy($id)
    {
        try {
            $todo = Todo::findOrFail($id);
            $todo->delete();
            return response()->json(['message' => 'Todo deleted'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Todo not found'], 404);
        }
    }
}