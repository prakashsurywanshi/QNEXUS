<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Rent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tenant extends Model
{
    use HasSociety, HasFactory;

    protected $fillable = [
        'user_id',
        'contract_start_date',
        'contract_end_date',
        'rent_amount',
        'rent_billing_cycle',
        'status',
        'move_in_date',
        'move_out_date',
    ];

    protected $with = [
        'user'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function documents()
    {
        return $this->hasMany(TenantFile::class);
    }

    public function rents()
    {
        return $this->hasMany(Rent::class, 'tenant_id');
    }

    public function apartments()
    {
        return $this->belongsToMany(ApartmentManagement::class, 'apartment_tenant', 'tenant_id', 'apartment_id')->withPivot('contract_start_date', 'contract_end_date', 'rent_amount', 'rent_billing_cycle', 'status', 'move_in_date', 'move_out_date')
        ->withTimestamps();
    }

    public function apartmentTenants()
    {
        return $this->hasMany(ApartmentTenant::class)->withTimestamps();
    }
}