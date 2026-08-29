<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    use HasFactory, HasSociety;
    protected $guarded = ['id'];

    public static function canSendAmenityNotification()
    {
        $setting = self::where('type', 'amenitites')->first();
        return $setting && $setting->send_email;
    }

}