<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryController extends Controller
{
    // what is with('todos)?
    // mern equivalency
    // Category.find().populate('todos')

    // laravel
    // Category::width('todos')->get()
    // /it loads all the todos that belong to each category in one query-called eager loading
    //GET /api/categories
    public function index()
    {
        return response()->json(Category::with('todos')->get(), 200);
    }

    // POST /api/categoires
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'sometimes|string',
        ]);
        // required = this field must be present in the request or else laravel will return an error like "The name field is required".

        // sometimes = only validate this field if it exists in the request
        // if the field is not present, ignore it and continue validating other fields normally.

        $category = Category::create($request->all());
        return response() -> json($category, 201);
        
    }

    public function destroy($id)
    {
        try {
            // findorfail() => Find the record and if it doesnot exist, automatically throw an error(404)
            $category = Category::findOrFail($id);
            $category->delete();
            return response()->json(['message' => 'Category deleted'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Category not found'], 404);
        }
    }
}
