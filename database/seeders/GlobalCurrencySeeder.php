<?php

namespace Database\Seeders;

use App\Models\GlobalCurrency;
use App\Models\GlobalSetting;
use Illuminate\Database\Seeder;

class GlobalCurrencySeeder extends Seeder
{
    /**
     * Provision the global currencies and lock INR in as the default.
     */
    public function run(): void
    {
        $inr = $this->firstOrCreateSymbol('₹', [
            'currency_name' => 'Indian Rupee',
            'currency_symbol' => '₹',
            'currency_code' => 'INR',
            'exchange_rate' => 1,
            'usd_price' => 0.012,
            'is_cryptocurrency' => 'no',
            'currency_position' => 'left',
            'no_of_decimal' => 2,
            'thousand_separator' => ',',
            'decimal_separator' => '.',
            'status' => 'enable',
        ]);

        $this->firstOrCreateSymbol('$', [
            'currency_name' => 'US Dollar',
            'currency_symbol' => '$',
            'currency_code' => 'USD',
            'exchange_rate' => 83,
            'usd_price' => 1,
            'is_cryptocurrency' => 'no',
            'currency_position' => 'left',
            'no_of_decimal' => 2,
            'thousand_separator' => ',',
            'decimal_separator' => '.',
            'status' => 'enable',
        ]);

        $settings = GlobalSetting::first();

        if ($settings && ! $settings->default_currency_id) {
            $settings->update(['default_currency_id' => $inr->id]);
        }
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function firstOrCreateSymbol(string $symbol, array $attributes): GlobalCurrency
    {
        return GlobalCurrency::firstOrCreate(['currency_symbol' => $symbol], $attributes);
    }
}
