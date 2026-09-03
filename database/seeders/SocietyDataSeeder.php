<?php

namespace Database\Seeders;

use App\Models\Amenities;
use App\Models\Apartment;
use App\Models\ApartmentManagement;
use App\Models\ApartmentTenant;
use App\Models\AssetManagement;
use App\Models\AssetsCategory;
use App\Models\Building;
use App\Models\CommercialTenant;
use App\Models\CommercialUnit;
use App\Models\Floor;
use App\Models\LeaseAgreement;
use App\Models\Maintenance;
use App\Models\Notice;
use App\Models\NoticeRole;
use App\Models\ParkingManagementSetting;
use App\Models\Rent;
use App\Models\Role;
use App\Models\ServiceManagement;
use App\Models\ServiceType;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\Tenant;
use App\Models\Ticket;
use App\Models\TicketAgentSetting;
use App\Models\TicketReply;
use App\Models\TicketTypeSetting;
use App\Models\Tower;
use App\Models\User;
use App\Models\VisitorManagement;
use App\Models\VisitorTypeSettingsModel;
use App\Scopes\SocietyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds comprehensive demo data for a society: towers, floors, apartments,
 * owners, tenants, amenities, tickets, notices, visitors, services, assets,
 * maintenance, rents, and commercial data (for commercial societies).
 *
 * Called after DummyUsersSeeder has created the society users (admin, manager,
 * owner, tenant, guard) so those users can be linked to the seeded data.
 *
 * Idempotent: safe to run repeatedly via firstOrCreate / existence checks.
 */
class SocietyDataSeeder extends Seeder
{
    private const PASSWORD = 'password';

    /**
     * Seed all data for the given society.
     */
    public function run(Society $society): void
    {
        $roleIds = $this->resolveRoles($society);
        $userIds = $this->resolveUsers($society);

        $this->seedTowers($society);
        $this->seedApartments($society);
        $this->seedParking($society);
        $this->seedAmenities($society);
        $this->seedTicketInfrastructure($society);
        $this->seedVisitorTypes($society);

        if ($society->property_type === 'commercial') {
            $this->seedCommercialData($society, $userIds);
        } else {
            $this->seedResidentialData($society, $roleIds, $userIds);
        }
    }

    /**
     * Resolve the 5 per-society role ids (Admin, Manager, Owner, Tenant, Guard).
     *
     * @return array<string, int|null>
     */
    private function resolveRoles(Society $society): array
    {
        $roleNames = ['Admin', 'Manager', 'Owner', 'Tenant', 'Guard'];
        $roles = [];

        foreach ($roleNames as $displayName) {
            $role = Role::withoutGlobalScope(SocietyScope::class)
                ->where('society_id', $society->id)
                ->where('display_name', $displayName)
                ->first();

            $roles[$displayName] = $role ? (int) $role->id : null;
        }

        return $roles;
    }

    /**
     * Resolve existing society users by role for linking to seeded data.
     *
     * @return array<string, User|null>
     */
    private function resolveUsers(Society $society): array
    {
        $result = [];

        foreach (['admin', 'manager', 'owner', 'tenant', 'guard'] as $roleSlug) {
            $displayName = ucfirst($roleSlug);
            $role = Role::withoutGlobalScope(SocietyScope::class)
                ->where('society_id', $society->id)
                ->where('display_name', $displayName)
                ->first();

            $result[$roleSlug] = $role
                ? User::where('society_id', $society->id)->where('role_id', $role->id)->first()
                : null;
        }

        return $result;
    }

    private function seedTowers(Society $society): void
    {
        $towerNames = [
            'Evergreen Heights',
            'Sunset View',
            'Ocean Breeze',
            'Mountain Vista',
            'Palm Court',
        ];

        foreach ($towerNames as $name) {
            Tower::firstOrCreate(
                ['tower_name' => $name, 'society_id' => $society->id],
                ['society_id' => $society->id],
            );
        }

        // Create floors for each tower.
        $floorNames = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor'];

        $towers = Tower::where('society_id', $society->id)->get();
        foreach ($towers as $tower) {
            $numFloors = 3;
            for ($i = 0; $i < $numFloors; $i++) {
                Floor::firstOrCreate(
                    ['floor_name' => $floorNames[$i], 'tower_id' => $tower->id, 'society_id' => $society->id],
                    ['society_id' => $society->id],
                );
            }
        }
    }

    private function seedApartments(Society $society): void
    {
        // Apartment types (1BHK through 5BHK).
        $types = [
            ['apartment_type' => '1 BHK', 'maintenance_value' => 100],
            ['apartment_type' => '2 BHK', 'maintenance_value' => 200],
            ['apartment_type' => '3 BHK', 'maintenance_value' => 300],
            ['apartment_type' => '4 BHK', 'maintenance_value' => 400],
            ['apartment_type' => '5 BHK', 'maintenance_value' => 500],
        ];

        foreach ($types as $type) {
            Apartment::firstOrCreate(
                ['apartment_type' => $type['apartment_type'], 'society_id' => $society->id],
                ['maintenance_value' => $type['maintenance_value'], 'society_id' => $society->id],
            );
        }

        // Link apartment types to owners via ApartmentManagement.
        $ownerUser = User::where('society_id', $society->id)
            ->whereHas('role', fn ($q) => $q->where('display_name', 'Owner')->where('society_id', $society->id))
            ->first();

        if (! $ownerUser) {
            return;
        }

        $towers = Tower::where('society_id', $society->id)->get();
        $floors = Floor::where('society_id', $society->id)->get();
        $apartmentTypes = Apartment::where('society_id', $society->id)->get();

        if ($towers->isEmpty() || $floors->isEmpty() || $apartmentTypes->isEmpty()) {
            return;
        }

        $units = [
            ['number' => '101', 'area' => 650, 'status' => 'occupied', 'type_idx' => 0],
            ['number' => '102', 'area' => 850, 'status' => 'occupied', 'type_idx' => 1],
            ['number' => '103', 'area' => 1100, 'status' => 'rented', 'type_idx' => 2],
            ['number' => '201', 'area' => 650, 'status' => 'occupied', 'type_idx' => 0],
            ['number' => '202', 'area' => 850, 'status' => 'occupied', 'type_idx' => 1],
            ['number' => '203', 'area' => 1100, 'status' => 'rented', 'type_idx' => 2],
            ['number' => '301', 'area' => 1400, 'status' => 'occupied', 'type_idx' => 3],
            ['number' => '302', 'area' => 1800, 'status' => 'occupied', 'type_idx' => 4],
        ];

        foreach ($units as $idx => $unit) {
            $tower = $towers[$idx % $towers->count()];
            $floor = $floors[$idx % $floors->count()];
            $aptType = $apartmentTypes[$unit['type_idx'] % $apartmentTypes->count()];

            ApartmentManagement::firstOrCreate(
                ['apartment_number' => $unit['number'], 'society_id' => $society->id],
                [
                    'apartment_area' => $unit['area'],
                    'apartment_area_unit' => 'sqft',
                    'floor_id' => $floor->id,
                    'tower_id' => $tower->id,
                    'apartment_id' => $aptType->id,
                    'user_id' => $unit['status'] === 'rented' ? null : $ownerUser->id,
                    'status' => $unit['status'],
                    'society_id' => $society->id,
                ],
            );
        }

        // Create tenants and link to rented apartments.
        $this->seedTenants($society);
    }

    private function seedTenants(Society $society): void
    {
        $tenantRole = Role::withoutGlobalScope(SocietyScope::class)
            ->where('society_id', $society->id)
            ->where('display_name', 'Tenant')
            ->first();

        if (! $tenantRole) {
            return;
        }

        $rentedApartments = ApartmentManagement::where('society_id', $society->id)
            ->where('status', 'rented')
            ->get();

        $tenants = [
            ['name' => 'John Smith', 'email' => 'john.smith.tenant@demo.test'],
            ['name' => 'Sarah Johnson', 'email' => 'sarah.johnson.tenant@demo.test'],
        ];

        foreach ($tenants as $idx => $tenantData) {
            $apartment = $rentedApartments->get($idx);
            if (! $apartment) {
                break;
            }

            $user = User::firstOrCreate(
                ['email' => $tenantData['email']],
                [
                    'name' => $tenantData['name'],
                    'password' => Hash::make(self::PASSWORD),
                    'email_verified_at' => now(),
                    'society_id' => $society->id,
                    'role_id' => $tenantRole->id,
                ],
            );

            Model::unguarded(fn () => SocietyUser::firstOrCreate(
                ['user_id' => $user->id, 'society_id' => $society->id],
                ['role_id' => $tenantRole->id],
            ));

            $tenant = Tenant::firstOrCreate(
                ['user_id' => $user->id, 'society_id' => $society->id],
                ['society_id' => $society->id],
            );

            $startDate = now()->subMonths(rand(3, 12));
            ApartmentTenant::firstOrCreate(
                ['tenant_id' => $tenant->id, 'apartment_id' => $apartment->id],
                [
                    'contract_start_date' => $startDate->format('Y-m-d'),
                    'contract_end_date' => $startDate->addMonths(12)->format('Y-m-d'),
                    'rent_amount' => [2500, 3000][$idx % 2],
                    'rent_billing_cycle' => 'monthly',
                    'status' => 'current_resident',
                ],
            );
        }
    }

    private function seedParking(Society $society): void
    {
        for ($i = 1; $i <= 8; $i++) {
            ParkingManagementSetting::firstOrCreate(
                ['parking_code' => sprintf('%03d', $i), 'society_id' => $society->id],
                ['status' => 'available', 'society_id' => $society->id],
            );
        }
    }

    private function seedAmenities(Society $society): void
    {
        $amenities = [
            ['amenities_name' => 'Swimming Pool', 'start_time' => '08:00:00', 'end_time' => '20:00:00', 'slot_time' => 40, 'number_of_person' => 2],
            ['amenities_name' => 'Gym', 'start_time' => '06:00:00', 'end_time' => '22:00:00', 'slot_time' => 20, 'number_of_person' => 3],
            ['amenities_name' => 'Tennis Court', 'start_time' => '09:00:00', 'end_time' => '18:00:00', 'slot_time' => 15, 'number_of_person' => 4],
            ['amenities_name' => 'Basketball Court', 'start_time' => '07:00:00', 'end_time' => '19:00:00', 'slot_time' => 30, 'number_of_person' => 5],
            ['amenities_name' => 'Club House', 'start_time' => '10:00:00', 'end_time' => '23:00:00', 'slot_time' => 60, 'number_of_person' => 10],
        ];

        foreach ($amenities as $data) {
            Amenities::firstOrCreate(
                ['amenities_name' => $data['amenities_name'], 'society_id' => $society->id],
                [
                    'status' => 'available',
                    'booking_status' => 1,
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                    'slot_time' => $data['slot_time'],
                    'multiple_booking_status' => 1,
                    'number_of_person' => $data['number_of_person'],
                    'society_id' => $society->id,
                ],
            );
        }
    }

    private function seedTicketInfrastructure(Society $society): void
    {
        // Ticket types.
        foreach (['Management', 'Problem', 'Suggestion', 'Parking'] as $type) {
            TicketTypeSetting::firstOrCreate(
                ['type_name' => $type, 'society_id' => $society->id],
                ['society_id' => $society->id],
            );
        }

        // Ticket agents (the admin and manager users).
        $admin = User::where('society_id', $society->id)
            ->whereHas('role', fn ($q) => $q->where('display_name', 'Admin')->where('society_id', $society->id))
            ->first();

        $manager = User::where('society_id', $society->id)
            ->whereHas('role', fn ($q) => $q->where('display_name', 'Manager')->where('society_id', $society->id))
            ->first();

        $ticketType = TicketTypeSetting::where('society_id', $society->id)->first();

        if ($ticketType) {
            foreach ([$admin, $manager] as $agent) {
                if ($agent) {
                    TicketAgentSetting::firstOrCreate(
                        ['ticket_agent_id' => $agent->id, 'ticket_type_id' => $ticketType->id, 'society_id' => $society->id],
                        ['ticket_agent_id' => $agent->id, 'ticket_type_id' => $ticketType->id, 'society_id' => $society->id],
                    );
                }
            }
        }
    }

    private function seedVisitorTypes(Society $society): void
    {
        foreach (['Guest', 'Service Personnel', 'Delivery Person', 'Family Members', 'Friends'] as $type) {
            VisitorTypeSettingsModel::firstOrCreate(
                ['name' => $type, 'society_id' => $society->id],
                ['society_id' => $society->id],
            );
        }
    }

    /**
     * @param  array<string, int|null>  $roleIds
     * @param  array<string, User|null>  $userIds
     */
    private function seedResidentialData(Society $society, array $roleIds, array $userIds): void
    {
        $this->seedNotices($society, $roleIds);
        $this->seedTickets($society, $userIds);
        $this->seedVisitors($society, $userIds);
        $this->seedServices($society);
        $this->seedMaintenance($society);
        $this->seedRents($society);
        $this->seedAssets($society);
    }

    /**
     * @param  array<string, int|null>  $roleIds
     */
    private function seedNotices(Society $society, array $roleIds): void
    {
        $notices = [
            ['title' => 'Annual General Meeting', 'description' => 'The Annual General Meeting will be held on Sunday at 10:00 AM in the Club House. All residents are requested to attend.'],
            ['title' => 'Maintenance Schedule', 'description' => 'Monthly maintenance of lifts and pumps will be carried out on Saturday from 10 AM to 2 PM. Water supply may be affected.'],
            ['title' => 'Security Guidelines', 'description' => 'All residents are requested to carry their ID cards at all times. visitors must be registered at the gate.'],
            ['title' => 'Festival Celebrations', 'description' => 'The society will organize community celebrations for upcoming festivals. Volunteers are welcome to participate.'],
            ['title' => 'Water Conservation Notice', 'description' => 'Due to water shortage, residents are requested to use water judiciously. Sprinklers should be used only on alternate days.'],
        ];

        foreach ($notices as $data) {
            $notice = Notice::firstOrCreate(
                ['title' => $data['title'], 'society_id' => $society->id],
                ['description' => $data['description'], 'society_id' => $society->id],
            );

            // Assign to all roles.
            foreach ($roleIds as $roleName => $roleId) {
                NoticeRole::firstOrCreate(
                    ['notice_id' => $notice->id, 'role_id' => $roleId],
                );
            }
        }
    }

    /**
     * @param  array<string, User|null>  $userIds
     */
    private function seedTickets(Society $society, array $userIds): void
    {
        $subjects = [
            'Water Leakage in Bathroom',
            'Elevator Not Working',
            'Security Gate Issue',
            'Garden Maintenance Required',
            'Parking Space Conflict',
            'Noise Complaint',
            'Electricity Backup Not Working',
            'Corridor Lighting Issue',
        ];

        $statuses = ['open', 'pending', 'resolved', 'closed'];
        $ticketType = TicketTypeSetting::where('society_id', $society->id)->first();
        $ownerUser = $userIds['owner'] ?? $userIds['admin'];

        if (! $ticketType || ! $ownerUser) {
            return;
        }

        foreach ($subjects as $idx => $subject) {
            $ticket = Ticket::firstOrCreate(
                ['subject' => $subject, 'society_id' => $society->id],
                [
                    'user_id' => $ownerUser->id,
                    'type_id' => $ticketType->id,
                    'status' => $statuses[$idx % count($statuses)],
                    'agent_id' => ($userIds['admin'] ?? $ownerUser)->id ?? null,
                    'society_id' => $society->id,
                ],
            );

            // Add 2 replies per ticket.
            $replyUser = $userIds['admin'] ?? $ownerUser;
            TicketReply::firstOrCreate(
                ['ticket_id' => $ticket->id, 'user_id' => $replyUser->id, 'message' => 'We have received your complaint and will look into it shortly.'],
                ['ticket_id' => $ticket->id, 'user_id' => $replyUser->id, 'message' => 'We have received your complaint and will look into it shortly.'],
            );
        }
    }

    /**
     * @param  array<string, User|null>  $userIds
     */
    private function seedVisitors(Society $society, array $userIds): void
    {
        $apartment = ApartmentManagement::where('society_id', $society->id)->first();
        $visitorType = VisitorTypeSettingsModel::where('society_id', $society->id)->first();
        $guardUser = $userIds['guard'] ?? $userIds['admin'];
        $ownerUser = $userIds['owner'] ?? $userIds['admin'];

        if (! $apartment || ! $visitorType || ! $guardUser) {
            return;
        }

        $visitors = [
            ['visitor_name' => 'Amit Sharma', 'phone_number' => '9876543210', 'purpose_of_visit' => 'Personal Visit'],
            ['visitor_name' => 'Priya Desai', 'phone_number' => '9876543211', 'purpose_of_visit' => 'Meeting'],
            ['visitor_name' => 'Rahul Verma', 'phone_number' => '9876543212', 'purpose_of_visit' => 'Delivery'],
        ];

        foreach ($visitors as $data) {
            VisitorManagement::firstOrCreate(
                ['visitor_name' => $data['visitor_name'], 'society_id' => $society->id],
                [
                    'phone_number' => $data['phone_number'],
                    'apartment_id' => $apartment->id,
                    'date_of_visit' => now()->subDays(rand(1, 30)),
                    'in_time' => now()->subHours(rand(1, 12))->format('H:i:s'),
                    'out_time' => now()->subHours(rand(0, 6))->format('H:i:s'),
                    'user_id' => $ownerUser->id ?? $guardUser->id,
                    'added_by' => $guardUser->id,
                    'status' => 'allowed',
                    'purpose_of_visit' => $data['purpose_of_visit'],
                    'visitor_type_id' => $visitorType->id,
                    'society_id' => $society->id,
                ],
            );
        }
    }

    private function seedServices(Society $society): void
    {
        $serviceTypes = [
            ['name' => 'Plumbing', 'icon' => 'wrench'],
            ['name' => 'Electrical', 'icon' => 'zap'],
            ['name' => 'Cleaning', 'icon' => 'sparkles'],
            ['name' => 'Security', 'icon' => 'shield'],
            ['name' => 'Landscaping', 'icon' => 'trees'],
        ];

        foreach ($serviceTypes as $typeData) {
            $serviceType = ServiceType::firstOrCreate(
                ['name' => $typeData['name'], 'society_id' => $society->id],
                ['icon' => $typeData['icon'], 'society_id' => $society->id],
            );

            // Create a service provider for each type.
            ServiceManagement::firstOrCreate(
                ['service_type_id' => $serviceType->id, 'company_name' => $typeData['name'].' Services', 'society_id' => $society->id],
                [
                    'contact_person_name' => fake()->name(),
                    'phone_number' => '987654'.rand(1000, 9999),
                    'price' => rand(500, 5000),
                    'description' => $typeData['name'].' service provider for the society.',
                    'status' => 'available',
                    'payment_frequency' => 'per_month',
                    'daily_help' => 0,
                    'society_id' => $society->id,
                ],
            );
        }
    }

    private function seedMaintenance(Society $society): void
    {
        $types = [
            ['cost_type' => 'fixedValue', 'unit_name' => 'Security Upgrade', 'set_value' => 50000],
            ['cost_type' => 'fixedValue', 'unit_name' => 'Garden Maintenance', 'set_value' => 25000],
            ['cost_type' => 'unitType', 'unit_name' => 'Monthly Sinking Fund', 'set_value' => 500],
            ['cost_type' => 'fixedValue', 'unit_name' => 'Lift Maintenance', 'set_value' => 30000],
            ['cost_type' => 'unitType', 'unit_name' => 'Common Area Electricity', 'set_value' => 200],
        ];

        foreach ($types as $data) {
            Maintenance::firstOrCreate(
                ['unit_name' => $data['unit_name'], 'society_id' => $society->id],
                [
                    'cost_type' => $data['cost_type'],
                    'set_value' => $data['set_value'],
                    'society_id' => $society->id,
                ],
            );
        }
    }

    private function seedRents(Society $society): void
    {
        $rentedApartments = ApartmentManagement::where('society_id', $society->id)
            ->where('status', 'rented')
            ->get();

        foreach ($rentedApartments as $apt) {
            $aptTenant = ApartmentTenant::where('apartment_id', $apt->id)->first();
            if (! $aptTenant) {
                continue;
            }

            for ($m = 0; $m < 3; $m++) {
                $month = now()->subMonths($m);
                $rent = $aptTenant->rent_amount ?? 2500;

                Rent::firstOrCreate(
                    [
                        'apartment_id' => $apt->id,
                        'tenant_id' => $aptTenant->tenant_id,
                        'rent_for_year' => $month->format('Y'),
                        'rent_for_month' => $month->format('m'),
                        'society_id' => $society->id,
                    ],
                    [
                        'rent_amount' => $rent,
                        'status' => $m === 0 ? 'paid' : (rand(0, 1) ? 'paid' : 'unpaid'),
                        'payment_date' => $m === 0 ? $month->format('Y-m-d') : null,
                        'society_id' => $society->id,
                    ],
                );
            }
        }
    }

    private function seedAssets(Society $society): void
    {
        $categories = ['Electronics', 'Furniture', 'Plumbing', 'Electrical', 'Safety'];

        foreach ($categories as $cat) {
            AssetsCategory::firstOrCreate(
                ['name' => $cat, 'society_id' => $society->id],
                ['name' => $cat, 'society_id' => $society->id],
            );
        }

        $assets = [
            ['name' => 'CCTV Camera - Main Gate', 'category' => 'Electronics', 'location' => 'Main Gate', 'condition' => 'good'],
            ['name' => 'Fire Extinguisher - Tower A', 'category' => 'Safety', 'location' => 'Tower A Lobby', 'condition' => 'good'],
            ['name' => 'Water Pump - Basement', 'category' => 'Plumbing', 'location' => 'Basement', 'condition' => 'fair'],
            ['name' => 'Generator Set', 'category' => 'Electrical', 'location' => 'Utility Room', 'condition' => 'good'],
            ['name' => 'Club House AC', 'category' => 'Electronics', 'location' => 'Club House', 'condition' => 'good'],
        ];

        $tower = Tower::where('society_id', $society->id)->first();
        $floor = Floor::where('society_id', $society->id)->first();

        foreach ($assets as $data) {
            $category = AssetsCategory::where('name', $data['category'])->where('society_id', $society->id)->first();
            if (! $category) {
                continue;
            }

            AssetManagement::firstOrCreate(
                ['name' => $data['name'], 'society_id' => $society->id],
                [
                    'category_id' => $category->id,
                    'location' => $data['location'],
                    'condition' => $data['condition'],
                    'tower_id' => $tower?->id,
                    'floor_id' => $floor?->id,
                    'purchase_date' => now()->subMonths(rand(6, 36))->format('Y-m-d'),
                    'society_id' => $society->id,
                ],
            );
        }
    }

    /**
     * @param  array<string, User|null>  $userIds
     */
    private function seedCommercialData(Society $society, array $userIds): void
    {
        // Buildings for commercial society.
        Building::firstOrCreate(
            ['name' => 'Main Commercial Block', 'society_id' => $society->id],
            ['description' => 'Primary commercial building with offices and retail spaces.', 'status' => 'active', 'society_id' => $society->id],
        );

        Building::firstOrCreate(
            ['name' => 'Annex Building', 'society_id' => $society->id],
            ['description' => 'Secondary building with warehouse and office spaces.', 'status' => 'active', 'society_id' => $society->id],
        );

        $building = Building::where('society_id', $society->id)->first();

        // Commercial tenants.
        $commercialTenants = [
            [
                'unit_number' => 'C-101',
                'unit_area' => 1200,
                'rent_amount' => 85000,
                'security_deposit' => 170000,
                'unit_type' => 'office',
                'company_name' => 'TechVision Solutions',
                'contact_name' => 'Rajesh Kumar',
                'email' => 'rajesh@techvision.demo.test',
            ],
            [
                'unit_number' => 'C-102',
                'unit_area' => 800,
                'rent_amount' => 60000,
                'security_deposit' => 120000,
                'unit_type' => 'retail',
                'company_name' => 'FreshMart Groceries',
                'contact_name' => 'Priya Patel',
                'email' => 'priya@freshmart.demo.test',
            ],
            [
                'unit_number' => 'W-01',
                'unit_area' => 3000,
                'rent_amount' => 150000,
                'security_deposit' => 300000,
                'unit_type' => 'warehouse',
                'company_name' => 'SwiftLogistics India',
                'contact_name' => 'Arun Mehta',
                'email' => 'arun@swiftlog.demo.test',
            ],
        ];

        foreach ($commercialTenants as $ctData) {
            $ct = CommercialTenant::firstOrCreate(
                ['unit_number' => $ctData['unit_number'], 'society_id' => $society->id],
                [
                    'building_id' => $building->id,
                    'unit_area' => $ctData['unit_area'],
                    'rent_amount' => $ctData['rent_amount'],
                    'security_deposit' => $ctData['security_deposit'],
                    'unit_type' => $ctData['unit_type'],
                    'status' => 'occupied',
                    'company_name' => $ctData['company_name'],
                    'contact_name' => $ctData['contact_name'],
                    'email' => $ctData['email'],
                    'society_id' => $society->id,
                ],
            );

            // Commercial units.
            CommercialUnit::firstOrCreate(
                ['unit_number' => $ctData['unit_number'], 'society_id' => $society->id],
                [
                    'building_id' => $building->id,
                    'commercial_tenant_id' => $ct->id,
                    'floor' => 1,
                    'area_sqft' => $ctData['unit_area'],
                    'unit_type' => $ctData['unit_type'],
                    'status' => 'occupied',
                    'monthly_rent' => $ctData['rent_amount'],
                    'society_id' => $society->id,
                ],
            );

            // Lease agreements.
            LeaseAgreement::firstOrCreate(
                ['commercial_tenant_id' => $ct->id, 'society_id' => $society->id],
                [
                    'user_id' => ($userIds['admin'] ?? $userIds['manager'])?->id,
                    'lease_number' => 'LEASE-'.$society->id.'-'.str_pad((string) $ct->id, 3, '0', STR_PAD_LEFT),
                    'start_date' => now()->subMonths(6)->format('Y-m-d'),
                    'end_date' => now()->addMonths(18)->format('Y-m-d'),
                    'monthly_rent' => $ctData['rent_amount'],
                    'security_deposit' => $ctData['security_deposit'],
                    'cam_charges' => 5000,
                    'rent_escalation_type' => 'percentage',
                    'escalation_value' => 5,
                    'escalation_frequency_months' => 12,
                    'status' => 'active',
                    'society_id' => $society->id,
                ],
            );
        }

        // Also seed residential-style data for commercial society (towers, floors, amenities, etc.).
        $this->seedNotices($society, $this->resolveRoles($society));
        $this->seedTickets($society, $userIds);
        $this->seedVisitors($society, $userIds);
        $this->seedServices($society);
        $this->seedAssets($society);
    }
}
