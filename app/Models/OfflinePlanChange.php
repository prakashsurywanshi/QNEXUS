<?php

namespace App\Models;

use App\Scopes\SocietyScope;
use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfflinePlanChange extends Model
{
    use HasSociety;

    const FILE_PATH = 'offline-invoice';

    protected $guarded = ['id'];

    protected $dates = [
        'pay_date',
        'next_pay_date'
    ];

    protected $casts = [
        'pay_date' => 'datetime',
        'next_pay_date' => 'datetime',
    ];

    protected $appends = ['file'];

    public function society(): BelongsTo
    {
        return $this->belongsTo(Society::class, 'society_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'package_id');
    }

    public function offlineMethod(): BelongsTo
    {
        return $this->belongsTo(OfflinePaymentMethod::class, 'offline_method_id')->withoutGlobalScope(SocietyScope::class);
    }

    public function getFileAttribute()
    {
        return ($this->file_name) ? asset_url_local_s3(OfflinePlanChange::FILE_PATH . '/' . $this->file_name) : asset('img/default-profile-3.png');
    }
}