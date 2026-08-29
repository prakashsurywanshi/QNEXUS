<?php

namespace App\Services;

use BaconQrCode\Renderer\GDLibRenderer;
use BaconQrCode\Writer;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class QrCodeService
{
    public function generate(string $content, int $size = 300, int $margin = 4): string
    {
        if ($content === '' || $content === null) {
            throw new \InvalidArgumentException('QR code content cannot be empty.');
        }

        $renderer = new GDLibRenderer($size, $margin);

        return (new Writer($renderer))->writeString($content);
    }

    public function dataUri(string $content, int $size = 300, int $margin = 4): string
    {
        return 'data:image/png;base64,' . base64_encode($this->generate($content, $size, $margin));
    }

    public function download(string $content, string $filename = 'qr-code.png', int $size = 500): Response
    {
        return response($this->generate($content, $size))
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    public function token(): string
    {
        return 'QR' . Str::upper(Str::random(32));
    }

    public function verifyUrl(string $routeName, string $token): string
    {
        return route($routeName, ['token' => $token]);
    }
}