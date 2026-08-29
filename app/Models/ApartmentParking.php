<?php

namespace App\Models;

use App\Models\ApartmentManagement;
use Illuminate\Database\Eloquent\Model;
use App\Models\ParkingManagementSetting;

class ApartmentParking extends Model
{
    protected $table = 'apartment_parking';
    protected $fillable = [
        'apartment_management_id',
        'parking_id'
    ];

    public function apartmentManagement()
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_management_id');
    }

    public function parkingManagementSettings()
{
    return $this->belongsToMany(ParkingManagementSetting::class, 'apartment_parking', 'apartment_management_id', 'parking_id');
}

}