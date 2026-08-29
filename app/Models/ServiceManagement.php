<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceManagement extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'service_management';

    protected $appends = [
        'service_photo_url',
    ];

    const FILE_PATH = 'services-photos';

    public function getServicePhotoUrlAttribute()
    {
        if ($this->service_photo) {
            return asset_url_local_s3(ServiceManagement::FILE_PATH . '/' . $this->service_photo);
        }
        return;
    }

    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class, "service_type_id");
    }

    public function apartmentManagements()
    {
        return $this->belongsToMany(ApartmentManagement::class, 'service_management_apartment', 'service_management_id', 'apartment_management_id');
    }

}