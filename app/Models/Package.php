<?php

namespace App\Models;

use App\Enums\PackageType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'package_type' => PackageType::class,
    ];

    const ADDITIONAL_FEATURES = [
        'Accept Maintenance Payment',
    ];

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'package_modules');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(GlobalCurrency::class, 'currency_id');
    }

    public function hasModule($moduleId): bool
    {
        return $this->modules()->where('module_id', $moduleId)->exists();
    }

    public function societies(): HasMany
    {
        return $this->hasMany(Society::class, 'package_id');
    }
}