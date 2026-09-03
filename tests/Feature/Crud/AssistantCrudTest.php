<?php

namespace Tests\Feature\Crud;

use Inertia\Testing\AssertableInertia as Assert;

class AssistantCrudTest extends CrudTestCase
{
    public function test_index_renders_assistant()
    {
        $this->get(route('assistant.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('assistant/index')
                ->has('suggestions'));
    }

    public function test_ask_returns_occupancy_answer()
    {
        $this->postJson(route('assistant.ask'), [
            'question' => 'What is the occupancy rate?',
        ])->assertOk()
            ->assertJsonStructure(['answer', 'intent'])
            ->assertJson(['intent' => 'occupancy']);
    }

    public function test_ask_returns_amc_answer()
    {
        $this->postJson(route('assistant.ask'), [
            'question' => 'Which AMCs expire next month?',
        ])->assertOk()
            ->assertJson(['intent' => 'amc_expiry']);
    }

    public function test_ask_returns_vehicles_answer()
    {
        $this->postJson(route('assistant.ask'), [
            'question' => 'How many vehicles are registered?',
        ])->assertOk()
            ->assertJson(['intent' => 'vehicles']);
    }

    public function test_ask_returns_fallback_for_unknown()
    {
        $this->postJson(route('assistant.ask'), [
            'question' => 'What is the meaning of life in this society?',
        ])->assertOk()
            ->assertJson(['intent' => 'fallback']);
    }
}
