<?php

namespace Tests\Unit\Services;

use App\Services\TokenService;
use PHPUnit\Framework\TestCase;

class TokenServiceTest extends TestCase
{
    private TokenService $tokenService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tokenService = new TokenService();
    }

    public function test_generate_returns_valid_uuid(): void
    {
        $token = $this->tokenService->generate();
        
        $this->assertIsString($token);
        $this->assertMatchesRegularExpression('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $token);
    }

    public function test_generate_returns_unique_tokens(): void
    {
        $token1 = $this->tokenService->generate();
        $token2 = $this->tokenService->generate();
        
        $this->assertNotEquals($token1, $token2);
    }
}
