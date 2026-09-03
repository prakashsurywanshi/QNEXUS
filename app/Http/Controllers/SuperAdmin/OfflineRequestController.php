<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\OfflinePlanChange;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfflineRequestController extends Controller
{
    /**
     * List offline plan-change approval requests.
     */
    public function index(): Response
    {
        $requests = OfflinePlanChange::with(['society:id,name', 'package:id,package_name'])
            ->latest('id')
            ->get();

        return Inertia::render('superadmin/offline-requests/index', [
            'requests' => $requests,
        ]);
    }

    /**
     * Approve a pending offline plan change.
     */
    public function verify(Request $request, OfflinePlanChange $offlinePlanChange): RedirectResponse
    {
        if ($offlinePlanChange->status === 'pending') {
            $offlinePlanChange->update([
                'status' => 'verified',
                'remark' => $request->input('remark'),
            ]);
        }

        return redirect()->route('superadmin.offline-requests.index');
    }

    /**
     * Reject a pending offline plan change.
     */
    public function reject(Request $request, OfflinePlanChange $offlinePlanChange): RedirectResponse
    {
        if ($offlinePlanChange->status === 'pending') {
            $offlinePlanChange->update([
                'status' => 'rejected',
                'remark' => $request->input('remark'),
            ]);
        }

        return redirect()->route('superadmin.offline-requests.index');
    }
}
