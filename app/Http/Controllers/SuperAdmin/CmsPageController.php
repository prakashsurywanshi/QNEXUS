<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsPageController extends Controller
{
    use EnsuresUniqueSlug;

    public function index(): Response
    {
        return Inertia::render('superadmin/cms/pages/index', [
            'pages' => CmsPage::orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('superadmin/cms/pages/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePage($request);

        $data['slug'] = $this->resolveSlug(CmsPage::class, (string) ($data['slug'] ?? $data['title']));

        CmsPage::create($data);

        return redirect()->route('superadmin.cms.pages.index')->with('toast', [
            'type' => 'success',
            'message' => 'Page created.',
        ]);
    }

    public function edit(CmsPage $page): Response
    {
        return Inertia::render('superadmin/cms/pages/edit', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, CmsPage $page): RedirectResponse
    {
        $data = $this->validatePage($request);

        $data['slug'] = $this->resolveSlug(CmsPage::class, (string) ($data['slug'] ?? $data['title']), $page->id);

        $page->update($data);

        return redirect()->route('superadmin.cms.pages.index')->with('toast', [
            'type' => 'success',
            'message' => 'Page updated.',
        ]);
    }

    public function destroy(CmsPage $page): RedirectResponse
    {
        $page->delete();

        return redirect()->route('superadmin.cms.pages.index')->with('toast', [
            'type' => 'success',
            'message' => 'Page deleted.',
        ]);
    }

    /**
     * @return array{
     *     title: string,
     *     slug: string|null,
     *     content: string|null,
     *     image: string|null,
     *     meta_title: string|null,
     *     meta_keyword: string|null,
     *     meta_description: string|null,
     *     status: string,
     *     sort_order: int|null,
     * }
     */
    private function validatePage(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_keyword' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,published'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
