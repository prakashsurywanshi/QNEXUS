<?php

namespace Tests\Feature\Crud;

use App\Models\AssetsCategory;
use Inertia\Testing\AssertableInertia as Assert;

class AssetsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('assets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('assets/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('assets.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('assets.store'), [])->assertSessionHasErrors('name');
    }

    public function test_can_create_asset()
    {
        $category = AssetsCategory::create(['name' => 'Vehicles']);

        $this->post(route('assets.store'), [
            'name' => 'Security Guard Van',
            'category_id' => $category->id,
            'location' => 'Main Gate',
            'condition' => 'good',
            'purchase_date' => '2025-01-15',
            'maintenance_schedule' => 'yearly',
        ])->assertRedirect(route('assets.index'));

        $this->assertDatabaseHas('asset_managements', [
            'name' => 'Security Guard Van',
            'category_id' => $category->id,
            'location' => 'Main Gate',
            'condition' => 'good',
            'purchase_date' => '2025-01-15',
            'maintenance_schedule' => 'yearly',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_asset()
    {
        $asset = \App\Models\AssetManagement::create([
            'society_id' => $this->society->id,
            'name' => 'Old Asset',
        ]);

        $this->put(route('assets.update', $asset), [
            'name' => 'New Asset',
            'maintenance_schedule' => 'monthly',
        ])->assertRedirect(route('assets.index'));

        $this->assertDatabaseHas('asset_managements', [
            'id' => $asset->id,
            'name' => 'New Asset',
            'maintenance_schedule' => 'monthly',
        ]);
    }

    public function test_can_delete_asset()
    {
        $asset = \App\Models\AssetManagement::create([
            'society_id' => $this->society->id,
            'name' => 'Disposable Asset',
        ]);

        $this->delete(route('assets.destroy', $asset))
            ->assertRedirect(route('assets.index'));

        $this->assertDatabaseMissing('asset_managements', ['id' => $asset->id]);
    }
}