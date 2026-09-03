<?php

namespace Tests\Feature\Crud;

use App\Models\Meter;
use App\Models\PrepaidMeterReading;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class PrepaidMetersCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('prepaid-meters.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('finance/prepaid-meters/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('prepaid-meters.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('finance/prepaid-meters/create'));
    }

    public function test_can_create_meter()
    {
        $this->post(route('prepaid-meters.store'), [
            'meter_number' => 'EL-001',
            'meter_type' => 'electric',
            'is_active' => true,
        ])->assertRedirect(route('prepaid-meters.index'));

        $this->assertDatabaseHas('meters', [
            'meter_number' => 'EL-001',
            'meter_type' => 'electric',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_meter()
    {
        $meter = Model::unguarded(fn () => Meter::create([
            'society_id' => $this->society->id,
            'meter_number' => 'EL-001',
            'meter_type' => 'electric',
            'is_active' => true,
        ]));

        $this->put(route('prepaid-meters.update', $meter), [
            'meter_number' => 'EL-002',
            'meter_type' => 'water',
            'is_active' => false,
        ])->assertRedirect(route('prepaid-meters.index'));

        $this->assertDatabaseHas('meters', [
            'id' => $meter->id,
            'meter_number' => 'EL-002',
            'meter_type' => 'water',
        ]);
    }

    public function test_edit_page_renders()
    {
        $meter = Model::unguarded(fn () => Meter::create([
            'society_id' => $this->society->id,
            'meter_number' => 'EL-001',
            'meter_type' => 'electric',
            'is_active' => true,
        ]));

        $this->get(route('prepaid-meters.edit', $meter))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('finance/prepaid-meters/edit'));
    }

    public function test_can_delete_meter()
    {
        $meter = Model::unguarded(fn () => Meter::create([
            'society_id' => $this->society->id,
            'meter_number' => 'EL-001',
            'meter_type' => 'electric',
            'is_active' => true,
        ]));

        $this->delete(route('prepaid-meters.destroy', $meter))
            ->assertRedirect(route('prepaid-meters.index'));

        $this->assertDatabaseMissing('meters', ['id' => $meter->id]);
    }

    public function test_readings_page_renders()
    {
        $meter = Model::unguarded(fn () => Meter::create([
            'society_id' => $this->society->id,
            'meter_number' => 'EL-001',
            'meter_type' => 'electric',
            'is_active' => true,
        ]));

        $this->get(route('prepaid-meters.readings', $meter))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('finance/prepaid-meters/readings'));
    }

    public function test_can_store_reading()
    {
        $meter = Model::unguarded(fn () => Meter::create([
            'society_id' => $this->society->id,
            'meter_number' => 'EL-001',
            'meter_type' => 'electric',
            'is_active' => true,
        ]));

        $this->post(route('prepaid-meters.readings.store', $meter), [
            'current_reading' => 250.5,
            'amount' => 1500,
            'balance' => 500,
            'reading_date' => now()->format('Y-m-d'),
        ])->assertRedirect(route('prepaid-meters.readings', $meter));

        $this->assertDatabaseHas('prepaid_meter_readings', [
            'meter_id' => $meter->id,
            'current_reading' => 250.5,
            'previous_reading' => 0,
            'units_consumed' => 250.5,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_delete_reading()
    {
        $meter = Model::unguarded(fn () => Meter::create([
            'society_id' => $this->society->id,
            'meter_number' => 'EL-001',
            'meter_type' => 'electric',
            'is_active' => true,
        ]));

        $reading = Model::unguarded(fn () => PrepaidMeterReading::create([
            'society_id' => $this->society->id,
            'meter_id' => $meter->id,
            'previous_reading' => 0,
            'current_reading' => 100,
            'units_consumed' => 100,
            'amount' => 600,
            'balance' => 0,
            'reading_date' => now(),
        ]));

        $this->delete(route('prepaid-meters.readings.destroy', [$meter, $reading]))
            ->assertRedirect(route('prepaid-meters.readings', $meter));

        $this->assertDatabaseMissing('prepaid_meter_readings', ['id' => $reading->id]);
    }
}
