<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CmsSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsSectionController extends Controller
{
    use EnsuresUniqueSlug;

    public function index(): Response
    {
        return Inertia::render('superadmin/cms/sections/index', [
            'sections' => CmsSection::orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('superadmin/cms/sections/create', [
            'sectionTypes' => $this->sectionTypes(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateSection($request);

        $data['slug'] = $this->resolveSlug(CmsSection::class, (string) ($data['slug'] ?? $data['name']));

        CmsSection::create($data);

        return redirect()->route('superadmin.cms.sections.index')->with('toast', [
            'type' => 'success',
            'message' => 'Section created.',
        ]);
    }

    public function edit(CmsSection $section): Response
    {
        return Inertia::render('superadmin/cms/sections/edit', [
            'section' => $section,
            'sectionTypes' => $this->sectionTypes(),
        ]);
    }

    public function update(Request $request, CmsSection $section): RedirectResponse
    {
        $data = $this->validateSection($request);

        $data['slug'] = $this->resolveSlug(CmsSection::class, (string) ($data['slug'] ?? $data['name']), $section->id);

        $section->update($data);

        return redirect()->route('superadmin.cms.sections.index')->with('toast', [
            'type' => 'success',
            'message' => 'Section updated.',
        ]);
    }

    public function destroy(CmsSection $section): RedirectResponse
    {
        $section->delete();

        return redirect()->route('superadmin.cms.sections.index')->with('toast', [
            'type' => 'success',
            'message' => 'Section deleted.',
        ]);
    }

    /**
     * @return string[]
     */
    private function sectionTypes(): array
    {
        return [
            'hero',
            'features',
            'stats',
            'gallery',
            'testimonials',
            'pricing',
            'cta',
            'contact',
        ];
    }

    /**
     * @return array<string, string|int|null>
     */
    private function validateSection(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash'],
            'section_type' => ['required', 'string', 'in:hero,features,stats,gallery,testimonials,pricing,cta,contact'],
            'heading' => ['nullable', 'string', 'max:255'],
            'subheading' => ['nullable', 'string', 'max:255'],
            'body' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
            'button_text' => ['nullable', 'string', 'max:255'],
            'button_link' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:draft,published'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
