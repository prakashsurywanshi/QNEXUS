<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MaintenanceApartment extends Model
{
    use HasFactory;

    protected $table = 'maintenance_apartment';

    protected $fillable = [
        'maintenance_management_id',
        'apartment_management_id',
        'cost',
        'payment_date',
        'payment_proof',
        'paid_status',
    ];

    /** @return BelongsTo<MaintenanceManagement, $this> */
    public function maintenanceManagement(): BelongsTo
    {
        return $this->belongsTo(MaintenanceManagement::class, 'maintenance_management_id');
    }

    /** @return BelongsTo<ApartmentManagement, $this> */
    public function apartment(): BelongsTo
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_management_id');
    }

    /** @return BelongsToMany<Tenant, $this> */
    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'apartment_tenant', 'apartment_id', 'tenant_id');
    }

    /** @return HasOne<PaymentGatewayCredential, $this> */
    public function paymentGateways(): HasOne
    {
        return $this->hasOne(PaymentGatewayCredential::class, 'society_id', 'society_id')->withoutGlobalScopes();
    }
}
