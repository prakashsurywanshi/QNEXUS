<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use App\Models\ApartmentManagement;
use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;
use App\Models\VisitorTypeSettingsModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VisitorManagement extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'visitors_management';

    protected $appends = [
        'visitor_photo_url',
    ];

    protected $casts = [
        'date_of_visit' => 'datetime',
    ];

    const FILE_PATH = 'visitors-photos';

    public function getVisitorPhotoUrlAttribute()
    {
        if ($this->visitor_photo) {
            return asset_url_local_s3(VisitorManagement::FILE_PATH . '/' . $this->visitor_photo);
        }
        return;
    }

    public function apartment()
    {
        return $this->belongsTo(ApartmentManagement::class, "apartment_id");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "added_by");
    }

    public function society()
    {
        return $this->belongsTo(Society::class, "society_id");
    }

    public function visitorType()
    {
        return $this->belongsTo(VisitorTypeSettingsModel::class,"visitor_type_id");
    }
}