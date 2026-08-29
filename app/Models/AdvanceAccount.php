<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvanceAccount extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'balance' => 'decimal:2',
        'last_updated' => 'datetime',
    ];

    public function apartment(): BelongsTo
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }

    public function hasBalance(): bool
    {
        return $this->balance > 0;
    }
}
