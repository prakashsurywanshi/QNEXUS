<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillType extends Model
{
    use HasFactory, HasSociety;

    const COMMON_AREA_BILL_TYPE = 'Common Area Bill Type';

    const UTILITY_BILL_TYPE = 'Utility Bill Type';

    public function scopeCommonAreaBillType($query)
    {
        return $query->where('bill_type_category', self::COMMON_AREA_BILL_TYPE);
    }

    public function scopeUtilityBillType($query)
    {
        return $query->where('bill_type_category', self::UTILITY_BILL_TYPE);
    }
}