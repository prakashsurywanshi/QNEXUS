<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookAmenity extends Model
{
    use HasFactory, HasSociety;

    protected $fillable = [
        'amenity_id',
        'booked_by',
        'booking_date',
        'booking_time',
        'persons',
    ];

    public function amenity()
    {
        return $this->belongsTo(Amenities::class, 'amenity_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'booked_by');
    }
}