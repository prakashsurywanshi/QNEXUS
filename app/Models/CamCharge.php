<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CamCharge extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'total_budget' => 'decimal:2',
        'total_area' => 'decimal:2',
        'rate_per_sqft' => 'decimal:4',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}