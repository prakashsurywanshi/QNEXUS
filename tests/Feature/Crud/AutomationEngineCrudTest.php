<?php

namespace Tests\Feature\Crud;

use App\Models\Automation;
use App\Models\Gatepass;
use App\Models\LeaseAgreement;
use App\Models\SocietyUser;
use App\Models\User;
use App\Services\AutomationEngine;
use Illuminate\Database\Eloquent\Model;

class AutomationEngineCrudTest extends CrudTestCase
{
    public function test_lease_expiring_trigger_fires_and_records_run(): void
    {
        $lease = $this->createLeaseAgreement();

        $lease->update(['end_date' => now()->addDays(10)->format('Y-m-d')]);

        $automation = Model::unguarded(fn () => Automation::create([
            'society_id' => $this->society->id,
            'name' => 'Lease expiry reminder',
            'trigger_event' => 'lease_expiring',
            'action' => 'notify_facility_manager',
            'is_active' => true,
        ]));

        $manager = $this->createManagerUser();

        (new AutomationEngine)->runForSociety((int) $this->society->id);

        $this->assertDatabaseHas('automation_runs', [
            'automation_id' => $automation->id,
            'society_id' => $this->society->id,
            'subject_type' => LeaseAgreement::class,
            'subject_id' => $lease->id,
            'action' => 'notify_facility_manager',
        ]);

        $this->assertSame(1, $manager->notifications()->count());
    }

    private function createManagerUser(): User
    {
        $user = User::factory()->create(['society_id' => $this->society->id]);

        Model::unguarded(fn () => SocietyUser::create([
            'user_id' => $user->id,
            'society_id' => $this->society->id,
            'role_id' => $this->admin->id,
        ]));

        return $user;
    }

    public function test_engine_is_idempotent_for_same_subject(): void
    {
        $lease = $this->createLeaseAgreement();

        $lease->update(['end_date' => now()->addDays(10)->format('Y-m-d')]);

        Model::unguarded(fn () => Automation::create([
            'society_id' => $this->society->id,
            'name' => 'Lease expiry reminder',
            'trigger_event' => 'lease_expiring',
            'action' => 'send_reminder',
            'is_active' => true,
        ]));

        $engine = new AutomationEngine;

        $engine->runForSociety((int) $this->society->id);
        $engine->runForSociety((int) $this->society->id);

        $this->assertDatabaseCount('automation_runs', 1);
    }

    public function test_inactive_automation_is_not_executed(): void
    {
        $this->createLeaseAgreement()->update(['end_date' => now()->addDays(5)->format('Y-m-d')]);

        Model::unguarded(fn () => Automation::create([
            'society_id' => $this->society->id,
            'name' => 'Disabled rule',
            'trigger_event' => 'lease_expiring',
            'action' => 'notify_accounts',
            'is_active' => false,
        ]));

        (new AutomationEngine)->runForSociety((int) $this->society->id);

        $this->assertDatabaseCount('automation_runs', 0);
    }

    public function test_visitor_qr_expires_trigger_fires_for_old_gatepass(): void
    {
        $apartment = $this->createApartmentManagement();

        Model::unguarded(fn () => Gatepass::create([
            'society_id' => $this->society->id,
            'apartment_id' => $apartment->id,
            'user_id' => $this->user->id,
            'item_description' => 'Parcel',
            'quantity' => 1,
            'gatepass_type' => 'in',
            'status' => 'approved',
            'created_at' => now()->subHours(10),
            'updated_at' => now()->subHours(10),
        ]));

        Model::unguarded(fn () => Automation::create([
            'society_id' => $this->society->id,
            'name' => 'QR expiry',
            'trigger_event' => 'visitor_qr_expires',
            'action' => 'send_reminder',
            'is_active' => true,
        ]));

        (new AutomationEngine)->runForSociety((int) $this->society->id);

        $this->assertDatabaseCount('automation_runs', 1);
    }
}
