<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminFlutterwavePayment extends Model
{
    use HasFactory;

    protected $table = 'flutterwave_payments';

    protected $fillable = [
        'flutterwave_order_id',
        'flutterwave_payment_id',
        'maintenance_apartment_id',
        'amount',
        'payment_status',
        'payment_date',
        'payment_error_response',
    ];

    public function maintenanceApartment()
    {
        return $this->belongsTo(MaintenanceApartment::class);
    }
}