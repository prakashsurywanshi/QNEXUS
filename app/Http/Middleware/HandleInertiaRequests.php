<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'isSuperadmin' => fn () => $request->user() !== null && is_null($request->user()->society_id),
            'globalSettings' => fn () => \global_setting(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'impersonate' => fn () => [
                'active' => $request->session()->has('impersonate_user_id'),
                'society_id' => $request->session()->get('impersonate_society_id'),
                'stop_url' => route('superadmin.stop-impersonate'),
            ],
            'notifications' => fn () => $request->user()
                ? [
                    'unread_count' => $request->user()->unreadNotifications()->count(),
                    'items' => $request->user()->notifications()->latest()->limit(8)->get()
                        ->map(fn ($n) => [
                            'id' => $n->id,
                            'title' => $n->data['title'] ?? 'Notification',
                            'body' => $n->data['body'] ?? null,
                            'link' => $n->data['link'] ?? null,
                            'read_at' => $n->read_at,
                            'created_at' => $n->created_at,
                        ]),
                ]
                : ['unread_count' => 0, 'items' => []],
        ];
    }
}
