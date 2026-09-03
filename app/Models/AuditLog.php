<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasSociety;

    protected $guarded = ['id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function record(string $action, ?Model $model = null, ?array $changes = null, bool $includeSociety = true): void
    {
        $societyId = active_society_id();

        if ($includeSociety && ! $societyId) {
            return;
        }

        self::create([
            'society_id' => $societyId,
            'user_id' => auth()->id(),
            'action' => $action,
            'auditable_type' => $model ? get_class($model) : null,
            'auditable_id' => $model?->getKey(),
            'changes' => $changes ? json_encode($changes) : null,
            'ip_address' => request()->ip(),
        ]);
    }
}
