<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Provider;
use App\Models\User;
use App\Models\Booking;
use App\Models\ServiceCategory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\Service;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class ProviderController extends Controller
{
    public function generateReportPDF(Request $request)
    {
        // ✅ Get start_date and end_date
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // ✅ Fetch data within the date range
        $registeredProviders = Provider::whereBetween('created_at', [$startDate, $endDate])->get();
        $totalProviders = $registeredProviders->count();

        $serviceCategories = ServiceCategory::all();
        $totalCategories = $serviceCategories->count();

        $registeredUsers = User::whereBetween('created_at', [$startDate, $endDate])->count();

        // ✅ Top Providers Query
        $topProviders = Booking::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('provider_id, COUNT(*) as total_bookings')
            ->groupBy('provider_id')
            ->orderByDesc('total_bookings')
            ->with('provider')
            ->get()
            ->map(fn($booking) => [
                'provider_name' => $booking->provider?->provider_name ?? 'Unknown',
                'total_bookings' => $booking->total_bookings
            ]);

        $bookings = Booking::whereBetween('created_at', [$startDate, $endDate])->get();

        $serviceCounts = [];

        foreach ($bookings as $booking) {
            $services = json_decode($booking->services, true); // Decode JSON
            if (is_array($services)) {
                foreach ($services as $serviceId) {
                    if (!isset($serviceCounts[$serviceId])) {
                        $serviceCounts[$serviceId] = 0;
                    }
                    $serviceCounts[$serviceId]++;
                }
            }
        }

        // Fetch service names based on IDs
        $popularServices = collect($serviceCounts)
            ->map(function ($totalBookings, $serviceId) {
                $service = \App\Models\Service::find($serviceId);
                return [
                    'service_name' => $service?->service_name ?? 'Unknown',
                    'total_bookings' => $totalBookings,
                ];
            })
            ->sortByDesc('total_bookings')
            ->values(); // Reset array keys


        // ✅ HTML Template
        $html = "
        <html>
        <head>
        <title>Service Report</title>
        <style>
        body { font-family: Arial, sans-serif; }
        h2, h3 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        </style>
        </head>
        <body>
        <h2>SERVEASE System Report</h2>
        <h3>From $startDate to $endDate</h3>

        <h4>New Registered Providers: $totalProviders</h4>
        <table>
        <tr><th>Provider Name</th><th>BRN</th><th>Date Created</th></tr>";

        foreach ($registeredProviders as $provider) {
            $html .= "<tr>
                <td>{$provider->provider_name}</td>
                <td>{$provider->brn}</td>
                <td>{$provider->created_at}</td>
            </tr>";
        }

        $html .= "</table>

        <h4>New Registered Users: $registeredUsers</h4>

        <h4>Popular Services</h4>
        <table>
        <tr><th>Service Name</th><th>Total Bookings</th></tr>";

        foreach ($popularServices as $service) {
            $html .= "<tr>
                <td>{$service['service_name']}</td>
                <td>{$service['total_bookings']}</td>
            </tr>";
        }

        $html .= "</table>

        <h4>Top Providers</h4>
        <table>
        <tr><th>Provider Name</th><th>Total Bookings</th></tr>";

        foreach ($topProviders as $provider) {
            $html .= "<tr>
                <td>{$provider['provider_name']}</td>
                <td>{$provider['total_bookings']}</td>
            </tr>";
        }

        $html .= "</table>
        
        <h4>Total Service Categories: $totalCategories</h4>
        <table>
        <tr><th>Category Name</th></tr>";

        foreach ($serviceCategories as $category) {
            $html .= "<tr><td>{$category->category_name}</td></tr>";
        }

        $html .= "</table>
        
        </body>
        </html>";


        // ✅ Generate PDF from HTML
        $pdf = Pdf::loadHTML($html);

        // ✅ Return Streamed PDF Download
        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->output();
        }, 'service_report_' . now()->format('Y-m-d') . '.pdf');
    }


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
        $user = User::find(Auth::id());

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
            'description' => 'nullable|string|max:1000', // ✅ Allow description with a max length of 1000
            'password' => 'nullable|string|min:6',
            'profile_pic' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        // ✅ Prevent Null Values from Overwriting Existing Data
        $provider->update([
            'contact_no' => $request->input('contact_no') ?? $provider->contact_no,
            'office_add' => $request->input('office_add') ?? $provider->office_add,
            'brgy' => $request->input('brgy') ?? $provider->brgy,
            'city' => $request->input('city') ?? $provider->city,
            'province' => $request->input('province') ?? $provider->province,
            'contact_person' => $request->input('contact_person') ?? $provider->contact_person,
            'description' => $request->input('description') ?? $provider->description, // ✅ Add description update
        ]);

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

        // ✅ Handle Profile Picture Upload
        if ($request->hasFile('profile_pic')) {
            if ($provider->profile_pic) {
                Storage::delete($provider->profile_pic);
            }
            $path = $request->file('profile_pic')->store('uploads/logos', 'public');
            $provider->profile_pic = 'storage/' . $path;
            $provider->save();
        }

        return response()->json([
            'message' => 'Profile updated successfully!',
            'provider' => $provider
        ]);
    }


    public function uploadProfilePicture(Request $request)
    {
        $provider = Provider::where('user_id', Auth::id())->first();

        if (!$provider) {
            return response()->json(['message' => 'Provider not found'], 404);
        }

        // ✅ Validate Image
        $request->validate([
            'profile_pic' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        // ✅ Store New Image
        if ($request->hasFile('profile_pic')) {
            if ($provider->profile_pic) {
                Storage::delete($provider->profile_pic);
            }
            $path = $request->file('profile_pic')->store('uploads/logos', 'public');
            $provider->profile_pic = 'storage/' . $path;
            $provider->save();
        }

        return response()->json([
            'message' => 'Profile picture updated successfully!',
            'profile_pic' => asset($provider->profile_pic)
        ]);
    }

    /**
     * ✅ Soft Delete a Provider (instead of permanent deletion)
     */
    public function destroy($id)
    {
        $provider = Provider::find($id);

        if (!$provider) {
            return response()->json(['message' => 'Provider not found'], 404);
        }

        // ✅ Fetch Provider Email
        $user = User::find($provider->user_id);
        if (!$user || !$user->email) {
            return response()->json(['error' => 'Provider email not found'], 404);
        }

        DB::transaction(function () use ($provider, $user) {
            // ✅ Update account status to "deleted"
            DB::table('tbl_provider_info')
                ->where('provider_id', $provider->provider_id)
                ->update(['account_status' => 'deleted']);

            // ✅ Soft Delete the Provider
            $provider->delete();

            // ✅ Soft Delete the Associated User
            $user->delete();
        });

        // ✅ Prepare Email Notification
        $subject = "Account Deactivation Notice";
        $emailBody = "
            <html>
            <head>
                <style>
                    body { font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px;
                        border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center; }
                    h2 { color: #d9534f; font-weight: 600; }
                    p { color: #555; font-size: 16px; font-weight: 400; }
                    .footer { margin-top: 20px; font-size: 14px; color: #777; font-weight: 300; }
                    .footer a { color: #d9534f; text-decoration: none; font-weight: 400; }
                    .footer a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2>Account Deactivation</h2>
                    <p>Dear {$provider->provider_name},</p>
                    <p>We regret to inform you that your service provider account has been deactivated.</p>
                    
                    <p>If you believe this was a mistake or wish to appeal, please contact our support team.</p>
    
                    <div class='footer'>
                        <p>Need help? Contact us at <a href='mailto:phservease@gmail.com'>phservease@gmail.com</a></p>
                        <p>&copy; " . date('Y') . " SERVEASE. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        // ✅ Send Email to Provider
        Mail::html($emailBody, function ($message) use ($user, $subject) {
            $message->to($user->email)
                ->subject($subject);
        });

        return response()->json(['message' => 'Provider and account soft-deleted successfully, status set to deleted, email sent']);
    }



    /**
     * ✅ Restore a Soft-Deleted Provider and Update Status
     */
    public function restoreProvider(Request $request)
    {
        $id = $request->input('id'); // ✅ Get provider_id from request
        $provider = Provider::onlyTrashed()->where('provider_id', $id)->first();

        if (!$provider) {
            return response()->json(['message' => 'Provider not found or not deleted'], 404);
        }

        DB::transaction(function () use ($provider) {
            // ✅ Restore the provider (removes `deleted_at`)
            $provider->restore();

            // ✅ Restore the associated user
            $user = User::onlyTrashed()->where('id', $provider->user_id)->first();
            if ($user) {
                $user->restore();
            }

            // ✅ Ensure account status is set to "pending"
            DB::table('tbl_provider_info')->where('provider_id', $provider->provider_id)->update(['account_status' => 'pending']);
        });

        return response()->json(['message' => 'Provider and user account restored, status set to pending.']);
    }


    /**
     * ✅ Permanently Delete a Provider (Force Delete)
     */
    public function forceDeleteProvider($id)
    {
        $provider = Provider::onlyTrashed()->find($id);
        if (!$provider) {
            return response()->json(['message' => 'Provider not found or not deleted'], 404);
        }

        // ✅ Find and Permanently Delete the Associated User
        $user = User::onlyTrashed()->find($provider->user_id);
        if ($user) {
            $user->forceDelete();
        }

        // ✅ Permanently Delete the Provider
        $provider->forceDelete();

        return response()->json(['message' => 'Provider and account permanently deleted']);
    }


    public function approve($id)
    {
        $provider = Provider::findOrFail($id);

        // ✅ Fetch Email from Users Table if Not in Providers Table
        $user = \App\Models\User::where('id', $provider->user_id)->first();
        $email = $user ? $user->email : null;

        if (!$email) {
            return response()->json(['error' => 'Provider does not have an email address.'], 400);
        }

        $provider->account_status = 'approved';
        $provider->save();

        // ✅ Email Subject & Content
        $subject = "Your Service Provider Application is Approved";
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:4200');
        $dashboardUrl = "{$frontendUrl}/login";

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
                    <h2>Congratulations!</h2>
                    <p>Your service provider application has been approved.</p>
                    <p>You can now log in and start managing your services.</p>
                    
                    <a href='{$dashboardUrl}' class='btn'>Go to Login</a>
    
                    <p>Thank you for joining us!</p>
    
                    <div class='footer'>
                        <p>Need help? Contact us at <a href='mailto:phservease@gmail.com'>phservease@gmail.com</a></p>
                        <p>&copy; " . date('Y') . " SERVEASE. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        // ✅ Send Email
        Mail::html($emailBody, function ($message) use ($email, $subject) {
            $message->to($email)
                ->subject($subject);
        });

        return response()->json(['message' => 'Provider application approved and email sent.']);
    }

    public function reject(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);

        // ✅ Validate the request (Ensure rejection reason and description are provided)
        $request->validate([
            'reject_type' => 'required|string|max:255',
            'reject_description' => 'nullable|string',
        ]);

        // ✅ Fetch Email from Users Table if Not in Providers Table
        $user = \App\Models\User::where('id', $provider->user_id)->first();
        $email = $user ? $user->email : null;

        DB::transaction(function () use ($provider, $request) {
            // ✅ Update account status to "rejected"
            $provider->account_status = 'rejected';
            $provider->reject_type = $request->reject_type;
            $provider->reject_description = $request->reject_description;
            $provider->save();

            // ✅ Soft delete (sets deleted_at)
            $provider->delete();
        });

        // ✅ Send Rejection Email (If Email Exists)
        if ($email) {
            $subject = "Your Service Provider Application was Rejected";
            $emailBody = "
                <html>
                <head>
                    <style>
                        body { font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px;
                            border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center; }
                        h2 { color: #d9534f; font-weight: 600; }
                        p { color: #555; font-size: 16px; font-weight: 400; }
                        .footer { margin-top: 20px; font-size: 14px; color: #777; font-weight: 300; }
                        .footer a { color: #d9534f; text-decoration: none; font-weight: 400; }
                        .footer a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h2>Application Rejected</h2>
                        <p>Dear {$provider->provider_name},</p>
                        <p>We regret to inform you that your service provider application has been rejected.</p>
                        <p><strong>Reason:</strong> {$request->reject_type}</p>
                        <p><strong>Additional Information:</strong> " . (!empty($request->reject_description) ? $request->reject_description : "No additional details provided.") . "</p>
                        <p>If you have any questions, feel free to contact support.</p>
    
                        <div class='footer'>
                            <p>Need help? Contact us at <a href='mailto:phservease@gmail.com'>phservease@gmail.com</a></p>
                            <p>&copy; " . date('Y') . " SERVEASE. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            ";

            Mail::html($emailBody, function ($message) use ($email, $subject) {
                $message->to($email)->subject($subject);
            });
        }

        return response()->json(['message' => 'Provider application rejected, reason recorded, soft deleted, and email sent if available.']);
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
    public function getProvidersByCategory($categoryId)
    {
        // ✅ Fetch category details
        $category = DB::table('tbl_categories')->where('category_id', $categoryId)->first();

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // ✅ Fetch providers under the category
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

        return response()->json([
            'category_name' => $category->category_name,
            'category_description' => $category->category_description,
            'providers' => $providers
        ]);
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
            'description' => $provider->description,
            'profile_pic' => $provider->profile_pic ? asset($provider->profile_pic) : null,
            'email' => $provider->user->email,
            'location' => "{$provider->city}, {$provider->province}",
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
        $topProviders = Provider::with(['bookings', 'serviceCategory']) // ✅ Load service category
            ->where('account_status', 'approved')
            ->get()
            ->map(function ($provider) {
                $bookingsCount = $provider->bookings->count();
                $averageRating = $provider->bookings->avg('provider_rate') ?? 0;

                return [
                    'provider_id' => $provider->provider_id,
                    'name' => $provider->provider_name,
                    'description' => $provider->description,
                    'serviceCategory' => $provider->serviceCategory ? $provider->serviceCategory->category_name : 'N/A', // ✅ Ensure category is included
                    'acquiredBookings' => $bookingsCount, // ✅ Ensure booking count is included
                    'logo' => $provider->profile_pic ? asset($provider->profile_pic) : 'https://placehold.co/600x600',
                    'location' => "{$provider->city}, {$provider->province}",
                    'average_rating' => round($averageRating, 1),
                ];
            })
            ->sortByDesc(function ($provider) {
                return $provider['acquiredBookings'] * 0.7 + $provider['average_rating'] * 0.3; // Weighted Ranking
            })
            ->take(6)  // ✅ Limit to top 6 providers
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
            ->whereNotNull('provider_rate')
            ->with('customer')
            ->get()
            ->map(function ($booking) {
                return [
                    'clientName' => $booking->customer->customer_name ?? 'Anonymous',
                    'rating' => $booking->provider_rate,
                    'reviewText' => $booking->provider_feedback,
                    'comment' => $booking->comment,
                    'proof' => $booking->proof ? asset('storage/' . $booking->proof) : null,
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
            ->where('book_status', 'Ongoing')
            ->get()
            ->map(function ($booking) {
                // ✅ Decode JSON-encoded service IDs
                $serviceIds = json_decode($booking->services, true);

                // ✅ Fetch services based on service IDs
                $services = Service::whereIn('service_id', $serviceIds)->get(['service_id', 'service_name']);

                return [
                    'booking_id' => $booking->booking_id,
                    'book_date' => $booking->book_date,
                    'book_time' => $booking->book_time,
                    'book_status' => $booking->book_status,
                    'services' => $services, // ✅ Attach fetched services
                    'customer' => $booking->customer ? [
                        'name' => $booking->customer->customer_name,
                        'address' => "{$booking->customer->house_add}, {$booking->customer->brgy}, {$booking->customer->city}, {$booking->customer->province}"
                    ] : [
                        'name' => 'Anonymous',
                        'address' => 'N/A'
                    ] // ✅ Attach customer details (with fallback)
                ];
            });

        return response()->json($bookings);
    }

    public function getAdminDashboardStats()
    {
        $pendingProviders = Provider::where('account_status', 'pending')->count();
        $registeredProviders = Provider::where('account_status', 'approved')->count();
        $serviceCategories = DB::table('tbl_categories')->count();
        $registeredUsers = DB::table('users')->count();

        return response()->json([
            'pending_providers' => $pendingProviders,
            'registered_providers' => $registeredProviders,
            'service_categories' => $serviceCategories,
            'registered_users' => $registeredUsers
        ]);
    }

    public function getNewApplications()
    {
        // ✅ Fetch the most recent pending applications
        $applications = Provider::where('account_status', 'pending')
            ->orderBy('created_at', 'desc') // Sort by newest first
            ->limit(7) // ✅ Get the latest 7 applications
            ->get()
            ->map(function ($provider) {
                return [
                    'applicant_name' => $provider->provider_name,
                    'submitted_time' => Carbon::parse($provider->created_at)->diffForHumans() // ✅ Convert timestamp to 'X minutes ago'
                ];
            });

        return response()->json($applications);
    }

    public function getApprovedProvidersByCategory()
    {
        $categories = DB::table('tbl_provider_info')
            ->join('tbl_categories', 'tbl_provider_info.service_type', '=', 'tbl_categories.category_id')
            ->where('tbl_provider_info.account_status', 'approved')
            ->select('tbl_categories.category_name', DB::raw('COUNT(tbl_provider_info.provider_id) as total_providers'))
            ->groupBy('tbl_categories.category_name')
            ->orderByDesc('total_providers')
            ->get();

        return response()->json($categories);
    }

    /**
     * ✅ Get Soft-Deleted Providers
     */
    public function getDeletedProviders()
    {
        $deletedProviders = Provider::onlyTrashed()->get();

        \Log::info('Soft Deleted Providers:', ['providers' => $deletedProviders]);

        return response()->json($deletedProviders);
    }
}
