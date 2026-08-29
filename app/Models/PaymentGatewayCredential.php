<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class PaymentGatewayCredential extends Model
{

    use HasFactory, HasSociety;
    protected $table = 'payment_gateway_credentials';
    protected $guarded = ['id'];

    protected $attributes = [
        'is_cash_payment_enabled' => true,
    ];

    protected $casts = [
        'stripe_key' => 'encrypted',
        'razorpay_key' => 'encrypted',
        'stripe_secret' => 'encrypted',
        'razorpay_secret' => 'encrypted',
    ];

}