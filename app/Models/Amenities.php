<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenities extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'amenities';

    public function bookings()
    {
        return $this->hasMany(BookAmenity::class, 'amenity_id');
    }
}