<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StripePayment extends Model
{
    use HasFactory;

    protected $table = 'stripe_payments';

    protected $guarded = ['id'];

    public function maintenanceApartment(): BelongsTo
    {
        return $this->belongsTo(MaintenanceApartment::class);
    }
}