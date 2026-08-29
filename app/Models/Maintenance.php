<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    use HasFactory, HasSociety;

    protected $fillable = [
        'cost_type',
        'unit_name',
        'set_value',
        'society_id',
    ];

}