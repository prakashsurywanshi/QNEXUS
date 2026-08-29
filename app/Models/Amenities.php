<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenities extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'amenities';

    protected $fillable = [
        'society_id',
        'amenities_name',
        'status',
        'booking_status',
        'start_time',
        'end_time',
        'slot_time',
        'multiple_booking_status',
        'number_of_person',
    ];

    public function bookings()
    {
        return $this->hasMany(BookAmenity::class, 'amenity_id');
    }
}
