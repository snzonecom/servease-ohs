<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\AuthController;

/* ✅ Authentication Routes */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register-provider', [AuthController::class, 'registerProvider']); // ✅ Registration here
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

/* ✅ Service Categories */
Route::get('/service-category', [ServiceCategoryController::class, 'index']);
Route::get('/service-categories', [ServiceCategoryController::class, 'getCategories']);
Route::post('/service-category', [ServiceCategoryController::class, 'store']);
Route::put('/service-category/{id}', [ServiceCategoryController::class, 'update']);
Route::delete('/service-category/{id}', [ServiceCategoryController::class, 'destroy']);

/* ✅ Service Providers */
Route::prefix('providers')->group(function () {
    Route::get('/', [ProviderController::class, 'index']);
    Route::get('/{id}', [ProviderController::class, 'show']);
    Route::put('/{id}', [ProviderController::class, 'update']);
    Route::delete('/{id}', [ProviderController::class, 'destroy']);
    Route::post('/{id}/approve', [ProviderController::class, 'approve']); //used in admin pending applications
    Route::post('/{id}/reject', [ProviderController::class, 'reject']); //used in admin pending applications
    Route::get('/count/approved', [ProviderController::class, 'countApprovedProviders']);
});

// FOR ADMIN - PENDING APPLICATIONS PAGE
Route::get('/pending-providers', [ProviderController::class, 'pendingProviders']);

// FOR ADMIN - LISTING APPROVED APPLICATIONS PAGE
Route::get('/approved-providers', [ProviderController::class, 'approvedProviders']);