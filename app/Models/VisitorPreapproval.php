<?php

namespace App\Models;

use App\Traits\HasSociety;
use App\Services\QrCodeService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitorPreapproval extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'expected_arrival' => 'datetime',
        'expires_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($preapproval) {
            if (empty($preapproval->qr_code)) {
                $preapproval->qr_code = app(QrCodeService::class)->token();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function apartment(): BelongsTo
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}