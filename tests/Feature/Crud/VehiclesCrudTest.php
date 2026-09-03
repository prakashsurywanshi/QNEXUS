<?php

namespace Tests\Feature\Crud;

use App\Models\ParkingManagementSetting;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class VehiclesCrudTest extends CrudTestCase
{
    protected function createParkingSlot(): ParkingManagementSetting
    {
        return Model::unguarded(fn () => ParkingManagementSetting::create([
            'society_id' => $this->society->id,
            'parking_code' => 'P-'.mt_rand(1000, 9999),
            'status' => 'available',
        ]));
    }

    public function test_index_renders_list()
    {
        $this->get(route('vehicles.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('vehicles/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('vehicles.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('vehicles/create'));
    }

    public function test_can_create_vehicle()
    {
        $slot = $this->createParkingSlot();
        $apartment = $this->createApartmentManagement();

        $this->post(route('vehicles.store'), [
            'apartment_management_id' => $apartment->id,
            'owner_user_id' => $this->user->id,
            'vehicle_number' => 'MH 12 AB 1234',
            'vehicle_type' => 'four_wheeler',
            'make' => 'Maruti',
            'model' => 'Swift',
            'color' => 'Red',
            'sticker_number' => 'STK-001',
            'parking_management_id' => $slot->id,
            'is_primary' => true,
        ])->assertRedirect(route('vehicles.index'));

        $this->assertDatabaseHas('vehicles', [
            'vehicle_number' => 'MH 12 AB 1234',
            'vehicle_type' => 'four_wheeler',
            'apartment_management_id' => $apartment->id,
            'parking_management_id' => $slot->id,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_vehicle()
    {
        $apartment = $this->createApartmentManagement();

        $vehicle = Model::unguarded(fn () => Vehicle::create([
            'society_id' => $this->society->id,
            'vehicle_number' => 'MH 01 CD 5678',
            'vehicle_type' => 'two_wheeler',
        ]));

        $this->put(route('vehicles.update', $vehicle), [
            'apartment_management_id' => $apartment->id,
            'owner_user_id' => $this->user->id,
            'vehicle_number' => 'MH 01 CD 9999',
            'vehicle_type' => 'commercial',
            'make' => 'Tata',
            'is_primary' => false,
        ])->assertRedirect(route('vehicles.index'));

        $this->assertDatabaseHas('vehicles', [
            'id' => $vehicle->id,
            'vehicle_number' => 'MH 01 CD 9999',
            'vehicle_type' => 'commercial',
        ]);
    }

    public function test_edit_page_renders()
    {
        $vehicle = Model::unguarded(fn () => Vehicle::create([
            'society_id' => $this->society->id,
            'vehicle_number' => 'MH 01 CD 5678',
            'vehicle_type' => 'four_wheeler',
        ]));

        $this->get(route('vehicles.edit', $vehicle))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('vehicles/edit'));
    }

    public function test_can_delete_vehicle()
    {
        $vehicle = Model::unguarded(fn () => Vehicle::create([
            'society_id' => $this->society->id,
            'vehicle_number' => 'MH 01 CD 5678',
            'vehicle_type' => 'four_wheeler',
        ]));

        $this->delete(route('vehicles.destroy', $vehicle))
            ->assertRedirect(route('vehicles.index'));

        $this->assertDatabaseMissing('vehicles', ['id' => $vehicle->id]);
    }
}
