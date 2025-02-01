<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use DB;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string', // Role is mandatory
            'customer_name' => 'required|string',
            'contact_no' => 'required|string',
            'house_add' => 'required|string',
            'street' => 'required|string',
            'brgy' => 'required|string',
            'city' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Insert user and get the generated ID
            $userId = DB::table('users')->insertGetId([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Insert customer information
            if ($request->role == 'customer') {
                DB::table('tbl_customer_info')->insert([
                    'user_id' => $userId,
                    'customer_name' => $request->customer_name,
                    'contact_no' => $request->contact_no,
                    'house_add' => $request->house_add,
                    'street' => $request->street,
                    'brgy' => $request->brgy,
                    'city' => $request->city,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Registration successful'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Registration failed', 'message' => $e->getMessage()], 500);
        }
    }


    public function registerProvider(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'contactNumber' => 'required',
            'houseAdd' => 'required',
            'street' => 'required',
            'brgy' => 'required',
            'city' => 'required',
            'brn' => 'required',
            'contactPerson' => 'required',
            'serviceType' => 'required',
            'businessLogo' => 'nullable|image|mimes:jpg,png,jpeg',
            'personID' => 'nullable|image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $businessLogoPath = $request->hasFile('businessLogo') ? 
            $request->file('businessLogo')->store('uploads/logos', 'public') : null;

        $personIDPath = $request->hasFile('personID') ? 
            $request->file('personID')->store('uploads/ids', 'public') : null;

        $userId = DB::table('users')->insertGetId([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'provider',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('tbl_provider_info')->insert([
            'user_id' => $userId,
            'profile_pic' => $businessLogoPath,
            'provieder_name' => $request->fullName,
            'contact_no' => $request->contactNumber,
            'office_add' => $request->houseAdd,
            'street' => $request->street,
            'brgy' => $request->brgy,
            'city' => $request->city,
            'brn' => $request->brn,
            'contact_person' => $request->contactPerson,
            'attachment' => $personIDPath,
            'service_type' => $request->serviceType,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Registration successful!', 'user_id' => $userId], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = $request->user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role // Include role in the response
            ]
        ]);
        //return response()->json(['token' => $token, 'user' => $user]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        Password::sendResetLink($request->only('email'));

        return response()->json(['message' => 'Password reset link sent']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
            'token' => 'required',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successfully']);
        }

        return response()->json(['message' => 'Password reset failed'], 400);
    }

    public function verifyEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        $request->user()->markEmailAsVerified();

        return response()->json(['message' => 'Email verified successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
