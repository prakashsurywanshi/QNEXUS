<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceRequest extends Model
{
    use HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'quote_amount' => 'decimal:2',
        'payment_amount' => 'decimal:2',
        'quote_valid_until' => 'date',
        'scheduled_date' => 'date',
        'completed_at' => 'datetime',
        'rating' => 'integer',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<User, $this> */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /** @return BelongsTo<ServiceManagement, $this> */
    public function serviceProvider(): BelongsTo
    {
        return $this->belongsTo(ServiceManagement::class, 'service_provider_id');
    }

    /** @return HasMany<ServiceRequestReply, $this> */
    public function replies(): HasMany
    {
        return $this->hasMany(ServiceRequestReply::class);
    }
}
