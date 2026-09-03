<?php

namespace Tests\Feature\Crud;

/**
 * @mixin CrudTestCase
 */
class ServiceRequestsCrudTest extends CrudTestCase
{
    public function test_index_renders_service_requests_page(): void
    {
        $this->get(route('service-requests.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('service-requests/index'));
    }

    public function test_store_creates_service_request(): void
    {
        $this->post(route('service-requests.store'), [
            'subject' => 'Fix leaking tap',
            'description' => 'Kitchen tap leaking for two days.',
            'service_type' => 'Plumbing',
            'priority' => 'high',
        ])->assertRedirect(route('service-requests.index'));

        $this->assertDatabaseHas('service_requests', [
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'subject' => 'Fix leaking tap',
            'service_type' => 'Plumbing',
            'priority' => 'high',
            'status' => 'request',
        ]);
    }

    public function test_quote_transitions_request_to_quoted(): void
    {
        $request = $this->createServiceRequest();

        $this->post(route('service-requests.quote', $request), [
            'quote_amount' => 500,
            'quote_notes' => 'Parts included',
        ])->assertRedirect(route('service-requests.show', $request));

        $this->assertDatabaseHas('service_requests', [
            'id' => $request->id,
            'status' => 'quoted',
            'quote_amount' => 500,
        ]);
    }

    public function test_advance_moves_approved_to_assigned(): void
    {
        $request = $this->createServiceRequest(['status' => 'approved']);

        $this->post(route('service-requests.advance', $request))
            ->assertRedirect(route('service-requests.show', $request));

        $this->assertDatabaseHas('service_requests', [
            'id' => $request->id,
            'status' => 'assigned',
        ]);
    }

    public function test_reply_creates_service_request_reply(): void
    {
        $request = $this->createServiceRequest();

        $this->post(route('service-requests.reply', $request), [
            'message' => 'We will send a plumber.',
        ]);

        $this->assertDatabaseHas('service_request_replies', [
            'service_request_id' => $request->id,
            'user_id' => $this->user->id,
            'message' => 'We will send a plumber.',
        ]);
    }

    public function test_destroy_deletes_service_request(): void
    {
        $request = $this->createServiceRequest();

        $this->delete(route('service-requests.destroy', $request))
            ->assertRedirect(route('service-requests.index'));

        $this->assertDatabaseMissing('service_requests', ['id' => $request->id]);
    }

    public function test_update_can_complete_request_with_feedback(): void
    {
        $request = $this->createServiceRequest(['status' => 'feedback']);

        $this->put(route('service-requests.update', $request), [
            'rating' => 5,
            'feedback' => 'Great work!',
            'payment_amount' => 450,
            'payment_status' => 'paid',
        ])->assertRedirect(route('service-requests.show', $request));

        $this->assertDatabaseHas('service_requests', [
            'id' => $request->id,
            'rating' => 5,
            'feedback' => 'Great work!',
            'payment_status' => 'paid',
        ]);
    }
}
