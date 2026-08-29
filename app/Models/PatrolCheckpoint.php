<?php

namespace App\Models;

use App\Traits\HasSociety;
use App\Services\QrCodeService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PatrolCheckpoint extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($checkpoint) {
            if (empty($checkpoint->qr_code)) {
                $checkpoint->qr_code = app(QrCodeService::class)->token();
            }
        });
    }

    public function patrolLogs(): HasMany
    {
        return $this->hasMany(PatrolLog::class, 'checkpoint_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}