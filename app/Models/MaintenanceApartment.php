<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    public function maintenanceManagement()
    {
        return $this->belongsTo(MaintenanceManagement::class, 'maintenance_management_id');
    }

    public function apartment()
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_management_id');
    }

    public function tenants()
    {
        return $this->belongsToMany(Tenant::class, 'apartment_tenant', 'apartment_id', 'tenant_id');
    }

    public function paymentGateways(): HasOne
    {
        return $this->hasOne(PaymentGatewayCredential::class, 'society_id', 'society_id')->withoutGlobalScopes();
    }


}