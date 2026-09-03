<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkOrder extends Model
{
    use HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(AssetManagement::class, 'asset_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
