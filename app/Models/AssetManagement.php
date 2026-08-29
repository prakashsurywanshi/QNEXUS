<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasSociety;

class AssetManagement extends Model
{
    use HasFactory, HasSociety;
    protected $table = 'asset_managements';

    protected $fillable = [
        'society_id',
        'name',

    ];

    protected $appends = [
        'photo_url'
    ];

    const FILE_PATH = 'assets-documents';

    public function getPhotoUrlAttribute()
    {
        if ($this->file_path) {
            return asset_url_local_s3(AssetManagement::FILE_PATH . '/' . $this->file_path);
        }
        return;
    }

    public function category()
    {
        return $this->belongsTo(AssetsCategory::class, 'category_id');
    }


    public function apartments()
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }

    public function apartmentTenants()
    {
        return $this->hasMany(ApartmentTenant::class, 'apartment_id');
    }

    public function towers()
    {
        return $this->belongsTo(Tower::class, 'tower_id');
    }

    public function floors()
    {
        return $this->belongsTo(Floor::class, 'floor_id');
    }

}