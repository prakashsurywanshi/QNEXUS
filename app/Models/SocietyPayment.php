<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocietyPayment extends Model
{
    use HasFactory;
    use HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'payment_date_time' => 'datetime',
    ];

    public function society(): BelongsTo
    {
        return $this->belongsTo(Society::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}