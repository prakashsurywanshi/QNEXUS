<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceManagement extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'maintenance_management';

    protected $fillable = [
        'month',
        'year',
        'additional_cost',
        'status',
        'additional_details',
        'total_additional_cost',
        'payment_due_date',
    ];

    public function maintenance()
    {
        return $this->belongsTo(Maintenance::class, 'maintenance_id');
    }

    public function maintenanceApartments()
    {
        return $this->hasMany(MaintenanceApartment::class);
    }
}