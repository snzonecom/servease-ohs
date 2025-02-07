<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class ServiceController extends Controller
{

    public function getAllServices()
    {
        $services = Service::all();  // ✅ Get all services

        return response()->json($services);  // ✅ Return all services
    }


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
    public function update(Request $request, $providerId, $id)
    {
        $user = auth()->user();

        // ✅ Ensure the service belongs to the logged-in provider
        $service = Service::where('provider_id', $providerId)->where('service_id', $id)->first();

        if (!$service) {
            return response()->json(['error' => 'Service not found for this provider.'], 404);
        }

        $request->validate([
            'service_name' => 'required|string|max:255',
            'service_description' => 'nullable|string',
            'price_start' => 'required|numeric',
        ]);

        $service->update($request->all());

        return response()->json(['message' => 'Service updated successfully!', 'service' => $service]);
    }

    // ✅ Delete a service
    public function destroy($providerId, $id)
    {
        $user = auth()->user();

        // ✅ Ensure the service belongs to the logged-in provider
        $service = Service::where('provider_id', $providerId)->where('service_id', $id)->first();

        if (!$service) {
            return response()->json(['error' => 'Service not found for this provider.'], 404);
        }

        $service->delete();

        return response()->json(['message' => 'Service deleted successfully.']);
    }

    // ✅ Fetch Services by Provider ID (Handle empty results gracefully)
    public function getServicesByProvider($providerId)
    {
        $services = Service::where('provider_id', $providerId)->get();

        // ✅ Return an empty array instead of an error if no services are found
        return response()->json($services);
    }

    public function getPopularServices()
    {
        $popularServices = DB::table('tbl_services')
            ->join('tbl_bookings', 'tbl_services.service_id', '=', 'tbl_bookings.services')
            ->select('tbl_services.service_name', DB::raw('COUNT(tbl_bookings.booking_id) as total_bookings'))
            ->groupBy('tbl_services.service_name')
            ->orderByDesc('total_bookings')
            ->limit(5)
            ->get();

        return response()->json($popularServices);
    }

}