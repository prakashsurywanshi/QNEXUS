<?php

namespace Tests\Feature\Crud;

use App\Models\Apartment;
use App\Models\ApartmentManagement;
use App\Models\ChartOfAccount;
use App\Models\CommercialTenant;
use App\Models\Floor;
use App\Models\LeaseAgreement;
use App\Models\MaintenanceApartment;
use App\Models\MaintenanceManagement;
use App\Models\Role;
use App\Models\ServiceType;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\Tower;
use App\Models\User;
use Database\Seeders\ModuleSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class CrudTestCase extends TestCase
{
    use RefreshDatabase;

    protected Society $society;
    protected User $user;
    protected Role $admin;

    protected function setUp(): void
    {
        parent::setUp();

        [$society, $user, $admin] = $this->provisionCrudUser();

        $this->society = $society;
        $this->user = $user;
        $this->admin = $admin;
    }

    public function provisionCrudUser(): array
    {
        $this->seed(ModuleSeeder::class);
        $this->seed(PermissionSeeder::class);

        $society = Society::create(['name' => 'Crud Test Society']);

        (new RoleSeeder())->run($society);

        $user = User::factory()->create(['society_id' => $society->id]);

        $admin = Role::withoutGlobalScope(\App\Scopes\SocietyScope::class)
            ->where('society_id', $society->id)
            ->where('display_name', 'Admin')
            ->firstOrFail();

        Model::unguarded(fn () => SocietyUser::create([
            'user_id' => $user->id,
            'society_id' => $society->id,
            'role_id' => $admin->id,
        ]));

        $user->update(['society_id' => $society->id, 'role_id' => $admin->id]);

        $this->actingAs($user);

        return [$society, $user, $admin];
    }

    public function createChartOfAccount(): ChartOfAccount
    {
        return Model::unguarded(fn () => ChartOfAccount::create([
            'society_id' => $this->society->id,
            'account_code' => 'AC-' . random_int(1000, 9999),
            'account_name' => 'Test Account',
            'account_type' => 'expense',
            'is_active' => true,
        ]));
    }

    public function createServiceType(): ServiceType
    {
        return Model::unguarded(fn () => ServiceType::create([
            'society_id' => $this->society->id,
            'name' => 'Plumbing',
        ]));
    }

    public function createApartmentManagement(): ApartmentManagement
    {
        $tower = Model::unguarded(fn () => Tower::create([
            'society_id' => $this->society->id,
            'tower_name' => 'Tower A',
        ]));

        $floor = Model::unguarded(fn () => Floor::create([
            'society_id' => $this->society->id,
            'floor_name' => 'Ground Floor',
            'tower_id' => $tower->id,
        ]));

        $apartment = Model::unguarded(fn () => Apartment::create([
            'society_id' => $this->society->id,
            'apartment_type' => '2BHK',
        ]));

        return Model::unguarded(fn () => ApartmentManagement::create([
            'society_id' => $this->society->id,
            'apartment_number' => 'A-101',
            'apartment_area' => 1000,
            'apartment_area_unit' => 'sqft',
            'floor_id' => $floor->id,
            'tower_id' => $tower->id,
            'apartment_id' => $apartment->id,
            'status' => 'occupied',
        ]));
    }

    public function createMaintenanceApartment(): MaintenanceApartment
    {
        $apartment = $this->createApartmentManagement();

        $management = Model::unguarded(fn () => MaintenanceManagement::create([
            'society_id' => $this->society->id,
            'month' => '09',
            'year' => '2026',
            'payment_due_date' => now()->addDays(5)->format('Y-m-d'),
            'status' => 'published',
        ]));

        return Model::unguarded(fn () => MaintenanceApartment::create([
            'maintenance_management_id' => $management->id,
            'apartment_management_id' => $apartment->id,
            'cost' => 1500,
            'paid_status' => 'unpaid',
        ]));
    }

    public function createLeaseAgreement(): LeaseAgreement
    {
        $tenant = Model::unguarded(fn () => CommercialTenant::create([
            'society_id' => $this->society->id,
            'unit_number' => 'C-101',
            'status' => 'occupied',
        ]));

        return Model::unguarded(fn () => LeaseAgreement::create([
            'society_id' => $this->society->id,
            'commercial_tenant_id' => $tenant->id,
            'lease_number' => 'LS-' . random_int(1000, 9999),
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addYear()->format('Y-m-d'),
            'monthly_rent' => 10000,
            'status' => 'active',
        ]));
    }
}