<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;

class ServiceProviderManagements extends Model
{
    use HasSociety;

    protected $table = 'service_provider_management';

    public function serviceProviderSettings()
    {
        return $this->belongsTo(ServiceProviderSetting::class, "service_provider_settings_id");
    }

}