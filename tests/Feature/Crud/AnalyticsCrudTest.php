<?php

namespace Tests\Feature\Crud;

use Inertia\Testing\AssertableInertia as Assert;

class AnalyticsCrudTest extends CrudTestCase
{
    public function test_index_renders_analytics()
    {
        $this->get(route('analytics.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('analytics/index')
                ->hasAll([
                    'occupancy.total',
                    'occupancy.occupied',
                    'occupancy.vacant',
                    'occupancy.occupancy_rate',
                    'occupancy.byStatus',
                    'tickets.total',
                    'tickets.byStatus',
                    'workOrders.total',
                    'workOrders.byStatus',
                    'visitors.total',
                    'visitors.trend',
                    'finance.billed',
                    'finance.collected',
                    'community.events',
                    'operations.vehicles',
                    'operations.staff',
                ]));
    }
}
