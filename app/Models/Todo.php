<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = ['title', 'completed', 'category_id'];

    // a todo belongs to a category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}