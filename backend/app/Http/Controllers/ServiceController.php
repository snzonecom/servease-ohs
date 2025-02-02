<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;

class ServiceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // ✅ Check if the user has an associated provider
        if (!$user || !$user->provider) {
            return response()->json(['error' => 'Provider not found for the user.'], 404);
        }
    
        $providerId = $user->provider->provider_id;
    
        $services = Service::where('provider_id', $providerId)->get();
    
        return response()->json($services);
    }
    

    // ✅ Add a new service
    public function store(Request $request)
    {
        $request->validate([
            'service_name' => 'required|string|max:255',
            'service_description' => 'nullable|string',
            'price_start' => 'required|numeric',
        ]);

        $providerId = Auth::user()->provider->provider_id;

        $service = Service::create([
            'provider_id' => $providerId,
            'service_name' => $request->service_name,
            'service_description' => $request->service_description,
            'price_start' => $request->price_start,
        ]);

        return response()->json(['message' => 'Service added successfully!', 'service' => $service], 201);
    }

    // ✅ Update an existing service
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $service->update($request->all());

        return response()->json(['message' => 'Service updated successfully!', 'service' => $service]);
    }

    // ✅ Delete a service
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service deleted successfully.']);
    }
}