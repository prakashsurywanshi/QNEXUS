<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasSociety;

    protected $fillable = [
        'name',
        'guard_name',
        'society_id',
        'display_name',
    ];

    /** @return BelongsTo<Society, $this> */
    public function society(): BelongsTo
    {
        return $this->belongsTo(Society::class);
    }
}
