<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Provider;

class ProviderController extends Controller
{
    public function index()
    {
        $providers = Provider::getAllProviders();
        return response()->json($providers);  // Return the data as JSON
    }
}
