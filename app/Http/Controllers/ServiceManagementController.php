<?php

namespace App\Http\Controllers;

use App\Models\ServiceManagement;
use App\Models\ServiceType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ServiceManagementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('service-management/index', [
            'services' => ServiceManagement::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('service-management/create', [
            'serviceTypes' => ServiceType::get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateService($request);

        $service = new ServiceManagement();
        $this->persist($service, $data);

        return redirect()->route('service-management.index');
    }

    public function edit(ServiceManagement $service): Response
    {
        return Inertia::render('service-management/edit', [
            'service' => $service,
            'serviceTypes' => ServiceType::get(['id', 'name']),
        ]);
    }

    public function update(Request $request, ServiceManagement $service): RedirectResponse
    {
        $this->persist($service, $this->validateService($request));

        return redirect()->route('service-management.index');
    }

    public function destroy(ServiceManagement $service): RedirectResponse
    {
        $service->delete();

        return redirect()->route('service-management.index');
    }

    private function validateService(Request $request): array
    {
        return $request->validate([
            'service_type_id' => ['required', 'integer', 'exists:service_type,id'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'contact_person_name' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'website_link' => ['nullable', 'url', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'payment_frequency' => ['nullable', Rule::in(['per_visit', 'per_hour', 'per_day', 'per_week', 'per_month', 'per_year'])],
            'status' => ['required', Rule::in(['available', 'not_available'])],
            'daily_help' => ['boolean'],
            'description' => ['nullable', 'string'],
        ]);
    }

    private function persist(ServiceManagement $service, array $data): void
    {
        $service->service_type_id = $data['service_type_id'];
        $service->company_name = $data['company_name'] ?? null;
        $service->contact_person_name = $data['contact_person_name'] ?? null;
        $service->phone_number = $data['phone_number'] ?? null;
        $service->website_link = $data['website_link'] ?? null;
        $service->price = $data['price'] ?? 0;
        $service->payment_frequency = $data['payment_frequency'] ?? 'per_visit';
        $service->status = $data['status'];
        $service->daily_help = $data['daily_help'] ?? false;
        $service->description = $data['description'] ?? null;
        if (!$service->society_id) {
            $service->society_id = active_society_id();
        }
        $service->save();
    }
}
