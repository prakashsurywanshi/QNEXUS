<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;

class OfflinePaymentMethod extends Model
{
    use HasSociety;

    protected $fillable = ['name', 'description', 'status'];

    public function offlinePlanChanges()
    {
        return $this->hasMany(OfflinePlanChange::class, 'offline_method_id');
    }
}
