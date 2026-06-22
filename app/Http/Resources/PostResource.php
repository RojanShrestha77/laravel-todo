<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'title'      => $this->title,
            'slug'       => $this->slug,
            'body'       => $this->body,
            'author'     => $this->user->name,  // NOT $this->author
            'created_at' => $this->created_at->toDateString(),
        ];  // <-- semicolon was missing
    }
}
