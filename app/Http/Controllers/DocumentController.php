<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Document;
use App\Models\DocumentFolder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('documents/index', [
            'documents' => Document::with(['folder'])->latest()->get(),
            'folders' => DocumentFolder::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name', 'type']),
            'categories' => ['Property', 'Society', 'Vendors', 'Commercial', 'Other'],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('documents/create', [
            'folders' => DocumentFolder::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name', 'type']),
            'categories' => ['Property', 'Society', 'Vendors', 'Commercial', 'Other'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'folder_id' => ['nullable', 'exists:document_folders,id'],
            'file' => ['nullable', 'file', 'max:10240'],
        ]);

        $filePath = null;
        $mimeType = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('documents', 'public');
            $mimeType = $request->file('file')->getMimeType();
        }

        Document::create([
            'society_id' => active_society_id(),
            'folder_id' => $data['folder_id'] ?? null,
            'name' => $data['name'],
            'category' => $data['category'] ?? null,
            'file_path' => $filePath,
            'mime_type' => $mimeType,
            'created_by' => auth()->id(),
        ]);

        AuditLog::record("Uploaded document: {$data['name']}");

        return redirect()->route('documents.index');
    }

    public function edit(Document $document): Response
    {
        return Inertia::render('documents/edit', [
            'document' => $document->load(['folder']),
            'folders' => DocumentFolder::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name', 'type']),
            'categories' => ['Property', 'Society', 'Vendors', 'Commercial', 'Other'],
        ]);
    }

    public function update(Request $request, Document $document): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'folder_id' => ['nullable', 'exists:document_folders,id'],
            'file' => ['nullable', 'file', 'max:10240'],
        ]);

        $update = [
            'folder_id' => $data['folder_id'] ?? null,
            'name' => $data['name'],
            'category' => $data['category'] ?? null,
        ];

        if ($request->hasFile('file')) {
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }
            $update['file_path'] = $request->file('file')->store('documents', 'public');
            $update['mime_type'] = $request->file('file')->getMimeType();
        }

        $document->update($update);

        AuditLog::record("Updated document: {$data['name']}", $document);

        return redirect()->route('documents.index');
    }

    public function destroy(Document $document): RedirectResponse
    {
        AuditLog::record("Deleted document: {$document->name}");
        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }
        $document->delete();

        return redirect()->route('documents.index');
    }
}
