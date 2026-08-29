<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FixedDeposit extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'amount' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'start_date' => 'date',
        'maturity_date' => 'date',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function isMatured(): bool
    {
        return $this->maturity_date && $this->maturity_date->isPast();
    }

    public function getDaysToMaturityAttribute(): ?int
    {
        if (!$this->maturity_date) return null;
        return max(0, (int) now()->diffInDays($this->maturity_date, false));
    }
}
