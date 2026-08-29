<?php

namespace App\Models;

use App\Observers\SocietyObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property string $property_type
 */
#[ObservedBy([SocietyObserver::class])]
class Society extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Default attribute values. property_type defaults to 'residential' so the
     * in-memory model reflects the DB default before the row is inserted.
     */
    protected $attributes = [
        'property_type' => 'residential',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'show_logo_text' => 'boolean',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function moduleSettings(): HasMany
    {
        return $this->hasMany(ModuleSetting::class);
    }

    public function societyUsers(): HasMany
    {
        return $this->hasMany(SocietyUser::class);
    }

    public function roles(): HasMany
    {
        return $this->hasMany(Role::class);
    }

    /**
     * Uniquely scope a query to this society (used for top-level creation where
     * the global SocietyScope cannot apply yet).
     */
    public function scopeForSociety(Builder $query, Society $society): Builder
    {
        return $query->where('id', $society->id);
    }

    protected function slug(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ?: Str::slug($this->name),
        );
    }
}
