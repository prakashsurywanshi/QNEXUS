<?php

namespace App\Models;

use App\Models\ApartmentParking;
use App\Models\ApartmentManagement;
use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ParkingManagementSetting extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'parking_managements';
    protected $fillable = [
        'apartment_id',
        'parking_code',
        'society_id',
    ];

    public function apartment()
    {
        return $this->belongsTo(Apartment::class, "apartment_id");
    }

    public function apartmentManagement()
    {
        return $this->belongsToMany(ApartmentManagement::class, 'apartment_parking', 'parking_id', 'apartment_management_id');
    }

    public function apartmentManagements()
    {
        return $this->hasMany(ApartmentManagement::class, 'parking_code_id');
    }

    public function parkingCodes()
    {
        return $this->belongsToMany(ParkingManagementSetting::class, 'apartment_parking', 'apartment_management_id', 'parking_id');
    }

    public function parkingCode()
    {
        return $this->hasOne(ApartmentParking::class,   'parking_id');
    }

    public function apartmentParking()
    {
        return $this->hasMany(
            ApartmentParking::class,
            'parking_id',
            'id'
        );
    }
}