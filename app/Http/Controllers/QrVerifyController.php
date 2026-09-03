<?php

namespace App\Http\Controllers;

use App\Models\Gatepass;
use App\Models\VisitorPreapproval;
use App\Scopes\SocietyScope;
use Illuminate\Contracts\View\View;

class QrVerifyController extends Controller
{
    public function __invoke(string $token): View
    {
        $gatepass = Gatepass::withoutGlobalScope(SocietyScope::class)
            ->where('qr_code', $token)
            ->first();

        $preapproval = VisitorPreapproval::withoutGlobalScope(SocietyScope::class)
            ->where('qr_code', $token)
            ->first();

        if ($gatepass) {
            return view('qr.verify', [
                'valid' => $gatepass->society_id !== null,
                'type' => 'Gatepass',
                'reference' => 'GPS-'.$gatepass->id,
                'item' => $gatepass->item_description,
                'status' => $gatepass->status,
            ]);
        }

        if ($preapproval) {
            return view('qr.verify', [
                'valid' => true,
                'type' => 'Visitor Pre-approval',
                'reference' => 'VIP-'.$preapproval->id,
                'item' => $preapproval->visitor_name,
                'status' => $preapproval->isExpired() ? 'expired' : $preapproval->status,
            ]);
        }

        return view('qr.verify', [
            'valid' => false,
            'type' => null,
            'reference' => null,
            'item' => null,
            'status' => null,
        ]);
    }
}
