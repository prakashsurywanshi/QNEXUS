<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrepaidMeterReading extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'previous_reading' => 'decimal:4',
        'current_reading' => 'decimal:4',
        'units_consumed' => 'decimal:4',
        'amount' => 'decimal:2',
        'balance' => 'decimal:2',
        'reading_date' => 'datetime',
    ];

    public function apartment(): BelongsTo
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }

    public function meter(): BelongsTo
    {
        return $this->belongsTo(Meter::class, 'meter_id');
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}