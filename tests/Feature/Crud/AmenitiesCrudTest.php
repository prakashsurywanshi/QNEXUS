<?php

namespace Tests\Feature\Crud;

use App\Models\Amenities;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class AmenitiesCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        Model::unguarded(fn () => Amenities::create([
            'society_id' => $this->society->id,
            'amenities_name' => 'Swimming Pool',
            'status' => 'available',
        ]));

        $this->get(route('amenities.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('amenities/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('amenities.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('amenities.store'), [
            'status' => 'available',
        ])->assertSessionHasErrors('amenities_name');
    }

    public function test_can_create_amenity()
    {
        $this->post(route('amenities.store'), [
            'amenities_name' => 'Gym',
            'status' => 'available',
            'booking_status' => true,
            'start_time' => '06:00',
            'end_time' => '22:00',
            'slot_time' => 60,
            'multiple_booking_status' => false,
            'number_of_person' => 20,
        ])->assertRedirect(route('amenities.index'));

        $this->assertDatabaseHas('amenities', [
            'amenities_name' => 'Gym',
            'status' => 'available',
            'society_id' => $this->society->id,
            'slot_time' => 60,
        ]);
    }

    public function test_can_update_amenity()
    {
        $amenity = Model::unguarded(fn () => Amenities::create([
            'society_id' => $this->society->id,
            'amenities_name' => 'Gym',
            'status' => 'available',
        ]));

        $this->put(route('amenities.update', $amenity), [
            'amenities_name' => 'Yoga Studio',
            'status' => 'not_available',
            'booking_status' => false,
        ])->assertRedirect(route('amenities.index'));

        $this->assertDatabaseHas('amenities', [
            'id' => $amenity->id,
            'amenities_name' => 'Yoga Studio',
            'status' => 'not_available',
        ]);
    }

    public function test_can_delete_amenity()
    {
        $amenity = Model::unguarded(fn () => Amenities::create([
            'society_id' => $this->society->id,
            'amenities_name' => 'Temporary',
            'status' => 'available',
        ]));

        $this->delete(route('amenities.destroy', $amenity))
            ->assertRedirect(route('amenities.index'));

        $this->assertDatabaseMissing('amenities', ['id' => $amenity->id]);
    }
}