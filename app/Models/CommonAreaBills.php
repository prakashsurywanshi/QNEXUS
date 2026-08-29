<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommonAreaBills extends Model
{
    use HasFactory, HasSociety;

    protected $casts = [
        'bill_date' => 'datetime',
        'bill_payment_date' => 'datetime',
    ];

    protected $appends = [
        'payment_proof_url',
        'bill_proof_url',
    ];

    const FILE_PATH = 'common-bill-file';

    public function getPaymentProofUrlAttribute()
    {
        if ($this->payment_proof) {
            return asset_url_local_s3(CommonAreaBills::FILE_PATH . '/' . $this->payment_proof);
        }
        return;
    }

    public function getBillProofUrlAttribute()
    {
        if ($this->bill_proof) {
            return asset_url_local_s3(CommonAreaBills::FILE_PATH . '/' . $this->bill_proof);
        }
        return;
    }

    public function billType()
    {
        return $this->belongsTo(BillType::class, "bill_type_id");
    }

    public function society()
    {
        return $this->belongsTo(Society::class, "society_id");
    }

}