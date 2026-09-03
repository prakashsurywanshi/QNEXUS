<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Staff extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'is_active' => 'boolean',
        'date_joined' => 'date',
    ];

    /** @return HasMany<StaffClockLog, $this> */
    public function clockLogs(): HasMany
    {
        return $this->hasMany(StaffClockLog::class);
    }
}
