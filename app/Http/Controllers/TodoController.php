<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    // GET / TODOS - GET ALL TODOS
    public function index()
    {
        return response()->json(Todo::all(), 200);
    }

    // POST/ todos - create a todo
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $todo = Todo::create($request->all());
        return $todo;
    }

    // PUT /todos/{id} - update a todo
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',  #sometimes means : Only validate this field if it is present in the request
            'completed' => 'sometimes|boolean',
        ]);

        $todo = Todo::findOrFail($id);
        $todo->update($request->all());
        return $todo;
    }

    // Delete /todos/{id} - delete a todo
    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();
        return response()->json(['message' => 'Todo deleted'], 200);
    }

}
