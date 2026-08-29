<?php

namespace App\Models;

use App\Models\Currency;
use App\Traits\HasSociety;
use Illuminate\Support\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UtilityBillManagement extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'utility_bills';

    protected $with = [
        'currency'
    ];

    protected $appends = [
        'payment_proof_url',
        'bill_proof_url',
    ];

    protected $casts = [
        'bill_date' => 'datetime',
        'bill_payment_date' => 'datetime',
    ];

    const FILE_PATH = 'utility-bill-file';

    public function getPaymentProofUrlAttribute()
    {
        if ($this->payment_proof) {
            return asset_url_local_s3(UtilityBillManagement::FILE_PATH . '/' . $this->payment_proof);
        }
        return;
    }

    public function getBillProofUrlAttribute()
    {
        if ($this->bill_proof) {
            return asset_url_local_s3(UtilityBillManagement::FILE_PATH . '/' . $this->bill_proof);
        }
        return;
    }

    public function apartment()
    {
        return $this->belongsTo(ApartmentManagement::class, "apartment_id");
    }

    public function billType()
    {
        return $this->belongsTo(BillType::class, "bill_type_id");
    }

    public function society()
    {
        return $this->belongsTo(Society::class, "society_id");
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

}