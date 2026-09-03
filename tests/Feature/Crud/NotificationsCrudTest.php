<?php

namespace Tests\Feature\Crud;

use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

class NotificationsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('notifications.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('notifications/index'));
    }

    public function test_index_shows_user_notification()
    {
        $this->user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\Informational',
            'data' => ['title' => 'Maintenance due', 'body' => 'Your AMC expires soon.'],
        ]);

        $this->get(route('notifications.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('notifications/index')
                ->has('notifications', 1)
                ->where('notifications.0.title', 'Maintenance due'));
    }

    public function test_mark_all_read_updates_read_at()
    {
        $this->user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\Informational',
            'data' => ['title' => 'Read me'],
        ]);
        $this->user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\Informational',
            'data' => ['title' => 'Also me'],
        ]);

        $this->patch(route('notifications.read-all'))
            ->assertRedirect(route('notifications.index'));

        $this->assertDatabaseCount('notifications', 2);
        $this->assertSame(
            0,
            $this->user->unreadNotifications()->count()
        );
    }

    public function test_mark_single_read_updates_read_at()
    {
        $notification = $this->user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\Informational',
            'data' => ['title' => 'Solo'],
        ]);

        $this->patch(route('notifications.read', $notification->id))
            ->assertRedirect(route('notifications.index'));

        $this->assertSame(0, $this->user->unreadNotifications()->count());
    }
}