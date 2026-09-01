<?php

namespace App\Http\Controllers;

use App\Models\SocietyUser;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(): Response
    {
        $memberIds = SocietyUser::pluck('user_id')->unique()->values();

        return Inertia::render('members/index', [
            'members' => User::whereIn('id', $memberIds)->get(),
        ]);
    }
}
