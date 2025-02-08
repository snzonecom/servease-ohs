<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Provider;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingController extends Controller
{

    /**
     * ✅ Fetch Bookings for a Specific User
     */
    public function getBookingsByUser($userId)
    {
        $bookings = Booking::with(['provider'])
            ->where('user_id', $userId)
            ->get();

        return response()->json($bookings);
    }

    // ✅ Create a booking with multiple services
    public function store(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|integer',
            'services' => 'required|array|min:1',
            'book_date' => 'required|date',
            'book_time' => 'required|string',
        ]);

        $userId = Auth::id();

        Booking::create([
            'user_id' => $userId,
            'provider_id' => $request->provider_id,
            'services' => json_encode($request->services), // ✅ Store as JSON
            'book_date' => $request->book_date,
            'book_time' => $request->book_time,
            'book_status' => 'Pending',
        ]);

        return response()->json(['message' => 'Booking submitted successfully.'], 201);
    }

    // ✅ Get bookings for the logged-in user
    public function getUserBookings($userId)
    {
        $bookings = Booking::with(['provider']) // ✅ Only eager load provider
            ->where('user_id', $userId)
            ->get();

        return response()->json($bookings);
    }

    // ✅ Update booking status (for provider)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'book_status' => 'required|in:Pending,Ongoing,Rejected,Cancelled,Completed',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update(['book_status' => $request->book_status]);

        return response()->json(['message' => 'Booking status updated successfully.']);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'tbl_services', 'service_id');
    }

    // ✅ Submit Rating and Feedback
    public function submitRating(Request $request, $id)
    {
        $request->validate([
            'provider_rate' => 'required|numeric|min:1|max:5',
            'provider_feedback' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($id);

        // ✅ Check if the booking is completed before allowing a rating
        if ($booking->book_status !== 'Completed') {
            return response()->json(['error' => 'You can only rate completed bookings.'], 403);
        }

        $booking->update([
            'provider_rate' => $request->provider_rate,
            'provider_feedback' => $request->provider_feedback,
        ]);

        return response()->json(['message' => 'Rating submitted successfully.']);
    }

    // ✅ Get bookings for the logged-in provider
    public function getBookingsByProvider($providerId)
    {
        $pending = Booking::with(['user', 'provider', 'customer'])
            ->where('provider_id', $providerId)
            ->where('book_status', 'Pending')
            ->get();

        $ongoing = Booking::with(['user', 'provider', 'customer'])
            ->where('provider_id', $providerId)
            ->where('book_status', 'Ongoing')
            ->get();

        $completed = Booking::with(['user', 'provider', 'customer'])
            ->where('provider_id', $providerId)
            ->where('book_status', 'Completed')
            ->get();

        return response()->json([
            'pending' => $pending,
            'ongoing' => $ongoing,
            'completed' => $completed,
        ]);
    }

    public function setPrice(Request $request, $id)
    {
        $request->validate([
            'price' => 'required|numeric|min:0',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->price = $request->price;
        $booking->save();

        return response()->json(['message' => 'Price updated successfully.']);
    }

    public function getProviderTransactions($providerId)
    {
        $bookings = Booking::with(['user', 'customer'])
            ->where('provider_id', $providerId)
            ->get()
            ->map(function ($booking) {
                $booking->service_details = $booking->service_details;  // ✅ Attach service details
                return $booking;
            });

        return response()->json($bookings);

    }

    public function cancelBooking($bookingId)
    {
        $booking = Booking::find($bookingId);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        if ($booking->book_status !== 'Pending') {
            return response()->json(['message' => 'Only pending bookings can be cancelled.'], 400);
        }

        $booking->book_status = 'Cancelled';
        $booking->save();

        return response()->json(['message' => 'Booking cancelled successfully.', 'booking' => $booking], 200);
    }

    public function getAccumulatedBookings()
    {
        $weeks = [];
        $accumulatedBookings = [];

        for ($i = 5; $i >= 0; $i--) {
            $weekStart = Carbon::now()->subWeeks($i)->startOfWeek();
            $weekEnd = Carbon::now()->subWeeks($i)->endOfWeek();

            $weeks[] = "Week " . (6 - $i);
            $accumulatedBookings[] = Booking::whereBetween('book_date', [$weekStart, $weekEnd])->count();
        }

        return response()->json([
            'weeks' => $weeks,
            'accumulatedBookings' => $accumulatedBookings
        ]);
    }

    public function getPendingBookings()
    {
        $user = Auth::user();
    
        // Ensure the authenticated user is a provider
        if (!$user || !$user->provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }
    
        $providerId = $user->provider->provider_id;
    
        // ✅ Fetch the latest 7 pending bookings
        $pendingBookings = Booking::where('provider_id', $providerId)
            ->where('book_status', 'Pending')
            ->orderBy('created_at', 'desc') // Show newest bookings first
            ->limit(7)
            ->get()
            ->map(function ($booking) {
                return [
                    'customer_name' => $booking->user->email ?? 'Anonymous', // Fetch customer email
                    'submitted_time' => Carbon::parse($booking->created_at)->diffForHumans(), // Convert timestamp to 'X minutes ago'
                ];
            });
    
        return response()->json($pendingBookings);
    }
    


}
