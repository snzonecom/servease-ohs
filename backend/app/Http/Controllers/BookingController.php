<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

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
            'user_id'     => $userId,
            'provider_id' => $request->provider_id,
            'services'    => json_encode($request->services), // ✅ Store as JSON
            'book_date'   => $request->book_date,
            'book_time'   => $request->book_time,
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
        'provider_rate'     => 'required|numeric|min:1|max:5',
        'provider_feedback' => 'nullable|string',
    ]);

    $booking = Booking::findOrFail($id);

    // ✅ Check if the booking is completed before allowing a rating
    if ($booking->book_status !== 'Completed') {
        return response()->json(['error' => 'You can only rate completed bookings.'], 403);
    }

    $booking->update([
        'provider_rate'     => $request->provider_rate,
        'provider_feedback' => $request->provider_feedback,
    ]);

    return response()->json(['message' => 'Rating submitted successfully.']);
}

    
}
