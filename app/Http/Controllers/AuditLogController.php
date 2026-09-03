<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('audit-logs/index', [
            'logs' => AuditLog::with(['user'])->latest()->limit(500)->get(),
        ]);
    }
}
