<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsPage extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
