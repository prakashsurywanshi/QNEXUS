<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasSociety;

class AssetIssue extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'asset_issues';
    protected $appends = [
        'photo_url'
    ];

    const FILE_PATH = 'assets-issue-documents';

    public function getPhotoUrlAttribute()
    {
        if ($this->file_path) {
            return asset_url_local_s3(AssetIssue::FILE_PATH . '/' . $this->file_path);
        }
        return;
    }


    public function asset()
    {
        return $this->belongsTo(AssetManagement::class, 'asset_id');
    }


}