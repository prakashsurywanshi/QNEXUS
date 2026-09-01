<?php

namespace Tests\Feature\Crud;

use App\Models\Society;
use Inertia\Testing\AssertableInertia as Assert;

class SocietiesCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('societies.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('societies/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('societies.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('societies.store'), [
            'property_type' => 'residential',
        ])->assertSessionHasErrors('name');
    }

    public function test_can_create_society()
    {
        $this->post(route('societies.store'), [
            'name' => 'Sunrise Apartments',
            'email' => 'sunrise@example.com',
            'phone_number' => '9876500000',
            'timezone' => 'Asia/Kolkata',
            'address' => 'Navi Mumbai',
            'property_type' => 'mixed',
            'is_active' => true,
            'show_logo_text' => false,
        ])->assertRedirect(route('societies.index'));

        $this->assertDatabaseHas('societies', [
            'name' => 'Sunrise Apartments',
            'property_type' => 'mixed',
            'is_active' => 1,
        ]);
    }

    public function test_can_update_society()
    {
        $society = Society::create(['name' => 'Old Society', 'property_type' => 'residential']);

        $this->put(route('societies.update', $society), [
            'name' => 'New Society',
            'property_type' => 'commercial',
            'is_active' => false,
            'show_logo_text' => true,
        ])->assertRedirect(route('societies.index'));

        $this->assertDatabaseHas('societies', [
            'id' => $society->id,
            'name' => 'New Society',
            'property_type' => 'commercial',
        ]);
    }

    public function test_can_delete_society()
    {
        $society = Society::create(['name' => 'Disposable Society', 'property_type' => 'residential']);

        $this->delete(route('societies.destroy', $society))
            ->assertRedirect(route('societies.index'));

        $this->assertDatabaseMissing('societies', ['id' => $society->id]);
    }
}