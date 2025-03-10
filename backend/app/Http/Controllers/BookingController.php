<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Provider;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingController extends Controller
{
    // Get Fully Booked Dates
    public function getFullyBookedDates()
    {
        $fullyBookedDates = DB::table('tbl_bookings')
            ->select('book_date')
            ->groupBy('book_date')
            ->havingRaw('COUNT(DISTINCT book_time) = 3') // If all 3 slots are booked
            ->pluck('book_date');

        return response()->json($fullyBookedDates);
    }

    // Get Booked Slots for a Specific Date
    public function getBookedSlots(Request $request)
    {
        $bookedSlots = DB::table('tbl_bookings')
            ->where('book_date', $request->query('date'))
            ->pluck('book_time');

        return response()->json($bookedSlots);
    }

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
            'use_another_address' => 'required|boolean',
        ]);
    
        $userId = Auth::id();
        $user = Auth::user();
    
        // ✅ Fetch Provider's Email Correctly
        $provider = DB::table('tbl_provider_info')
            ->join('users', 'tbl_provider_info.user_id', '=', 'users.id')
            ->where('tbl_provider_info.provider_id', $request->provider_id)
            ->select('users.email', 'tbl_provider_info.provider_name')
            ->first();
    
        if (!$provider || !$provider->email) {
            return response()->json(['error' => 'Provider not found or missing email.'], 404);
        }
    
        // ✅ Fetch Customer Name & Default Address
        $customer = DB::table('tbl_customer_info')
            ->where('user_id', $userId)
            ->select('customer_name', 'house_add', 'brgy', 'city', 'province')
            ->first();
    
        if (!$customer) {
            return response()->json(['error' => 'Customer information not found.'], 404);
        }
    
        // ✅ Determine Final Address
        if ($request->use_another_address) {
            $finalAddress = trim("{$request->new_address}, {$request->new_brgy}, {$request->new_city}, {$request->new_province}", ", ");
        } else {
            $finalAddress = trim("{$customer->house_add}, {$customer->brgy}, {$customer->city}, {$customer->province}", ", ");
        }
    
        // ✅ Fetch Service Names
        $serviceNames = DB::table('tbl_services')
            ->whereIn('service_id', $request->services)
            ->pluck('service_name')
            ->toArray();
    
        if (empty($serviceNames)) {
            return response()->json(['error' => 'Invalid service selection.'], 400);
        }
    
        // ✅ Create Booking
        Booking::create([
            'user_id' => $userId,
            'provider_id' => $request->provider_id,
            'services' => json_encode($request->services),
            'book_date' => $request->book_date,
            'book_time' => $request->book_time,
            'book_status' => 'Pending',
            'booking_address' => $finalAddress, // ✅ Store the final address
        ]);
    
        // ✅ Correct Email Variables
        $servicesList = implode(', ', $serviceNames);
        $customerName = $customer->customer_name;
    
        // ✅ Prepare Email Body
        $subject = "New Booking Request from {$customerName}";
        $emailBody = "
        <html>
        <head>
            <style>
                body { font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px;
                    border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center; }
                h2 { color: #333; font-weight: 600; }
                p { color: #555; font-size: 16px; font-weight: 400; }
                .btn { display: inline-block; background-color: #428eba; color: white !important; padding: 12px 20px;
                    text-decoration: none !important; border-radius: 5px; font-size: 16px; font-weight: 600; margin-top: 15px; }
                .btn:hover { background-color: #356a8a; }
                .footer { margin-top: 20px; font-size: 14px; color: #777; font-weight: 300; }
                .footer a { color: #428eba; text-decoration: none; font-weight: 400; }
                .footer a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h2>New Booking Request</h2>
                <p><strong>Customer:</strong> {$customerName}</p>
                <p><strong>Services:</strong> {$servicesList}</p>
                <p><strong>Address:</strong> {$finalAddress}</p>
                <p><strong>Date Requested:</strong> {$request->book_date}</p>
                <p><strong>Time Requested:</strong> {$request->book_time}</p>
    
                <p>Please confirm or reject the booking request in your dashboard.</p>
    
                <div class='footer'>
                    <p>Need help? Contact us at <a href='mailto:phservease@gmail.com'>phservease@gmail.com</a></p>
                    <p>&copy; " . date('Y') . " SERVEASE. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    
        // ✅ Send Email to Provider
        Mail::html($emailBody, function ($message) use ($provider, $subject) {
            $message->to($provider->email)
                ->subject($subject);
        });
    
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
        $previousStatus = $booking->book_status;
        $newStatus = $request->book_status;

        // ✅ Update Booking Status
        $booking->update(['book_status' => $newStatus]);

        // ✅ Fetch Customer Details
        $customer = DB::table('tbl_customer_info')
            ->join('users', 'tbl_customer_info.user_id', '=', 'users.id')
            ->where('tbl_customer_info.user_id', $booking->user_id)
            ->select('users.email', 'tbl_customer_info.customer_name')
            ->first();

        if (!$customer || !$customer->email) {
            return response()->json(['error' => 'Customer not found or missing email.'], 404);
        }

        // ✅ Fetch Provider Name
        $provider = DB::table('tbl_provider_info')
            ->where('provider_id', $booking->provider_id)
            ->select('provider_name')
            ->first();

        // ✅ Fetch Service Names
        $serviceNames = DB::table('tbl_services')
            ->whereIn('service_id', json_decode($booking->services))
            ->pluck('service_name')
            ->toArray();

        if (empty($serviceNames)) {
            return response()->json(['error' => 'Invalid service selection.'], 400);
        }

        // ✅ Prepare Email Details
        $servicesList = implode(', ', $serviceNames);
        $customerName = $customer->customer_name;
        $providerName = $provider ? $provider->provider_name : 'Service Provider';

        $subject = "Booking Status Updated: {$newStatus}";

        $statusMessages = [
            'Pending' => "Your booking is pending for approval by your chosen service provider.",
            'Ongoing' => "Your booking is now accepted! The provider will get in touch to you before and during your service transaction.",
            'Rejected' => "Your booking has been rejected by the service provider.",
            'Cancelled' => "Your booking has been cancelled by your chosen service provider.",
            'Completed' => "Your booking has been successfully completed. Thank you for choosing our services!"
        ];

        $emailBody = "
            <html>
            <head>
                <style>
                    body { font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px;
                        border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center; }
                    h2 { color: #333; font-weight: 600; }
                    p { color: #555; font-size: 16px; font-weight: 400; }
                    .status { font-size: 18px; font-weight: bold; color: #428eba; }
                    .footer { margin-top: 20px; font-size: 14px; color: #777; font-weight: 300; }
                    .footer a { color: #428eba; text-decoration: none; font-weight: 400; }
                    .footer a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2>Booking Status Updated</h2>
                    <p><strong>Dear {$customerName},</strong></p>
                    <p>Your booking status has been updated by <strong>{$providerName}</strong>.</p>
                    
                    <p><strong>Services:</strong> {$servicesList}</p>
                    <p><strong>Date:</strong> {$booking->book_date}</p>
                    <p><strong>Time:</strong> {$booking->book_time}</p>
    
                    <p class='status'>Status: {$newStatus}</p>
                    <p>{$statusMessages[$newStatus]}</p>
    
                    <div class='footer'>
                        <p>Need help? Contact us at <a href='mailto:phservease@gmail.com'>phservease@gmail.com</a></p>
                        <p>&copy; " . date('Y') . " SERVEASE. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        // ✅ Send Email to Customer
        Mail::html($emailBody, function ($message) use ($customer, $subject) {
            $message->to($customer->email)
                ->subject($subject);
        });

        return response()->json(['message' => 'Booking status updated successfully. Notification sent to customer.'], 200);
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

        // ✅ Fetch Provider Details
        $provider = DB::table('tbl_provider_info')
            ->join('users', 'tbl_provider_info.user_id', '=', 'users.id')
            ->where('tbl_provider_info.provider_id', $booking->provider_id)
            ->select('users.email', 'tbl_provider_info.provider_name')
            ->first();

        if (!$provider || !$provider->email) {
            return response()->json(['error' => 'Provider not found or missing email.'], 404);
        }

        // ✅ Fetch Customer Name from `tbl_customer_info`
        $customer = DB::table('tbl_customer_info')
            ->where('user_id', $booking->user_id)
            ->select('customer_name')
            ->first();

        if (!$customer) {
            return response()->json(['error' => 'Customer information not found.'], 404);
        }

        // ✅ Fetch Service Names
        $serviceNames = DB::table('tbl_services')
            ->whereIn('service_id', json_decode($booking->services))
            ->pluck('service_name')
            ->toArray();

        if (empty($serviceNames)) {
            return response()->json(['error' => 'Invalid service selection.'], 400);
        }

        // ✅ Update Booking Status
        $booking->book_status = 'Cancelled';
        $booking->save();

        // ✅ Prepare Email Details
        $servicesList = implode(', ', $serviceNames);
        $subject = "Booking Cancelled by {$customer->customer_name}";
        $emailBody = "
            <html>
            <head>
                <style>
                    body { font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px;
                        border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center; }
                    h2 { color: #333; font-weight: 600; }
                    p { color: #555; font-size: 16px; font-weight: 400; }
                    .btn { display: inline-block; background-color: #ff4d4d; color: white !important; padding: 12px 20px;
                        text-decoration: none !important; border-radius: 5px; font-size: 16px; font-weight: 600; margin-top: 15px; }
                    .btn:hover { background-color: #cc0000; }
                    .footer { margin-top: 20px; font-size: 14px; color: #777; font-weight: 300; }
                    .footer a { color: #ff4d4d; text-decoration: none; font-weight: 400; }
                    .footer a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2>Booking Cancelled</h2>
                    <p><strong>Customer:</strong> {$customer->customer_name}</p>
                    <p><strong>Services:</strong> {$servicesList}</p>
                    <p><strong>Date Requested:</strong> {$booking->book_date}</p>
                    <p><strong>Time Requested:</strong> {$booking->book_time}</p>
    
                    <p><strong>Status:</strong> Cancelled</p>
    
                    <p>This booking has been cancelled by the customer.</p>
    
                    <div class='footer'>
                        <p>Need help? Contact us at <a href='mailto:phservease@gmail.com'>phservease@gmail.com</a></p>
                        <p>&copy; " . date('Y') . " SERVEASE. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        // ✅ Send Email to Provider
        Mail::html($emailBody, function ($message) use ($provider, $subject) {
            $message->to($provider->email)
                ->subject($subject);
        });

        return response()->json(['message' => 'Booking cancelled successfully. Notification sent to provider.'], 200);
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
