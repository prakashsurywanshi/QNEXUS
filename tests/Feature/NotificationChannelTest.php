<?php

namespace Tests\Feature;

use App\Models\NotificationTemplate;
use App\Models\Society;
use App\Models\User;
use Database\Seeders\ModuleSeeder;
use Database\Seeders\NotificationTemplateSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationChannelTest extends TestCase
{
    use RefreshDatabase;

    public function test_template_token_substitution(): void
    {
        $template = NotificationTemplate::create([
            'key' => 'test_greeting',
            'category' => 'system',
            'title' => 'Hello :name',
            'body' => 'Your :subject is ready for :audience.',
        ]);

        $this->assertSame('Hello Prakash', $template->resolveTitle(['name' => 'Prakash']));
        $this->assertSame('Your Report is ready for Review.', $template->resolveBody(['subject' => 'Report', 'audience' => 'Review']));
    }

    public function test_seed_materialises_default_templates(): void
    {
        $this->seed(ModuleSeeder::class);
        $this->seed(PermissionSeeder::class);
        (new RoleSeeder)->run(Society::create(['name' => 'Templates']));

        $this->seed(NotificationTemplateSeeder::class);

        $this->assertNotEmpty(NotificationTemplate::where('key', 'work_order_assigned')->exists());
        $this->assertNotEmpty(NotificationTemplate::where('key', 'maintenance_overdue')->exists());
    }

    public function test_user_can_register_a_push_subscription(): void
    {
        $this->seed(ModuleSeeder::class);
        $this->seed(PermissionSeeder::class);
        $society = Society::create(['name' => 'Push Society']);
        (new RoleSeeder)->run($society);

        $user = User::factory()->create(['society_id' => $society->id]);

        $this->actingAs($user)
            ->postJson(route('push-subscriptions.store'), [
                'endpoint' => 'https://push.example.com/sub/abc-123',
                'public_key' => 'BK_public_key',
                'auth_token' => 'auth-token-123',
            ])
            ->assertOk();

        $this->assertDatabaseHas('push_notifications', [
            'user_id' => $user->id,
            'endpoint' => 'https://push.example.com/sub/abc-123',
            'society_id' => $society->id,
        ]);
    }

    public function test_push_subscription_requires_valid_endpoint(): void
    {
        $this->seed(ModuleSeeder::class);
        $this->seed(PermissionSeeder::class);
        $society = Society::create(['name' => 'Push Society']);
        (new RoleSeeder)->run($society);
        $user = User::factory()->create(['society_id' => $society->id]);

        $this->actingAs($user)
            ->postJson(route('push-subscriptions.store'), [
                'endpoint' => 'not-a-url',
                'public_key' => 'k',
                'auth_token' => 't',
            ])
            ->assertStatus(422);
    }
}
