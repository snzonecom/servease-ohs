<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\AuthController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    Route::get('/admin-dashboard', [AdminController::class, 'index']);
});


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

/* for providers */
Route::get('/providers', [ProviderController::class, 'index']);


/* for service category */
Route::get('/service-category', [ServiceCategoryController::class, 'index']);


