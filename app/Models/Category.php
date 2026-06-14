<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'color'];

    // a category has many todos
    public function todos()
    {
        return $this->hasMany(Todo::class);
    }
}