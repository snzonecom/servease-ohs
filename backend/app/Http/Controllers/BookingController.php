<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
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
            'book_status' => 'waiting',
        ]);
    
        return response()->json(['message' => 'Booking submitted successfully.'], 201);
    }
    

    // ✅ Get bookings for the logged-in user
    public function userBookings()
    {
        $bookings = Booking::with('provider')  // ✅ Load related provider
            ->where('user_id', Auth::id())
            ->get();
    
        return response()->json($bookings);
    }    

    // ✅ Update booking status (for provider)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'book_status' => 'required|in:waiting,accepted,rejected,cancelled,completed',
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
    
}
