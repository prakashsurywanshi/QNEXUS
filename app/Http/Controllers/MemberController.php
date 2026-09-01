<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\SocietyUser;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(): Response
    {
        $memberIds = SocietyUser::where('society_id', active_society_id())->pluck('user_id')->unique()->values();

        return Inertia::render('members/index', [
            'members' => User::whereIn('id', $memberIds)->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('members/create', [
            'roles' => Role::get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['required', 'integer', 'exists:roles,id'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'phone_number' => $data['phone_number'] ?? null,
            'email' => $data['email'],
            'password' => $data['password'],
            'society_id' => active_society_id(),
        ]);

        SocietyUser::firstOrCreate([
            'user_id' => $user->id,
            'society_id' => active_society_id(),
        ], [
            'role_id' => $data['role_id'],
        ]);

        return redirect()->route('members.index');
    }

    public function edit(User $member): Response
    {
        return Inertia::render('members/edit', [
            'member' => $member,
            'roles' => Role::get(['id', 'name']),
            'memberRoleId' => SocietyUser::where('user_id', $member->id)
                ->where('society_id', active_society_id())
                ->value('role_id'),
        ]);
    }

    public function update(Request $request, User $member): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $member->id],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', 'string', 'min:8'],
            'role_id' => ['required', 'integer', 'exists:roles,id'],
        ]);

        $member->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'] ?? null,
        ]);
        if (!empty($data['password'])) {
            $member->password = $data['password'];
        }
        $member->save();

        SocietyUser::updateOrCreate(
            [
                'user_id' => $member->id,
                'society_id' => active_society_id(),
            ],
            [
                'role_id' => $data['role_id'],
            ]
        );

        return redirect()->route('members.index');
    }

    public function destroy(User $member): RedirectResponse
    {
        SocietyUser::where('user_id', $member->id)
            ->where('society_id', active_society_id())
            ->delete();

        return redirect()->route('members.index');
    }
}
