<?php

namespace Tests\Feature\Crud;

use App\Models\Staff;
use App\Models\StaffClockLog;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class StaffCrudTest extends CrudTestCase
{
    protected function createStaff(): Staff
    {
        return Model::unguarded(fn () => Staff::create([
            'society_id' => $this->society->id,
            'name' => 'Ramesh Kumar',
            'designation' => 'Security Guard',
            'shift' => 'morning',
            'is_active' => true,
        ]));
    }

    public function test_index_renders_list()
    {
        $this->get(route('staff.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('staff/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('staff.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('staff/create'));
    }

    public function test_can_create_staff()
    {
        $this->post(route('staff.store'), [
            'name' => 'Suresh Kumar',
            'phone' => '+91 9876543210',
            'email' => 'suresh@example.com',
            'designation' => 'Housekeeping',
            'shift' => 'evening',
            'date_joined' => now()->format('Y-m-d'),
            'is_active' => true,
        ])->assertRedirect(route('staff.index'));

        $this->assertDatabaseHas('staff', [
            'name' => 'Suresh Kumar',
            'designation' => 'Housekeeping',
            'shift' => 'evening',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_staff()
    {
        $staff = $this->createStaff();

        $this->put(route('staff.update', $staff), [
            'name' => 'Ramesh Kumar',
            'designation' => 'Security Guard',
            'shift' => 'night',
            'is_active' => true,
        ])->assertRedirect(route('staff.index'));

        $this->assertDatabaseHas('staff', [
            'id' => $staff->id,
            'shift' => 'night',
        ]);
    }

    public function test_edit_page_renders()
    {
        $staff = $this->createStaff();

        $this->get(route('staff.edit', $staff))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('staff/edit'));
    }

    public function test_can_delete_staff()
    {
        $staff = $this->createStaff();

        $this->delete(route('staff.destroy', $staff))
            ->assertRedirect(route('staff.index'));

        $this->assertDatabaseMissing('staff', ['id' => $staff->id]);
    }

    public function test_attendance_page_renders()
    {
        $staff = $this->createStaff();

        $this->get(route('staff.attendance', $staff))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('staff/attendance'));
    }

    public function test_can_clock_in()
    {
        $staff = $this->createStaff();

        $this->post(route('staff.attendance.store', $staff), [
            'date' => now()->format('Y-m-d'),
        ])->assertRedirect(route('staff.attendance', $staff));

        $this->assertDatabaseHas('staff_clock_logs', [
            'staff_id' => $staff->id,
            'status' => 'checked_in',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_clock_out()
    {
        $staff = $this->createStaff();

        $log = Model::unguarded(fn () => StaffClockLog::create([
            'society_id' => $this->society->id,
            'staff_id' => $staff->id,
            'recorded_by' => $this->user->id,
            'date' => now()->format('Y-m-d'),
            'check_in_time' => now()->subHours(3),
            'status' => 'checked_in',
        ]));

        $this->put(route('staff.attendance.update', [$staff, $log]))
            ->assertRedirect(route('staff.attendance', $staff));

        $this->assertDatabaseHas('staff_clock_logs', [
            'id' => $log->id,
            'status' => 'checked_out',
        ]);
    }

    public function test_can_delete_clock_log()
    {
        $staff = $this->createStaff();

        $log = Model::unguarded(fn () => StaffClockLog::create([
            'society_id' => $this->society->id,
            'staff_id' => $staff->id,
            'recorded_by' => $this->user->id,
            'date' => now()->format('Y-m-d'),
            'check_in_time' => now(),
            'check_out_time' => now(),
            'duration_minutes' => 120,
            'status' => 'checked_out',
        ]));

        $this->delete(route('staff.attendance.destroy', [$staff, $log]))
            ->assertRedirect(route('staff.attendance', $staff));

        $this->assertDatabaseMissing('staff_clock_logs', ['id' => $log->id]);
    }
}
