<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasSociety;

class AssetMaintenance extends Model
{
    use HasFactory, HasSociety;
    protected $table = 'asset_maintenances';

    protected $fillable = [
        'maintenance_date',

    ];

    public function category()
    {
        return $this->belongsTo(AssetsCategory::class, 'category_id');
    }

    public function asset()
    {
        return $this->belongsTo(AssetManagement::class, 'asset_id');
    }


    public function apartments()
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }

}