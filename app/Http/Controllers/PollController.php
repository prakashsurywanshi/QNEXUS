<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use Inertia\Inertia;
use Inertia\Response;

class PollController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('polls/index', [
            'polls' => Poll::get(),
        ]);
    }
}
