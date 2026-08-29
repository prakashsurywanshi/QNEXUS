<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatrolLog extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
    ];

    public function guardUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guard_id');
    }

    public function checkpoint(): BelongsTo
    {
        return $this->belongsTo(PatrolCheckpoint::class, 'checkpoint_id');
    }

    public function getDurationAttribute(): ?int
    {
        if (!$this->check_out_time) return null;
        return $this->check_in_time->diffInMinutes($this->check_out_time);
    }
}