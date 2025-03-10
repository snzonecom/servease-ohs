<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Booking;

class PaymentController extends Controller
{
    protected $baseUrl = 'https://api.paymongo.com/v1';
    protected $secretKey; // Your PayMongo Secret Key

    public function __construct()
    {
        // Set your PayMongo secret key from .env file
        $this->secretKey = env('PAYMONGO_SECRET_KEY', 'sk_test_NKf3cka6xgqnjZ3s33joLhGa');
    }

    /**
     * Create a payment link
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPaymentLink(Request $request)
    {
        // Validate request data
        $validated = $request->validate([
            'amount' => 'required|numeric|min:10000', // Amount in cents (minimum 100 cents or 1 PHP)
            'description' => 'required|string|max:255',
            'remarks' => 'nullable|string|max:255',
        ]);

        try {
            // Prepare the request data
            $data = [
                'data' => [
                    'attributes' => [
                        'amount' => $validated['amount'],
                        'description' => $validated['description'],
                        'remarks' => $validated['remarks'] ?? null,
                    ]
                ]
            ];

            // Send request to PayMongo API
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($this->secretKey . ':'),
            ])->withoutVerifying()->post($this->baseUrl . '/links', $data);
            

            // Check if request was successful
            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Payment link created successfully',
                    'data' => $response->json()
                ]);
            }

            // Return error if request failed
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment link',
                'error' => $response->json()
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }    
}