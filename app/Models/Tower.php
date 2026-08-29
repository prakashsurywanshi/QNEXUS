<?php

namespace App\Models;

use App\Models\Floor;
use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tower extends Model
{
    use HasFactory, HasSociety;

    public function floors()
    {
        return $this->hasMany(Floor::class);
    }

    public function apartmentManagement()
    {
        return $this->hasMany(ApartmentManagement::class);
    }

}