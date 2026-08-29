<?php

namespace App\Models;

use App\Traits\HasSociety;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    use HasFactory, HasSociety;

    protected $fillable = [
        'society_id',
        'title',
        'description',
    ];

    public function noticeRoles()
    {
        return $this->hasMany(NoticeRole::class, 'notice_id');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'notice_role', 'notice_id', 'role_id');
    }
}