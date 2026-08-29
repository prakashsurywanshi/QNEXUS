<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApartmentTenant extends Model
{
    use HasFactory;

    protected $table = 'apartment_tenant';

    protected $fillable = [
        'tenant_id',
        'apartment_id',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function apartment()
    {
        return $this->belongsTo(ApartmentManagement::class);
    }
}