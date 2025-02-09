<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DeletedProviderController;
use Illuminate\Http\Request;
use App\Http\Controllers\SystemInfoController;



// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register-provider', [AuthController::class, 'registerProvider']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::middleware('auth:sanctum')->post('/user/upload-profile-photo', [AuthController::class, 'uploadProfilePhoto']);


// Service Categories
Route::get('/service-category', [ServiceCategoryController::class, 'index']);
Route::get('/service-categories', [ServiceCategoryController::class, 'getCategories']); // display all categories
Route::post('/service-category', [ServiceCategoryController::class, 'store']);
Route::put('/service-category/{id}', [ServiceCategoryController::class, 'update']);
Route::delete('/service-category/{id}', [ServiceCategoryController::class, 'destroy']);
Route::get('/providers-by-category/{categoryId}', [ProviderController::class, 'getProvidersByCategory']);
Route::post('/service-category/{id}/restore', [ServiceCategoryController::class, 'restore']);
Route::get('/service-categories/deleted', [ServiceCategoryController::class, 'getDeletedCategories']);

// Service Providers
Route::prefix('providers')->group(function () {
    Route::get('/', [ProviderController::class, 'index']);
    Route::get('/{id}', [ProviderController::class, 'show']);
    Route::put('/{id}', [ProviderController::class, 'update']);
    Route::delete('/{id}', [ProviderController::class, 'destroy']);
    Route::post('/{id}/approve', [ProviderController::class, 'approve']); //used in admin pending applications
    Route::post('/{id}/reject', [ProviderController::class, 'reject']); //used in admin pending applications
    Route::get('/count/approved', [ProviderController::class, 'countApprovedProviders']);
});
Route::get('/provider/{id}', [ProviderController::class, 'getProviderDetails']); // get details of a specific service provider
Route::prefix('providers')->group(function () {
    Route::get('/deleted', [ProviderController::class, 'getDeletedProviders']);  // ✅ Get Soft-Deleted Providers
    Route::post('/restore', [ProviderController::class, 'restoreProvider']);  // ✅ Restore Provider
    Route::delete('/force-delete', [ProviderController::class, 'forceDeleteProvider']); // ✅ Permanently Delete Provider
});


// FOR ADMIN - PENDING APPLICATIONS PAGE
Route::get('/pending-providers', [ProviderController::class, 'pendingProviders']);

// FOR ADMIN - LISTING APPROVED APPLICATIONS PAGE
Route::get('/approved-providers', [ProviderController::class, 'approvedProviders']);


// PROVIDER SERVICES
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/provider/{providerId}/services', [ServiceController::class, 'getServicesByProvider']);
    Route::post('/provider/{providerId}/services', [ServiceController::class, 'store']);
    Route::put('/provider/{providerId}/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/provider/{providerId}/services/{id}', [ServiceController::class, 'destroy']);
});
Route::delete('/providers/{id}', [ProviderController::class, 'destroy']);  // ✅ Soft Delete Provider

Route::prefix('deleted-providers')->group(function () {
    Route::get('/', [DeletedProviderController::class, 'index']);  // ✅ Get Soft-Deleted Providers
    Route::post('/{id}/restore', [DeletedProviderController::class, 'restore']);  // ✅ Restore Provider
    Route::delete('/{id}/force-delete', [DeletedProviderController::class, 'forceDelete']); // ✅ Permanently Delete Provider
});


// BOOKINGS
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);                 // ✅ Create booking
    Route::get('/user/bookings', [BookingController::class, 'userBookings']);      // ✅ Get user's bookings
    Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']); // ✅ Update booking status
});
Route::put('/bookings/{bookingId}/status', [BookingController::class, 'updateBookingStatus']);

// Get all the bookings of the an user
Route::middleware('auth:sanctum')->get('/user/{userId}/bookings', [BookingController::class, 'getBookingsByUser']);

// Get all services
Route::get('/services', [ServiceController::class, 'getAllServices']);

// Submit a rating attached to a booking transaction
Route::post('/bookings/{id}/rate', [BookingController::class, 'submitRating']);

// See all bookings of provider
Route::get('/provider/{providerId}/bookings', [BookingController::class, 'getBookingsByProvider']);

// Attach a price to a booking - by service provider
Route::middleware('auth:sanctum')->put('/bookings/{id}/set-price', [BookingController::class, 'setPrice']);

// Get all the transactions of a specific user
Route::get('/provider/{providerId}/transactions', [BookingController::class, 'getProviderTransactions']);

// User Edit Profile
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUserProfile']);
Route::middleware('auth:sanctum')->put('/user/update-profile', [AuthController::class, 'updateUserProfile']);

// Provider Edit Profile
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/provider/{id}/profile', [ProviderController::class, 'getProfile']);
    Route::put('/provider/update-profile', [ProviderController::class, 'update']);
});
Route::middleware('auth:sanctum')->post('/provider/upload-profile-picture', [ProviderController::class, 'uploadProfilePicture']);


// For Public Home - To Get the Top Providers (based on number of bookings, and average rating)
Route::get('/top-providers', [ProviderController::class, 'getTopProviders']);

// For Registered User Home - To get the Reco Providers (Criteria: same brgy, city, number of bookings, average rating)
Route::middleware('auth:sanctum')->get('/recommended-providers', [ProviderController::class, 'getRecommendedProviders']);

// Get the feedbacks of a provider
Route::get('/provider/{providerId}/feedbacks', [ProviderController::class, 'getProviderFeedbacks']);

// Will allow the users to cancel a transaction when it is still Pending
Route::post('/bookings/{bookingId}/cancel', [BookingController::class, 'cancelBooking']);

// For service provider dashboard
Route::get('/provider/{providerId}/dashboard-stats', [ProviderController::class, 'getDashboardStats']);
Route::get('/provider/{providerId}/todays-bookings', [ProviderController::class, 'getTodaysBookings']);

Route::get('/admin/dashboard-stats', [ProviderController::class, 'getAdminDashboardStats']);
Route::get('/admin/top-providers', [ProviderController::class, 'getTopProviders']);
Route::get('/admin/popular-services', [ServiceController::class, 'getPopularServices']);
Route::get('/admin/accumulated-bookings', [BookingController::class, 'getAccumulatedBookings']);

// For notification feature of admin
Route::get('/admin/new-applications', [ProviderController::class, 'getNewApplications']);

// For Doughnut graph - admin dashboard
Route::get('/admin/approved-providers-per-category', [ProviderController::class, 'getApprovedProvidersByCategory']);

// Get system information
Route::get('/system-info', [SystemInfoController::class, 'index']);

// Update system information
Route::post('/system-info/update', [SystemInfoController::class, 'update']);