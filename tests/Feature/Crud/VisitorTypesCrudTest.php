<?php

namespace Tests\Feature\Crud;

use App\Models\VisitorTypeSettingsModel;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class VisitorTypesCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('visitor-types.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('visitor-types/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('visitor-types.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('visitor-types/create'));
    }

    public function test_can_create_type()
    {
        $this->post(route('visitor-types.store'), [
            'name' => 'Delivery',
            'description' => 'Package deliveries',
        ])->assertRedirect(route('visitor-types.index'));

        $this->assertDatabaseHas('visitor_settings', [
            'name' => 'Delivery',
            'description' => 'Package deliveries',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_type()
    {
        $type = Model::unguarded(fn () => VisitorTypeSettingsModel::create([
            'society_id' => $this->society->id,
            'name' => 'Old Type',
        ]));

        $this->put(route('visitor-types.update', $type), [
            'name' => 'New Type',
            'description' => 'Updated',
        ])->assertRedirect(route('visitor-types.index'));

        $this->assertDatabaseHas('visitor_settings', [
            'id' => $type->id,
            'name' => 'New Type',
        ]);
    }

    public function test_edit_page_renders()
    {
        $type = Model::unguarded(fn () => VisitorTypeSettingsModel::create([
            'society_id' => $this->society->id,
            'name' => 'Test Type',
        ]));

        $this->get(route('visitor-types.edit', $type))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('visitor-types/edit'));
    }

    public function test_can_delete_type()
    {
        $type = Model::unguarded(fn () => VisitorTypeSettingsModel::create([
            'society_id' => $this->society->id,
            'name' => 'To delete',
        ]));

        $this->delete(route('visitor-types.destroy', $type))
            ->assertRedirect(route('visitor-types.index'));

        $this->assertDatabaseMissing('visitor_settings', ['id' => $type->id]);
    }
}
