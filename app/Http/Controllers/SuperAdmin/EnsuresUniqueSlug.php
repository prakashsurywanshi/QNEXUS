<?php

namespace App\Http\Controllers\SuperAdmin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

trait EnsuresUniqueSlug
{
    /**
     * @param  class-string  $model
     */
    private function resolveSlug(string $model, string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);

        if ($base === '') {
            $base = 'item';
        }

        $slug = $base;
        $counter = 2;

        while ($this->slugExists($model, $slug, $ignoreId)) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
    }

    /**
     * @param  class-string  $model
     */
    private function slugExists(string $model, string $slug, ?int $ignoreId): bool
    {
        return $model::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn (Builder $query) => $query->where('id', '!=', $ignoreId))
            ->exists();
    }
}
