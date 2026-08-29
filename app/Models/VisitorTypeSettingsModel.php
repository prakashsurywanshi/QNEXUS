<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorTypeSettingsModel extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'visitor_settings';

}