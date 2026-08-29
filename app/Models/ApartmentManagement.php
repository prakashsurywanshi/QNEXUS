<?php

namespace App\Models;


use App\Models\Maintenance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasSociety;

class ApartmentManagement extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'apartment_managements';

    protected $fillable = [
        'apartment_number',
        'apartment_area',
        'apartment_area_unit',
        'floor_id',
        'tower_id',
        'apartment_id',
        'user_id',
        'status',
        'society_id',
    ];

    public function apartments()
    {
        return $this->belongsTo(Apartment::class ,'apartment_id');
    }

    public function floors()
    {
        return $this->belongsTo(Floor::class ,'floor_id');
    }

    public function towers()
    {
        return $this->belongsTo(Tower::class ,'tower_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class ,'user_id');
    }

    public function tenants()
    {
        return $this->belongsToMany(Tenant::class, 'apartment_tenant', 'apartment_id', 'tenant_id');
    }

    public function parking()
    {
        return $this->belongsToMany(ParkingManagementSetting::class, 'apartment_parking', 'apartment_management_id', 'parking_id');
    }

    public function parkingManagement()
    {
        return $this->belongsTo(ParkingManagementSetting::class, 'parking_code_id');
    }

    public function parkingCodes()
    {
        return $this->belongsToMany(ParkingManagementSetting::class, 'apartment_parking', 'apartment_management_id', 'parking_id');
    }

    public function apartmentTenants()
    {
        return $this->hasMany(ApartmentTenant::class, 'apartment_id');
    }

    public function serviceManagements()
    {
        return $this->belongsToMany(ServiceManagement::class, 'service_management_apartment', 'apartment_management_id', 'service_management_id');
    }
}