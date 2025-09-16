<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        return response()->json(Post::orderBy('created_at','desc')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        $post = Post::create($validated);

        return response()->json($post, 201);
    }

    public function show($id)
    {
        $post = Post::find($id);
        if (!$post) return response()->json(['message' => 'Not Found'], 404);
        return response()->json($post, 200);
    }

    public function update(Request $request, $id)
    {
        $post = Post::find($id);
        if (!$post) return response()->json(['message' => 'Not Found'], 404);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        $post->update($validated);
        return response()->json($post, 200);
    }

    public function destroy($id)
    {
        $post = Post::find($id);
        if (!$post) return response()->json(['message' => 'Not Found'], 404);
        $post->delete();
        return response()->json(null, 204);
    }
}
