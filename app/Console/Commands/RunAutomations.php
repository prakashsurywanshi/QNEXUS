<?php

namespace App\Console\Commands;

use App\Models\Society;
use App\Services\AutomationEngine;
use Illuminate\Console\Command;

class RunAutomations extends Command
{
    protected $signature = 'automations:run {--society= : Only run for this society ID}';

    protected $description = 'Evaluate active automation rules and fire trigger→action rules';

    public function handle(AutomationEngine $engine): int
    {
        $societyId = $this->option('society');

        if ($societyId) {
            $fired = $engine->runForSociety((int) $societyId);

            $this->info("Ran automations for society {$societyId}: {$fired} fired.");

            return self::SUCCESS;
        }

        $total = 0;
        $societies = 0;

        Society::pluck('id')->each(function ($id) use ($engine, &$total, &$societies) {
            $total += $engine->runForSociety((int) $id);
            $societies++;
        });

        $this->info("Ran automations across {$societies} societies: {$total} fired.");

        return self::SUCCESS;
    }
}
