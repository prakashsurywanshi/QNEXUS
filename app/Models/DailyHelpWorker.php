<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DailyHelpWorker extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'rate_per_visit' => 'decimal:2',
        'rating' => 'decimal:2',
        'availability' => 'array',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(DailyHelpBooking::class, 'worker_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeByServiceType($query, string $type)
    {
        return $query->where('service_type', $type);
    }
}