<?php

namespace App\Services;

use Illuminate\Support\Str;

class TokenService
{
    /**
     * Generate a new unique token.
     *
     * @return string
     */
    public function generate(): string
    {
        return Str::uuid()->toString();
    }
}