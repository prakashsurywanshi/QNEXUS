<?php

namespace Tests\Feature\Crud;

use App\Models\Role;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Scopes\SocietyScope;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Member-facing society settings. A society's own Admin/Manager may view and
 * update their own society only; creating, deleting or targeting other
 * societies is a platform-level responsibility.
 */
class SocietiesCrudTest extends CrudTestCase
{
    public function test_index_renders_own_society_settings()
    {
        $this->get(route('societies.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('societies/index')
                ->where('society.id', $this->society->id));
    }

    public function test_owner_role_is_blocked_from_society_settings()
    {
        $owner = Role::withoutGlobalScope(SocietyScope::class)
            ->where('society_id', $this->society->id)
            ->where('display_name', 'Owner')
            ->firstOrFail();

        SocietyUser::where('user_id', $this->user->id)
            ->where('society_id', $this->society->id)
            ->update(['role_id' => $owner->id]);

        $this->user->update(['role_id' => $owner->id]);
        $this->app['session']->forget('context_user');

        $this->get(route('societies.index'))->assertForbidden();
    }

    public function test_editing_another_society_is_forbidden()
    {
        $other = Society::create(['name' => 'Other Society', 'property_type' => 'residential']);

        $this->get(route('societies.edit', $other))->assertForbidden();
        $this->put(route('societies.update', $other), [
            'name' => 'Hacked',
            'property_type' => 'residential',
        ])->assertForbidden();
    }

    public function test_admin_can_update_own_society()
    {
        $this->put(route('societies.update', $this->society), [
            'name' => 'Renamed Society',
            'property_type' => 'commercial',
            'show_logo_text' => true,
        ])->assertRedirect(route('societies.index'));

        $this->assertDatabaseHas('societies', [
            'id' => $this->society->id,
            'name' => 'Renamed Society',
            'property_type' => 'commercial',
        ]);
    }

    public function test_members_cannot_create_societies()
    {
        $this->get('/societies/create')->assertStatus(405);
        $this->post('/societies', [
            'name' => 'Member Created Society',
            'property_type' => 'residential',
        ])->assertStatus(405);
    }

    public function test_members_cannot_delete_societies()
    {
        $other = Society::create(['name' => 'To Delete', 'property_type' => 'residential']);

        $this->delete('/societies/'.$other->id)->assertStatus(405);

        $this->assertDatabaseHas('societies', ['id' => $other->id]);
    }

    public function test_admin_can_update_society_white_label_branding()
    {
        $this->put(route('societies.update', $this->society), [
            'name' => $this->society->name,
            'property_type' => 'residential',
            'theme_hex' => '#6d28d9',
            'theme_rgb' => '109 40 217',
            'show_logo_text' => true,
        ])->assertRedirect(route('societies.index'));

        $this->assertDatabaseHas('societies', [
            'id' => $this->society->id,
            'theme_hex' => '#6d28d9',
            'theme_rgb' => '109 40 217',
        ]);
    }

    public function test_invalid_brand_colour_is_rejected()
    {
        $this->put(route('societies.update', $this->society), [
            'name' => $this->society->name,
            'property_type' => 'residential',
            'theme_hex' => 'not-a-colour',
        ])->assertSessionHasErrors('theme_hex');
    }

    public function test_tenancy_share_exposes_white_label_branding()
    {
        $this->society->update([
            'theme_hex' => '#2563eb',
            'show_logo_text' => true,
        ]);

        $this->get(route('societies.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('societies/index')
                ->where('auth.user.name', $this->user->name)
                ->has('auth'));
    }

    public function test_society_logo_url_accessor()
    {
        $this->society->update(['logo' => 'society-logo.png']);

        $this->get(route('societies.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('societies/index')
                ->where('society.logo_url', Society::find($this->society->id)->logo_url));
    }
}
