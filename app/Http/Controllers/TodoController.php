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
    }  #returns all the todos

    public function show($id)
    {
        try {
            $todo = Todo::findOrFail($id);
            return response() ->json($todo, 200);
        } catch (ModelNotFoundException $e) {
            return response() -> json(['message' => 'Todo not found'], 404);
        }
    } #returns only the todo that matches the id

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
        try {
            $request->validate([
                'title' => 'sometimes|string|max:255',  #sometimes means : Only validate this field if it is present in the request
                'completed' => 'sometimes|boolean',
            ]);
    
            $todo = Todo::findOrFail($id);
            $todo->update($request->all());
            return response() ->json($todo, 200);
        }     catch(ModelNotFoundException $e) {
            return response()->json(['message' => 'Todo not found'], 404)
        }
        
    }

    // Delete /todos/{id} - delete a todo
    public function destroy($id)
    {
        try {

            $todo = Todo::findOrFail($id);
            $todo->delete();
            return response()->json(['message' => 'Todo deleted'], 200);
        } catch (ModelNotFoundException $e) {
            return response() -> json(['message' => 'Todo not found'], 404)
        }
    }

}
