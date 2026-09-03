<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Centralised, reusable notification copy. A template is keyed by a stable
 * string (e.g. `work_order_assigned`) and scoped to a category. Titles and
 * bodies may contain `:placeholder` tokens that are resolved at send time.
 */
class NotificationTemplate extends Model
{
    protected $guarded = ['id'];

    public const TOKEN_PATTERN = '/:([a-z0-9_]+)/i';

    /**
     * Resolve a template's title after substituting `:token` placeholders.
     *
     * @param  array<string, string>  $data
     */
    public function resolveTitle(array $data = []): string
    {
        return $this->substitute($this->title, $data);
    }

    /**
     * Resolve a template's body after substituting `:token` placeholders.
     *
     * @param  array<string, string>  $data
     */
    public function resolveBody(array $data = []): ?string
    {
        return $this->body ? $this->substitute($this->body, $data) : null;
    }

    /**
     * @param  array<string, string>  $data
     */
    private function substitute(string $text, array $data = []): string
    {
        return preg_replace_callback(
            self::TOKEN_PATTERN,
            fn (array $m) => (string) ($data[$m[1]] ?? $m[0]),
            $text,
        ) ?? $text;
    }
}
