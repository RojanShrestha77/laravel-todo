<?php
namespace App\Http\Resource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array{
        return [
            'id'   =>$this->id,
            'body' =>$this->body,
            'is_private'=>$this->is_private,
            'author'=>$this->user->name,
            'user_id'=>$this->user_id,
            'created_at'=>$this->created_at->toDateString(),
          ];
    }
}