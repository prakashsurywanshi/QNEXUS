<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketTypeSetting extends Model
{
    use HasFactory, HasSociety;

    public function ticketAgent()
    {
        return $this->hasMany(TicketAgentSetting::class, 'ticket_type_id');
    }
}