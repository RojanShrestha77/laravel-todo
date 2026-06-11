<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    // GET / TODOS - GET ALL TODOS
    public function index()
    {
        return Todo::all();
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
        $todo = Todo::findOrFail($id);
        $todo->update($request->all());
        return $todo;
    }

    // Delete /todos/{id} - delete a todo
    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();
        return response()->json(['message' => 'Todo deleted']);
    }

}
