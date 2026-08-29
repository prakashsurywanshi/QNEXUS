<?php

namespace App\Models;

use App\Scopes\ActiveScope;
use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Ticket extends Model
{
    use HasFactory, HasSociety;

    protected $fillable = [
        'society_id',
        'subject',
        'user_id',
        'type_id',
        'status',
        'agent_id',
        'reply',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function ticketType()
    {
        return $this->belongsTo(TicketTypeSetting::class, "type_id");
    }

    public function reply(): HasMany
    {
        return $this->hasMany(TicketReply::class, 'ticket_id');
    }

    public function latestReply(): HasOne
    {
        return $this->hasOne(TicketReply::class, 'ticket_id')->latest();
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id')->withoutGlobalScope(ActiveScope::class);
    }
}