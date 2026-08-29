<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class SocietyScope implements Scope
{
    public function apply(Builder $builder, Model $model): Builder
    {
        // If the model does not expose a `society` relation it has no
        // `society_id` column, so we skip it entirely to avoid an invalid query.
        if (!method_exists($model, 'society')) {
            return $builder;
        }

        // auth()->user() triggers a database lookup during application boot
        // (e.g. while running migrations), so we must guard with hasUser().
        if (auth()->hasUser()) {
            $society = society();

            if ($society) {
                return $builder->where($model->getTable() . '.society_id', '=', $society->id);
            }
        }

        return $builder;
    }
}
