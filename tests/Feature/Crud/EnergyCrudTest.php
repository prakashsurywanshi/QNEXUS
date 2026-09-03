<?php

namespace Tests\Feature\Crud;

use App\Models\Meter;
use App\Models\MeterTopup;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class EnergyCrudTest extends CrudTestCase
{
    protected function createMeter(): Meter
    {
        $apartment = $this->createApartmentManagement();

        return Model::unguarded(fn () => Meter::create([
            'society_id' => $this->society->id,
            'apartment_id' => $apartment->id,
            'meter_number' => 'MET-001',
            'meter_type' => 'electric',
            'is_active' => true,
        ]));
    }

    public function test_index_renders_energy_dashboard()
    {
        $this->createMeter();

        $this->get(route('energy.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('energy/index')
                ->has('totals', fn (Assert $t) => $t
                    ->where('total_meters', 1)
                    ->has('total_usage')
                    ->has('total_topups')
                    ->has('low_credit')
                    ->has('inactive'))
                ->has('meters', 1));
    }

    public function test_topups_page_renders()
    {
        $meter = $this->createMeter();

        $this->get(route('energy.topups', $meter))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('energy/topups'));
    }

    public function test_can_record_topup()
    {
        $meter = $this->createMeter();

        $this->post(route('energy.topups.store', $meter), [
            'amount' => 1000,
            'token' => 'ABC123XYZ',
            'payment_method' => 'cash',
            'topup_date' => now()->format('Y-m-d'),
        ])->assertRedirect(route('energy.topups', $meter));

        $this->assertDatabaseHas('meter_topups', [
            'meter_id' => $meter->id,
            'amount' => 1000,
            'token' => 'ABC123XYZ',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_delete_topup()
    {
        $meter = $this->createMeter();

        $topup = Model::unguarded(fn () => MeterTopup::create([
            'society_id' => $this->society->id,
            'meter_id' => $meter->id,
            'amount' => 500,
            'payment_method' => 'upi',
            'topup_date' => now()->format('Y-m-d'),
            'recorded_by' => $this->user->id,
        ]));

        $this->delete(route('energy.topups.destroy', [$meter, $topup]))
            ->assertRedirect(route('energy.topups', $meter));

        $this->assertDatabaseMissing('meter_topups', ['id' => $topup->id]);
    }
}
