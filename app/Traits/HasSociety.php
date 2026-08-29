<?php

namespace App\Traits;

use App\Models\Society;
use App\Scopes\SocietyScope;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasSociety
{
    protected static function booted(): void
    {
        static::addGlobalScope(new SocietyScope());
    }

    public function society(): BelongsTo
    {
        return $this->belongsTo(Society::class);
    }
}
