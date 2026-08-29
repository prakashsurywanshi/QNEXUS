<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pet extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'weight' => 'decimal:2',
        'last_vaccination_date' => 'date',
        'next_vaccination_date' => 'date',
        'is_neutered' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function apartment(): BelongsTo
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }

    public function hasVaccinationDue(): bool
    {
        return $this->next_vaccination_date && $this->next_vaccination_date->isPast();
    }
}