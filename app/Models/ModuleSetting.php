<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;

class ModuleSetting extends Model
{
    use HasSociety;

    protected $guarded = ['id'];
}
