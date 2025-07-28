<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        // Toujours retourner un JSON 401, même si la requête n'attend pas du JSON
        abort(response()->json(['message' => 'Unauthenticated.'], 401));
    }
} 