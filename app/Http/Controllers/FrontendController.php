<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\CmsPage;
use App\Models\CmsSection;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('site/home', [
            'sections' => CmsSection::published()
                ->orderBy('sort_order')
                ->get(),
            'posts' => BlogPost::published()
                ->orderByDesc('published_at')
                ->limit(3)
                ->get(['id', 'title', 'slug', 'excerpt', 'cover_image', 'published_at']),
        ]);
    }

    public function page(string $slug): Response
    {
        $page = CmsPage::published()->where('slug', $slug)->firstOrFail();

        return Inertia::render('site/page', [
            'page' => $page,
        ]);
    }

    public function blog(): Response
    {
        return Inertia::render('site/blog', [
            'posts' => BlogPost::published()
                ->orderByDesc('published_at')
                ->get(['id', 'title', 'slug', 'excerpt', 'category', 'cover_image', 'published_at']),
        ]);
    }

    public function post(string $slug): Response
    {
        $post = BlogPost::published()->where('slug', $slug)->firstOrFail();

        return Inertia::render('site/post', [
            'post' => $post,
        ]);
    }
}
