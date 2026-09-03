<?php

namespace App\Http\Controllers;

use App\Models\Automation;
use App\Models\AutomationRun;
use App\Services\AutomationEngine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AutomationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('automations/index', [
            'automations' => Automation::latest()->get(),
            'recentRuns' => AutomationRun::with('automation')->latest('fired_at')->limit(10)->get(),
            'triggerEvents' => [
                'visitor_qr_expires',
                'complaint_sla',
                'maintenance_overdue',
                'amc_expiring',
                'lease_expiring',
            ],
            'actions' => [
                'notify_facility_manager',
                'notify_accounts',
                'deactivate_access',
                'send_reminder',
                'escalate_manager',
            ],
        ]);
    }

    public function run(AutomationEngine $engine): RedirectResponse
    {
        $fired = $engine->runNow((int) active_society_id());

        return redirect()->route('automations.index')
            ->with('status', "Automation check complete: {$fired} rule(s) fired.");
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'trigger_event' => ['required', Rule::in(['visitor_qr_expires', 'complaint_sla', 'maintenance_overdue', 'amc_expiring', 'lease_expiring'])],
            'trigger_conditions' => ['nullable', 'string'],
            'action' => ['required', Rule::in(['notify_facility_manager', 'notify_accounts', 'deactivate_access', 'send_reminder', 'escalate_manager'])],
            'action_config' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        Automation::create([
            'society_id' => active_society_id(),
            'name' => $data['name'],
            'trigger_event' => $data['trigger_event'],
            'trigger_conditions' => $data['trigger_conditions'] ?? null,
            'action' => $data['action'],
            'action_config' => $data['action_config'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return redirect()->route('automations.index');
    }

    public function toggle(Automation $automation): RedirectResponse
    {
        $automation->update([
            'is_active' => ! $automation->is_active,
        ]);

        return redirect()->route('automations.index');
    }

    public function destroy(Automation $automation): RedirectResponse
    {
        $automation->delete();

        return redirect()->route('automations.index');
    }
}
