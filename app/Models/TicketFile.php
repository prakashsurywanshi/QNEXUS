<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketFile extends Model
{
    protected $fillable = [
        'user_id',
        'ticket_reply_id',
        'filename',
        'hashname',
    ];
}