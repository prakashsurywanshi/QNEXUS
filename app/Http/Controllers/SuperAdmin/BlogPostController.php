<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    use EnsuresUniqueSlug;

    public function index(): Response
    {
        return Inertia::render('superadmin/blog/posts/index', [
            'posts' => BlogPost::orderByDesc('published_at')->orderByDesc('id')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('superadmin/blog/posts/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePost($request);

        $data['slug'] = $this->resolveSlug(BlogPost::class, (string) ($data['slug'] ?? $data['title']));

        BlogPost::create($data);

        return redirect()->route('superadmin.blog.posts.index')->with('toast', [
            'type' => 'success',
            'message' => 'Post created.',
        ]);
    }

    public function edit(BlogPost $post): Response
    {
        return Inertia::render('superadmin/blog/posts/edit', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, BlogPost $post): RedirectResponse
    {
        $data = $this->validatePost($request);

        $data['slug'] = $this->resolveSlug(BlogPost::class, (string) ($data['slug'] ?? $data['title']), $post->id);

        $post->update($data);

        return redirect()->route('superadmin.blog.posts.index')->with('toast', [
            'type' => 'success',
            'message' => 'Post updated.',
        ]);
    }

    public function destroy(BlogPost $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('superadmin.blog.posts.index')->with('toast', [
            'type' => 'success',
            'message' => 'Post deleted.',
        ]);
    }

    /**
     * @return array<string, string|int|null>
     */
    private function validatePost(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash'],
            'excerpt' => ['nullable', 'string'],
            'body' => ['required', 'string'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'author' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_keyword' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
        ]);
    }
}
