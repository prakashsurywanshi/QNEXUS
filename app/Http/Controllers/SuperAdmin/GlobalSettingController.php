<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\GlobalCurrency;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GlobalSettingController extends Controller
{
    public function edit(): Response
    {
        abort_unless(global_setting() !== null, 404);

        return Inertia::render('superadmin/settings', [
            'settings' => \global_setting(),
            'currencies' => GlobalCurrency::get(['id', 'currency_name', 'currency_symbol', 'currency_code', 'status']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $settings = global_setting();
        abort_unless($settings !== null, 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'locale' => ['nullable', 'string', 'max:20'],
            'timezone' => ['nullable', 'string', 'max:100'],
            'default_currency_id' => ['nullable', 'integer', 'exists:global_currencies,id'],
            'disable_landing_site' => ['boolean'],
            'landing_site_type' => ['required', Rule::in(['theme', 'custom'])],
            'landing_site_url' => ['nullable', 'url'],
            'show_logo_text' => ['boolean'],
            'facebook_link' => ['nullable', 'url'],
            'instagram_link' => ['nullable', 'url'],
            'twitter_link' => ['nullable', 'url'],
            'meta_keyword' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ]);

        $settings->update($data);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Global settings updated.',
        ]);
    }
}
