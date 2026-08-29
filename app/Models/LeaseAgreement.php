<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaseAgreement extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'monthly_rent' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'cam_charges' => 'decimal:2',
        'escalation_value' => 'decimal:2',
    ];

    public function commercialTenant(): BelongsTo
    {
        return $this->belongsTo(CommercialTenant::class, 'commercial_tenant_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rentInvoices(): HasMany
    {
        return $this->hasMany(RentInvoice::class, 'lease_agreement_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getMonthlyRentWithEscalationAttribute(): float
    {
        $monthsSinceStart = now()->diffInMonths($this->start_date);
        $escalationPeriods = (int) floor($monthsSinceStart / $this->escalation_frequency_months);

        if ($escalationPeriods <= 0) return (float) $this->monthly_rent;

        $rent = (float) $this->monthly_rent;
        for ($i = 0; $i < $escalationPeriods; $i++) {
            if ($this->rent_escalation_type === 'percentage') {
                $rent += $rent * ($this->escalation_value / 100);
            } else {
                $rent += $this->escalation_value;
            }
        }
        return round($rent, 2);
    }
}