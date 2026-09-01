<?php

namespace Tests\Feature\Crud;

use App\Models\ServiceManagement;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class ServiceManagementCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('service-management.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('service-management/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('service-management.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('service-management.store'), [
            'status' => 'available',
        ])->assertSessionHasErrors('service_type_id');
    }

    public function test_can_create_service()
    {
        $type = $this->createServiceType();

        $this->post(route('service-management.store'), [
            'service_type_id' => $type->id,
            'company_name' => 'Plumb Right Services',
            'contact_person_name' => 'Ravi',
            'phone_number' => '9876543210',
            'website_link' => 'https://plumbright.example.com',
            'price' => 500,
            'payment_frequency' => 'per_visit',
            'status' => 'available',
            'daily_help' => false,
            'description' => '24x7 plumbing support',
        ])->assertRedirect(route('service-management.index'));

        $this->assertDatabaseHas('service_management', [
            'service_type_id' => $type->id,
            'company_name' => 'Plumb Right Services',
            'status' => 'available',
            'society_id' => $this->society->id,
            'price' => 500,
        ]);
    }

    public function test_can_update_service()
    {
        $type = $this->createServiceType();

        $service = Model::unguarded(fn () => ServiceManagement::create([
            'society_id' => $this->society->id,
            'service_type_id' => $type->id,
            'company_name' => 'Old Name',
            'status' => 'available',
        ]));

        $this->put(route('service-management.update', $service), [
            'service_type_id' => $type->id,
            'company_name' => 'New Name',
            'price' => 750,
            'payment_frequency' => 'per_hour',
            'status' => 'not_available',
            'daily_help' => false,
        ])->assertRedirect(route('service-management.index'));

        $this->assertDatabaseHas('service_management', [
            'id' => $service->id,
            'company_name' => 'New Name',
            'price' => 750,
            'status' => 'not_available',
        ]);
    }

    public function test_can_delete_service()
    {
        $type = $this->createServiceType();

        $service = Model::unguarded(fn () => ServiceManagement::create([
            'society_id' => $this->society->id,
            'service_type_id' => $type->id,
            'company_name' => 'Disposable',
            'status' => 'available',
        ]));

        $this->delete(route('service-management.destroy', $service))
            ->assertRedirect(route('service-management.index'));

        $this->assertDatabaseMissing('service_management', ['id' => $service->id]);
    }
}