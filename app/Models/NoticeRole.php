<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoticeRole extends Model
{
    use HasFactory;

    protected $table = 'notice_role';

    protected $fillable = [
        'notice_id',
        'role_id',
    ];

    public function notice()
    {
        return $this->belongsTo(Notice::class, 'notice_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
}