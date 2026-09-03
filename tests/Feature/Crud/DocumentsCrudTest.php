<?php

namespace Tests\Feature\Crud;

use App\Models\Document;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

class DocumentsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('documents.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('documents/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('documents.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('documents/create'));
    }

    public function test_can_create_document()
    {
        Storage::fake('public');

        $this->post(route('documents.store'), [
            'name' => 'Society Registration',
            'category' => 'Society',
            'file' => UploadedFile::fake()->create('registration.pdf', 100),
        ])->assertRedirect(route('documents.index'));

        $this->assertDatabaseHas('documents', [
            'name' => 'Society Registration',
            'category' => 'Society',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_create_document_without_file()
    {
        $this->post(route('documents.store'), [
            'name' => 'Link Only Document',
            'category' => 'Property',
        ])->assertRedirect(route('documents.index'));

        $this->assertDatabaseHas('documents', [
            'name' => 'Link Only Document',
            'category' => 'Property',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_document()
    {
        $document = Model::unguarded(fn () => Document::create([
            'society_id' => $this->society->id,
            'name' => 'Old name',
            'category' => 'Property',
            'created_by' => $this->user->id,
        ]));

        $this->put(route('documents.update', $document), [
            'name' => 'New name',
            'category' => 'Vendors',
        ])->assertRedirect(route('documents.index'));

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'name' => 'New name',
            'category' => 'Vendors',
        ]);
    }

    public function test_edit_page_renders()
    {
        $document = Model::unguarded(fn () => Document::create([
            'society_id' => $this->society->id,
            'name' => 'Test Doc',
            'category' => 'Other',
            'created_by' => $this->user->id,
        ]));

        $this->get(route('documents.edit', $document))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('documents/edit'));
    }

    public function test_can_delete_document()
    {
        $document = Model::unguarded(fn () => Document::create([
            'society_id' => $this->society->id,
            'name' => 'To delete',
            'category' => 'Other',
            'created_by' => $this->user->id,
        ]));

        $this->delete(route('documents.destroy', $document))
            ->assertRedirect(route('documents.index'));

        $this->assertDatabaseMissing('documents', ['id' => $document->id]);
    }
}