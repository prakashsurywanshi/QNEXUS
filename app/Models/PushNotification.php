<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PushNotification extends Model
{
    use HasFactory, HasSociety;

    protected $fillable = [
        'endpoint',
        'user_id',
        'public_key',
        'auth_token',
        'society_id',
    ];

}