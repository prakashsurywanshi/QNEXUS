<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\Notice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoticeController extends RoleAwareApiController
{
    public function index(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $notices = Notice::where('society_id', $society->id)
            ->orderByDesc('id')
            ->paginate($request->get('per_page', 20));

        return $this->paginated($notices);
    }

    public function store(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $this->authorizeRole(['Admin', 'Manager']);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $notice = new Notice;
        $notice->society_id = $society->id;
        $notice->title = $validated['title'];
        $notice->description = $validated['description'] ?? null;
        $notice->save();

        return $this->created($notice, 'Notice created');
    }
}
