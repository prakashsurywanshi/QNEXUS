<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MoveRecord extends Model
{
    use HasFactory, HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'move_date' => 'date',
        'deposit_amount' => 'decimal:2',
        'pending_dues' => 'decimal:2',
        'noc_date' => 'date',
    ];

    public function apartment(): BelongsTo
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function nocIssuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'noc_issued_by');
    }
}