<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rent extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'rents';

    protected $fillable = [
        'apartment_id',
        'tenant_id',
        'rent_for_year',
        'rent_for_month',
        'currency_id',
        'rent_amount',
        'status',
        'payment_date',
        'payment_proof'
    ];

    protected $appends = [
        'payment_proof_url',
    ];

    const FILE_PATH = 'rent-files';

    public function getPaymentProofUrlAttribute()
    {
        if ($this->payment_proof) {
            return asset_url_local_s3(Rent::FILE_PATH . '/' . $this->payment_proof);
        }
        return;
    }

    // Define relationships
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function apartment()
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }
}