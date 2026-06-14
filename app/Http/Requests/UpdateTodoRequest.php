<?php

namespace App\Http\Requests;

use Illuminate\Fondation\Http\FormRequest;

class UpdateTodoRequest extends FormRequest
{
    public function authorize(): boolval
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' =>'sometimes|string|max:255',    //sometimes means only validate this field if it is present in the request
            'completed' => 'sometimes|boolean',
        ];
    }
}