<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommercialTenant extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'unit_area' => 'decimal:2',
        'rent_amount' => 'decimal:2',
        'security_deposit' => 'decimal:2',
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function commercialUnits(): HasMany
    {
        return $this->hasMany(CommercialUnit::class, 'commercial_tenant_id');
    }

    public function leaseAgreements(): HasMany
    {
        return $this->hasMany(LeaseAgreement::class, 'commercial_tenant_id');
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->company_name ?: ($this->contact_name ?: ($this->unit_number ?: 'Commercial Tenant #' . $this->id));
    }

    public function scopeVacant($query)
    {
        return $query->where('status', 'vacant');
    }

    public function scopeOccupied($query)
    {
        return $query->where('status', 'occupied');
    }
}