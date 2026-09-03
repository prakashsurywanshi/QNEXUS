<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Meter extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    /** @return HasMany<PrepaidMeterReading, $this> */
    public function readings(): HasMany
    {
        return $this->hasMany(PrepaidMeterReading::class, 'meter_id');
    }

    /** @return HasMany<MeterTopup, $this> */
    public function topups(): HasMany
    {
        return $this->hasMany(MeterTopup::class);
    }

    /** @return BelongsTo<ApartmentManagement, $this> */
    public function apartment(): BelongsTo
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }
}
