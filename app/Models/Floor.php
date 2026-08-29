<?php

namespace App\Models;

use App\Models\Tower;
use App\Traits\HasSociety;
use App\Models\ApartmentManagement;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Floor extends Model
{
    use HasFactory, HasSociety;

    public function tower()
    {
        return $this->belongsTo(Tower::class, "tower_id");
    }

    public function apartments()
    {
        return $this->hasMany(Apartment::class);
    }

    public function apartmentManagement()
    {
        return $this->hasMany(ApartmentManagement::class);
    }
}