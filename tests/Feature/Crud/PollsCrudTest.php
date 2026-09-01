<?php

namespace Tests\Feature\Crud;

use App\Models\Poll;
use App\Models\PollOption;
use Inertia\Testing\AssertableInertia as Assert;

class PollsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('polls.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('polls/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('polls.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('polls.store'), [
            'poll_type' => 'normal',
            'status' => 'draft',
        ])->assertSessionHasErrors('title');
    }

    public function test_can_create_poll_with_options()
    {
        $this->post(route('polls.store'), [
            'title' => 'New gym timings?',
            'description' => 'Vote for preferred morning slot.',
            'poll_type' => 'normal',
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-10',
            'status' => 'active',
            'results_visible' => true,
            'options' => ['06:00 AM', '07:00 AM'],
        ])->assertRedirect(route('polls.index'));

        $poll = Poll::where('title', 'New gym timings?')->firstOrFail();

        $this->assertSame($this->society->id, $poll->society_id);
        $this->assertSame($this->user->id, $poll->created_by);
        $this->assertSame(['06:00 AM', '07:00 AM'], $poll->options()->pluck('option_text')->all());
    }

    public function test_can_update_poll_and_sync_options()
    {
        $poll = Poll::create([
            'society_id' => $this->society->id,
            'title' => 'Old question?',
            'poll_type' => 'normal',
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-05',
            'status' => 'draft',
            'results_visible' => true,
            'created_by' => $this->user->id,
        ]);
        PollOption::create(['poll_id' => $poll->id, 'option_text' => 'Option A', 'sort_order' => 0]);

        $this->put(route('polls.update', $poll), [
            'title' => 'New question?',
            'poll_type' => 'secret',
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-08',
            'status' => 'closed',
            'results_visible' => false,
            'options' => ['Option B', 'Option C', 'Option D'],
        ])->assertRedirect(route('polls.index'));

        $poll->refresh();

        $this->assertSame('New question?', $poll->title);
        $this->assertSame('closed', $poll->status);
        $this->assertSame(['Option B', 'Option C', 'Option D'], $poll->options()->pluck('option_text')->all());
    }

    public function test_can_delete_poll()
    {
        $poll = Poll::create([
            'society_id' => $this->society->id,
            'title' => 'Disposable question?',
            'poll_type' => 'normal',
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-05',
            'status' => 'draft',
            'results_visible' => true,
            'created_by' => $this->user->id,
        ]);

        $this->delete(route('polls.destroy', $poll))
            ->assertRedirect(route('polls.index'));

        $this->assertDatabaseMissing('polls', ['id' => $poll->id]);
    }
}