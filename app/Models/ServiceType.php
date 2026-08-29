<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceType extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'service_type';

    protected $fillable = [
        'name',
        'icon',
        'society_id',
    ];

    public function serviceManagement()
    {
        return $this->hasMany(ServiceManagement::class, 'service_type_id');
    }

}