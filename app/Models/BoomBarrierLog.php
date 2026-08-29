<?php

namespace App\Models;

use App\Traits\HasSociety;
use App\Services\QrCodeService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoomBarrierLog extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($log) {
            if (empty($log->qr_code)) {
                $log->qr_code = app(QrCodeService::class)->token();
            }
        });
    }

    public function triggeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'triggered_by');
    }

    public function visitorPreapproval(): BelongsTo
    {
        return $this->belongsTo(VisitorPreapproval::class, 'visitor_preapproval_id');
    }
}