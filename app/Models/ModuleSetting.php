<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleSetting extends Model
{
    protected $guarded = ['id'];

    public function society(): BelongsTo
    {
        return $this->belongsTo(Society::class);
    }
}
