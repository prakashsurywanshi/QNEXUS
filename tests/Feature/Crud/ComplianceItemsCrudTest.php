<?php

namespace Tests\Feature\Crud;

use App\Models\ComplianceItem;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class ComplianceItemsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('compliance-items.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('compliance-items/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('compliance-items.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('compliance-items/create'));
    }

    public function test_can_create_item()
    {
        $this->post(route('compliance-items.store'), [
            'category' => 'Fire Safety',
            'item_name' => 'Fire Extinguisher Inspection',
            'description' => 'Monthly check',
            'due_date' => now()->addMonth()->format('Y-m-d'),
            'status' => 'pending',
        ])->assertRedirect(route('compliance-items.index'));

        $this->assertDatabaseHas('compliance_items', [
            'item_name' => 'Fire Extinguisher Inspection',
            'category' => 'Fire Safety',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_item()
    {
        $item = Model::unguarded(fn () => ComplianceItem::create([
            'society_id' => $this->society->id,
            'category' => 'Fire Safety',
            'item_name' => 'Old item',
            'status' => 'pending',
        ]));

        $this->put(route('compliance-items.update', $item), [
            'category' => 'Licensing',
            'item_name' => 'New item',
            'status' => 'completed',
        ])->assertRedirect(route('compliance-items.index'));

        $this->assertDatabaseHas('compliance_items', [
            'id' => $item->id,
            'item_name' => 'New item',
            'status' => 'completed',
        ]);
    }

    public function test_edit_page_renders()
    {
        $item = Model::unguarded(fn () => ComplianceItem::create([
            'society_id' => $this->society->id,
            'category' => 'Fire Safety',
            'item_name' => 'Test item',
            'status' => 'pending',
        ]));

        $this->get(route('compliance-items.edit', $item))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('compliance-items/edit'));
    }

    public function test_can_delete_item()
    {
        $item = Model::unguarded(fn () => ComplianceItem::create([
            'society_id' => $this->society->id,
            'category' => 'Fire Safety',
            'item_name' => 'To delete',
            'status' => 'pending',
        ]));

        $this->delete(route('compliance-items.destroy', $item))
            ->assertRedirect(route('compliance-items.index'));

        $this->assertDatabaseMissing('compliance_items', ['id' => $item->id]);
    }
}
