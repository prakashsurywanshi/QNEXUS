<?php

namespace Tests\Feature\Crud;

use App\Models\SmartDevice;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class SmartDevicesCrudTest extends CrudTestCase
{
    protected function createDevice(): SmartDevice
    {
        return Model::unguarded(fn () => SmartDevice::create([
            'society_id' => $this->society->id,
            'device_name' => 'Main Gate CCTV 01',
            'device_type' => 'cctv',
            'location' => 'Main Gate',
            'status' => 'online',
            'connected' => true,
            'last_seen_at' => now(),
        ]));
    }

    public function test_index_renders_hub()
    {
        $this->createDevice();

        $this->get(route('smart-devices.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('smart-building/index')
                ->has('devices', 1)
                ->has('deviceTypes')
                ->has('statuses')
                ->has('summary')
                ->where('summary.cctv', 1)
                ->where('totals.total', 1)
                ->where('totals.online', 1)
                ->where('totals.offline', 0));
    }

    public function test_create_page_renders()
    {
        $this->get(route('smart-devices.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('smart-building/create'));
    }

    public function test_can_create_device()
    {
        $this->post(route('smart-devices.store'), [
            'device_name' => 'Lobby Access Reader',
            'device_type' => 'access_control',
            'location' => 'Tower A Lobby',
            'vendor' => 'Dormakaba',
            'status' => 'online',
            'connected' => true,
        ])->assertRedirect(route('smart-devices.index'));

        $this->assertDatabaseHas('smart_devices', [
            'device_name' => 'Lobby Access Reader',
            'device_type' => 'access_control',
            'society_id' => $this->society->id,
            'connected' => true,
        ]);
    }

    public function test_edit_page_renders()
    {
        $device = $this->createDevice();

        $this->get(route('smart-devices.edit', $device))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('smart-building/edit'));
    }

    public function test_can_update_device()
    {
        $device = $this->createDevice();

        $this->put(route('smart-devices.update', $device), [
            'device_name' => 'Main Gate CCTV 02',
            'device_type' => 'cctv',
            'location' => 'Main Gate',
            'status' => 'maintenance',
            'connected' => false,
        ])->assertRedirect(route('smart-devices.index'));

        $this->assertDatabaseHas('smart_devices', [
            'id' => $device->id,
            'device_name' => 'Main Gate CCTV 02',
            'status' => 'maintenance',
            'connected' => false,
        ]);
    }

    public function test_can_delete_device()
    {
        $device = $this->createDevice();

        $this->delete(route('smart-devices.destroy', $device))
            ->assertRedirect(route('smart-devices.index'));

        $this->assertDatabaseMissing('smart_devices', ['id' => $device->id]);
    }
}
