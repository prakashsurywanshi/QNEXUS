<?php

namespace App\Enums;

enum PackageType: string
{
    case DEFAULT = 'default';
    case TRIAL = 'trial';
    case STANDARD = 'standard';
    case LIFETIME = 'lifetime';
    case FREE = 'free';

    public function label(): string
    {
        return match ($this) {
            self::DEFAULT => 'Default',
            self::TRIAL => 'Trial',
            self::FREE => 'Free',
            self::STANDARD => 'Standard',
            self::LIFETIME => 'Lifetime',
        };
    }

    public function isEditable(): bool
    {
        return !in_array($this, [self::DEFAULT, self::TRIAL], true);
    }

    public function isDeletable(): bool
    {
        return !in_array($this, [self::DEFAULT, self::TRIAL], true);
    }
}