<?php

namespace Tests\Feature\Crud;

use App\Services\Notifier;

class NotificationPreferencesCrudTest extends CrudTestCase
{
    public function test_index_returns_all_categories()
    {
        $response = $this->getJson(route('notification-preferences.index'))
            ->assertOk();

        $categories = $response->json('categories');

        $this->assertNotEmpty($categories);
        $this->assertEquals('work_orders', $categories[0]['category']);
        $this->assertArrayHasKey('label', $categories[0]);
        $this->assertFalse($categories[0]['muted']);
    }

    public function test_can_mute_a_category()
    {
        $response = $this->putJson(route('notification-preferences.update', 'tickets'), [
            'muted' => true,
        ])->assertOk();

        $this->assertTrue($response->json('muted'));
        $this->assertTrue($response->json('suppressed'));

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $this->user->id,
            'category' => 'tickets',
            'muted' => true,
            'snooze_until' => null,
        ]);
    }

    public function test_can_snooze_a_category()
    {
        $response = $this->putJson(route('notification-preferences.update', 'notices'), [
            'snooze' => '24h',
        ])->assertOk();

        $this->assertFalse($response->json('muted'));
        $this->assertNotNull($response->json('snooze_until'));
        $this->assertTrue($response->json('suppressed'));
    }

    public function test_snooze_overrides_mute_when_resumed()
    {
        $this->putJson(route('notification-preferences.update', 'security'), ['muted' => true]);
        $response = $this->putJson(route('notification-preferences.update', 'security'), [
            'snooze' => 'none',
        ])->assertOk();

        $this->assertFalse($response->json('suppressed'));
        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $this->user->id,
            'category' => 'security',
            'muted' => false,
            'snooze_until' => null,
        ]);
    }

    public function test_unknown_category_is_rejected()
    {
        $this->putJson(route('notification-preferences.update', 'not-a-category'), [
            'muted' => true,
        ])->assertStatus(422);
    }

    public function test_can_toggle_delivery_channels()
    {
        $response = $this->putJson(route('notification-preferences.update', 'work_orders'), [
            'email_enabled' => true,
            'push_enabled' => false,
            'sms_enabled' => true,
        ])->assertOk();

        $this->assertTrue($response->json('email_enabled'));
        $this->assertFalse($response->json('push_enabled'));
        $this->assertTrue($response->json('sms_enabled'));

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $this->user->id,
            'category' => 'work_orders',
            'email_enabled' => true,
            'push_enabled' => false,
            'sms_enabled' => true,
        ]);
    }

    public function test_index_exposes_channel_defaults()
    {
        $categories = $this->getJson(route('notification-preferences.index'))
            ->assertOk()
            ->json('categories');

        $this->assertTrue($categories[0]['email_enabled']);
        $this->assertTrue($categories[0]['push_enabled']);
        $this->assertFalse($categories[0]['sms_enabled']);
    }

    public function test_muted_category_prevents_notification_creation()
    {
        $this->putJson(route('notification-preferences.update', 'tickets'), ['muted' => true]);

        Notifier::notify($this->user, 'tickets', ['title' => 'Should be suppressed']);

        $this->assertDatabaseCount('notifications', 0);
    }

    public function test_channel_disabled_still_writes_in_app_notification()
    {
        $this->putJson(route('notification-preferences.update', 'notices'), [
            'email_enabled' => false,
            'push_enabled' => false,
        ]);

        Notifier::notify($this->user, 'notices', ['title' => 'In-app notice']);

        $this->assertDatabaseCount('notifications', 1);
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->user->id,
        ]);
    }
}
