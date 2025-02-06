<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Provider;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\Service;

class ProviderController extends Controller
{
    // ✅ List all providers
    public function index()
    {
        $providers = Provider::with('user',)->get();
        return response()->json($providers);
    }

    // ✅ Show provider by ID
    public function show($id)
    {
        $provider = Provider::with('user')->findOrFail($id);
        return response()->json($provider);
    }

    // ✅ Update provider details
    public function update(Request $request)
    {
        $provider = Provider::where('user_id', Auth::id())->first();
        $user = User::find(Auth::id()); // ✅ Get the corresponding user
    
        if (!$provider || !$user) {
            return response()->json(['message' => 'Provider not found'], 404);
        }
    
        // ✅ Validate Input
        $request->validate([
            'email' => 'email|unique:users,email,' . Auth::id(),
            'contact_no' => 'nullable|string',
            'office_add' => 'nullable|string',
            'brgy' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'service_type' => 'nullable|integer',
            'password' => 'nullable|string|min:6',  // ✅ Add password validation
        ]);
    
        // ✅ Update Provider Information
        $provider->update($request->only([
            'contact_no',
            'office_add',
            'brgy',
            'city',
            'province',
            'contact_person',
            'service_type'
        ]));
    
        // ✅ Update Email in Users Table
        if ($request->has('email')) {
            $user->email = $request->input('email');
            $user->save();
        }
    
        // ✅ Update Password if provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->input('password'));
            $user->save();
        }
    
        return response()->json([
            'message' => 'Profile updated successfully!',
            'provider' => $provider
        ]);
    }

    // ✅ Delete a provider
    public function destroy($id)
    {
        $provider = Provider::findOrFail($id);
        $provider->delete();

        return response()->json(['message' => 'Provider deleted successfully.']);
    }

    // ✅ Approve provider application
    public function approve($id)
    {
        $provider = Provider::findOrFail($id);
        $provider->account_status = 'approved';
        $provider->save();

        return response()->json(['message' => 'Provider application approved.']);
    }

    // ✅ Reject provider application
    public function reject($id)
    {
        $provider = Provider::findOrFail($id);
        $provider->account_status = 'rejected';
        $provider->save();

        return response()->json(['message' => 'Provider application rejected.']);
    }

    // ✅ Count approved service providers
    public function countApprovedProviders()
    {
        $count = Provider::where('account_status', 'approved')->count();
        return response()->json(['approved_providers_count' => $count]);
    }

    // For showing pending providers
    public function pendingProviders()
    {
        $pendingProviders = Provider::with(['user', 'serviceCategory']) // Eager load related service category
            ->where('account_status', 'pending')
            ->get()
            ->map(function ($provider) {
                $provider->profile_pic = $provider->profile_pic ? asset($provider->profile_pic) : null;
                $provider->attachment = $provider->attachment ? asset($provider->attachment) : null;
                $provider->service_type_name = $provider->serviceCategory ? $provider->serviceCategory->category_name : 'Unknown';
                $provider->email = $provider->user ? $provider->user->email : 'N/A';
                return $provider;
            });

        return response()->json($pendingProviders);
    }

    // For showing approved providers
    public function approvedProviders()
    {
        $approvedProviders = Provider::with(['user', 'serviceCategory'])
            ->where('account_status', 'approved')
            ->get()
            ->map(function ($provider) {
                $provider->profile_pic = $provider->profile_pic ? asset($provider->profile_pic) : null;
                $provider->attachment = $provider->attachment ? asset($provider->attachment) : null;
                $provider->service_type_name = $provider->serviceCategory ? $provider->serviceCategory->category_name : 'Unknown';
                $provider->email = $provider->user ? $provider->user->email : 'N/A';
                return $provider;
            });

        return response()->json($approvedProviders);
    }

    // For showing providers under a certain category
    public function getProvidersByCategory($categoryId)
    {
        $providers = Provider::with('bookings')  // Include bookings for ratings
            ->where('account_status', 'approved')
            ->where('service_type', $categoryId)
            ->get()
            ->map(function ($provider) {
                // ✅ Dynamically calculate the average rating
                $averageRating = $provider->bookings()->avg('provider_rate');

                return [
                    'provider_id' => $provider->provider_id,
                    'businessName' => $provider->provider_name,
                    'logo' => $provider->profile_pic ? asset($provider->profile_pic) : null,
                    'rating' => $averageRating ? round($averageRating, 1) : 0, // ✅ Round to 1 decimal place
                    'location' => $provider->city . ', ' . $provider->province
                ];
            });

        return response()->json($providers);
    }

    //For showing details of selected service provider
    public function getProviderDetails($id)
    {
        $provider = Provider::with(['user', 'services']) // Assuming there's a relation for services
            ->where('provider_id', $id)
            ->first();

        if (!$provider) {
            return response()->json(['message' => 'Provider not found'], 404);
        }

        return response()->json([
            'provider_id' => $provider->provider_id,
            'provider_name' => $provider->provider_name,
            'profile_pic' => $provider->profile_pic ? asset($provider->profile_pic) : null,
            'email' => $provider->user->email,
            'location' => "{$provider->city}, {$provider->province}",
            'description' => $provider->brn,
            'services' => $provider->services, // Assuming related services are fetched
            'feedbacks' => [] // Add feedback logic here if available
        ]);
    }

    public function getProfile($id)
    {
        $provider = Provider::with(['user', 'serviceCategory']) // ✅ Include serviceCategory relationship
            ->where('provider_id', $id)
            ->first();
    
        if (!$provider) {
            return response()->json(['message' => 'Provider not found'], 404);
        }
    
        return response()->json([
            'provider' => $provider,
            'email' => $provider->user->email ?? 'N/A',
            'profile_pic' => $provider->profile_pic ? asset($provider->profile_pic) : null,
            'service_type_name' => $provider->serviceCategory->category_name ?? 'N/A' // ✅ Fetch service category name
        ], 200);
    }

    public function getTopProviders()
{
    $topProviders = Provider::with(['bookings', 'user'])
        ->where('account_status', 'approved')
        ->get()
        ->map(function ($provider) {
            $bookingsCount = $provider->bookings->count();
            $averageRating = $provider->bookings->avg('provider_rate') ?? 0;

            return [
                'provider_id' => $provider->provider_id,
                'name' => $provider->provider_name,
                'logo' => $provider->profile_pic ? asset($provider->profile_pic) : 'https://placehold.co/600x600',
                'location' => "{$provider->city}, {$provider->province}",
                'bookings_count' => $bookingsCount,
                'average_rating' => round($averageRating, 1),
            ];
        })
        ->sortByDesc(function ($provider) {
            return $provider['bookings_count'] * 0.7 + $provider['average_rating'] * 0.3; // Weighted Ranking
        })
        ->take(6)  // Limit to top 6 providers
        ->values();

    return response()->json($topProviders);
}

public function getRecommendedProviders(Request $request)
{
    $user = Auth::user(); // Get the authenticated customer
    $customerBarangay = $user->brgy;
    $customerCity = $user->city;

    // Fetch approved providers
    $providers = Provider::with('bookings')
        ->where('account_status', 'approved')
        ->get()
        ->map(function ($provider) {
            $bookingsCount = $provider->bookings->count();
            $averageRating = $provider->bookings->avg('provider_rate') ?? 0;

            return [
                'provider_id' => $provider->provider_id,
                'name' => $provider->provider_name,
                'logo' => $provider->profile_pic ? asset($provider->profile_pic) : 'https://placehold.co/600x600',
                'location' => "{$provider->city}, {$provider->province}",
                'barangay' => $provider->brgy,
                'city' => $provider->city,
                'bookings_count' => $bookingsCount,
                'average_rating' => round($averageRating, 1),
            ];
        });

    // Apply sorting based on priority
    $recommendedProviders = $providers->sortByDesc(function ($provider) use ($customerBarangay, $customerCity) {
        $score = 0;

        if ($provider['barangay'] === $customerBarangay) {
            $score += 50; // Same barangay bonus
        }

        if ($provider['city'] === $customerCity) {
            $score += 30; // Same city bonus
        }

        $score += $provider['bookings_count'] * 0.1; // Weight for bookings
        $score += $provider['average_rating'] * 2;   // Weight for rating

        return $score;
    })->take(6)->values(); // Limit to 6 recommended providers

    return response()->json($recommendedProviders);
}

public function getProviderFeedbacks($providerId)
{
    $feedbacks = Booking::where('provider_id', $providerId)
        ->whereNotNull('provider_feedback') // ✅ Only get bookings with feedback
        ->with('customer')                 // ✅ Fetch customer info using hasOne
        ->get()
        ->map(function ($booking) {
            return [
                'clientName' => $booking->customer->customer_name ?? 'Anonymous', // ✅ Display customer name
                'rating' => $booking->provider_rate,
                'reviewText' => $booking->provider_feedback,
            ];
        });

    return response()->json($feedbacks);
}

public function getDashboardStats($providerId)
{
    $pendingCount = Booking::where('provider_id', $providerId)
        ->where('book_status', 'Pending')
        ->count();

    $ongoingCount = Booking::where('provider_id', $providerId)
        ->where('book_status', 'Ongoing')
        ->count();

    $completedCount = Booking::where('provider_id', $providerId)
        ->where('book_status', 'Completed')
        ->count();

    return response()->json([
        'pending' => $pendingCount,
        'ongoing' => $ongoingCount,
        'completed' => $completedCount
    ]);
}

public function getTodaysBookings($providerId)
{
    $today = Carbon::today();

    $bookings = Booking::with('customer') // ✅ Eager load customer data
        ->where('provider_id', $providerId)
        ->whereDate('book_date', $today)
        ->get()
        ->map(function ($booking) {
            // ✅ Decode JSON-encoded service IDs
            $serviceIds = json_decode($booking->services, true);

            // ✅ Fetch services based on service IDs
            $services = Service::whereIn('service_id', $serviceIds)->get(['service_id', 'service_name']);

            return [
                'booking_id'   => $booking->booking_id,
                'book_date'    => $booking->book_date,
                'book_time'    => $booking->book_time,
                'book_status'  => $booking->book_status,
                'services'     => $services, // ✅ Attach fetched services
                'customer'     => $booking->customer ? [
                    'name'    => $booking->customer->customer_name,
                    'address' => "{$booking->customer->house_add}, {$booking->customer->brgy}, {$booking->customer->city}, {$booking->customer->province}"
                ] : [
                    'name'    => 'Anonymous',
                    'address' => 'N/A'
                ] // ✅ Attach customer details (with fallback)
            ];
        });

    return response()->json($bookings);
}




}
