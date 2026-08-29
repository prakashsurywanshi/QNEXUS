<?php

namespace App\Models;

use App\Models\User;
use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketAgentSetting extends Model
{
    use HasFactory, HasSociety;

    protected $fillable = [
        'ticket_agent_id',
        'ticket_type_id',
    ];

    public function ticketType()
    {
        return $this->belongsTo(TicketTypeSetting::class, "ticket_type_id");
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ticket_agent_id');
    }
}