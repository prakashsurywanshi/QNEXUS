<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Meter extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    public function readings(): HasMany
    {
        return $this->hasMany(PrepaidMeterReading::class, 'meter_id');
    }

    public function apartment(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }
}