<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Inertia\Inertia;
use Inertia\Response;

class NoticeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('notices/index', [
            'notices' => Notice::get(),
        ]);
    }
}
