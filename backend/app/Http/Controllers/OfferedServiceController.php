<?php

namespace App\Http\Controllers;

use App\Models\OfferedService;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use App\Models\Provider;

class OfferedServiceController extends Controller
{
    /**
     * Display a listing of the offered services.
     */
    public function index()
    {
        $offeredServices = OfferedService::with('category')->get();
        return response()->json($offeredServices);
    }

    /**
     * Store a newly created offered service in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:tbl_categories,category_id',
            'service_name' => 'required|string|max:255',
            'service_description' => 'nullable|string',
        ]);

        $offeredService = OfferedService::create($request->all());

        return response()->json(['message' => 'Service added successfully', 'data' => $offeredService], 201);
    }

    /**
     * Display the specified offered service.
     */
    public function show($id)
    {
        $offeredService = OfferedService::with('category')->findOrFail($id);
        return response()->json($offeredService);
    }

    /**
     * Update the specified offered service in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'category_id' => 'required|exists:tbl_categories,category_id',
            'service_name' => 'required|string|max:255',
            'service_description' => 'nullable|string',
        ]);

        $offeredService = OfferedService::findOrFail($id);
        $offeredService->update($request->all());

        return response()->json(['message' => 'Service updated successfully', 'data' => $offeredService]);
    }

    /**
     * Remove the specified offered service from storage.
     */
    public function destroy($id)
    {
        $offeredService = OfferedService::findOrFail($id);
        $offeredService->delete();

        return response()->json(['message' => 'Service deleted successfully']);
    }

    public function getOfferedServicesByProvider($providerId)
    {
        // Get provider's category_id
        $provider = Provider::where('provider_id', $providerId)->first();
    
        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }
    
        // Fetch only offered services in the same category as the provider
        $services = OfferedService::where('category_id', $provider->service_type)->get();
    
        return response()->json($services);
    }
    

}