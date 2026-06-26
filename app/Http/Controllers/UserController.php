<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email'=> 'sometimes|string|email|max:255|unique:users,email,'.$request->user()->id,
        ]);

        $request->user()->update($request->only('name', 'email'));

        return response()->json($request->user());
    }

    public function uploadAvatar(Request $request)
    {
        request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $path = $request->file('avatar')->store('avatars', 'public'); // saves the file as 'avatars
        // stores it inside public
        //$request->file('avatar) = get the uploaded file whose input name is avatar
        // store ('avatars), 'public' -> saves this uploaded file inside the avatars folder on the public disk

        $request->user()->update(['profile_picture' => $path]);

        return response()->json([
            'profile_picture' => asset('storage/'. $path),
        ]);
    }
}