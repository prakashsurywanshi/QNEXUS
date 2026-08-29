<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GlobalSubscription extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'ends_at' => 'datetime',
        'subscribed_on_date' => 'datetime',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'package_id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    public function society(): BelongsTo
    {
        return $this->belongsTo(Society::class, 'society_id');
    }
}