<?php

namespace Tests\Feature\Crud;

use App\Models\Notice;
use Inertia\Testing\AssertableInertia as Assert;

class NoticesCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('notices.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('notices/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('notices.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('notices.store'), [
            'description' => 'Bodies',
        ])->assertSessionHasErrors('title');
    }

    public function test_can_create_notice()
    {
        $this->post(route('notices.store'), [
            'title' => 'Water supply maintenance',
            'description' => 'Water supply will be suspended on Sunday.',
        ])->assertRedirect(route('notices.index'));

        $this->assertDatabaseHas('notices', [
            'title' => 'Water supply maintenance',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_notice()
    {
        $notice = Notice::create(['society_id' => $this->society->id, 'title' => 'Old notice', 'description' => 'x']);

        $this->put(route('notices.update', $notice), [
            'title' => 'Updated notice',
            'description' => 'New content',
        ])->assertRedirect(route('notices.index'));

        $this->assertDatabaseHas('notices', [
            'id' => $notice->id,
            'title' => 'Updated notice',
            'description' => 'New content',
        ]);
    }

    public function test_can_delete_notice()
    {
        $notice = Notice::create(['society_id' => $this->society->id, 'title' => 'Disposable notice', 'description' => 'x']);

        $this->delete(route('notices.destroy', $notice))
            ->assertRedirect(route('notices.index'));

        $this->assertDatabaseMissing('notices', ['id' => $notice->id]);
    }
}