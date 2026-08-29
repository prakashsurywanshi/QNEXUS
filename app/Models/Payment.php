<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory, HasSociety;
    protected $table = 'payments';
    protected $guarded = ['id'];

    public function maintenanceApartment(): BelongsTo
    {
        return $this->belongsTo(MaintenanceApartment::class);
    }

}
