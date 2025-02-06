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
            'customer_name' => 'required|string',
            'contact_no' => 'required|string',
            'house_add' => 'required|string',
            'brgy' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'profile_photo' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        try {
            DB::beginTransaction();

            // ✅ Create User
            $userId = DB::table('users')->insertGetId([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'customer',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // ✅ Handle File Upload
            $profilePhotoPath = $request->hasFile('profile_photo')
                ? $request->file('profile_photo')->store('uploads/profile_photos', 'public')
                : null;

            // ✅ Insert Customer Info (No need for condition)
            DB::table('tbl_customer_info')->insert([
                'user_id' => $userId,
                'customer_name' => $request->customer_name,
                'contact_no' => $request->contact_no,
                'house_add' => $request->house_add,
                'brgy' => $request->brgy,
                'city' => $request->city,
                'province' => $request->province,
                'profile_photo' => $profilePhotoPath,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

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
            'brgy' => 'required',
            'city' => 'required',
            'province' => 'required', // ✅ Ensure this is validated
            'brn' => 'required',
            'contactPerson' => 'required',
            'serviceType' => 'required',
            'businessLogo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'personID' => 'nullable|image|mimes:jpg,png,jpeg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // ✅ Handle file uploads
        $businessLogoPath = $request->hasFile('businessLogo') ?
            $request->file('businessLogo')->store('uploads/logos', 'public') : null;

        $personIDPath = $request->hasFile('personID') ?
            $request->file('personID')->store('uploads/ids', 'public') : null;

        // ✅ Create User
        $userId = DB::table('users')->insertGetId([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'provider',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ✅ Insert Provider Info
        DB::table('tbl_provider_info')->insert([
            'user_id' => $userId,
            'profile_pic' => $businessLogoPath ? 'storage/' . $businessLogoPath : null,
            'provider_name' => $request->fullName, // ✅ Corrected typo
            'contact_no' => $request->contactNumber,
            'office_add' => $request->houseAdd,
            'brgy' => $request->brgy,
            'city' => $request->city,
            'province' => $request->province,
            'brn' => $request->brn,
            'contact_person' => $request->contactPerson,
            'attachment' => $personIDPath ? 'storage/' . $personIDPath : null,
            'service_type' => $request->serviceType,
            'account_status' => 'pending', // ✅ Default status
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Registration successful!', 'user_id' => $userId], 201);
    }

    public function login(Request $request)
    {
        // ✅ Validate input
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // ✅ Attempt to authenticate the user
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // ✅ Retrieve the authenticated user
        $user = Auth::user();
        $providerId = null; // Default value for non-provider users

        // ✅ Check if the user is a service provider
        if ($user->role === 'provider') {
            $provider = \App\Models\Provider::where('user_id', $user->id)->first();

            // ❌ Block login if the provider is not approved
            if (!$provider || $provider->account_status !== 'approved') {
                Auth::logout(); // Logout the user immediately
                return response()->json([
                    'error' => 'Your account is not yet approved. Please wait for admin verification.'
                ], 403);
            }

            $providerId = $provider->provider_id; // ✅ Get provider_id if approved
        }

        // ✅ Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ Return response with token, user info, and provider_id (if applicable)
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'provider_id' => $providerId // ✅ Include provider_id if the user is a provider
        ]);
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

    public function getUserProfile(Request $request)
    {
        $user = Auth::user();

        $customer = DB::table('tbl_customer_info')
            ->where('user_id', $user->id)
            ->first();

        return response()->json([
            'user_id' => $user->id,
            'email' => $user->email,
            'customer_name' => $customer->customer_name,
            'contact_no' => $customer->contact_no,
            'house_add' => $customer->house_add,
            'brgy' => $customer->brgy,
            'city' => $customer->city,
            'province' => $customer->province,
            'profile_photo' => $customer->profile_photo ? asset('storage/' . $customer->profile_photo) : null,
        ]);
    }

    public function updateUserProfile(Request $request)
    {    
        $user = Auth::user();
        $customer = DB::table('tbl_customer_info')->where('user_id', $user->id)->first();
    
        $changesDetected = false;
        $updateData = [];
    
        // ✅ Update Email if Changed
        if ($request->has('email') && $request->email !== $user->email) {
            $user->email = $request->email;
            $user->save();
            $changesDetected = true;
        }
    
        // ✅ Update Password if Provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
            $user->save();
            $changesDetected = true;
        }
    
        // ✅ Update Profile Photo if Uploaded
        if ($request->hasFile('profile_photo')) {
            $profilePhotoPath = $request->file('profile_photo')->store('uploads/profile_photos', 'public');
    
            if ($profilePhotoPath !== $customer->profile_photo) {
                $updateData['profile_photo'] = $profilePhotoPath;
                $changesDetected = true;
            }
        }
    
        // ✅ Update Other Fields (Name, Contact, Address, etc.)
        $fields = [
            'customer_name' => 'customer_name',
            'contact_no' => 'contact_no',
            'house_add' => 'house_add',
            'brgy' => 'brgy',
            'city' => 'city',
            'province' => 'province',
        ];
    
        foreach ($fields as $dbField => $requestField) {
            $newValue = $request->input($requestField);
            $oldValue = $customer->$dbField;
    
            \Log::info("Comparing '{$dbField}': OLD='{$oldValue}' | NEW='{$newValue}'");
    
            if ($newValue !== null && trim(strtolower($newValue)) !== trim(strtolower($oldValue))) {
                $updateData[$dbField] = $newValue;
                $changesDetected = true;
            }
        }
    
        // ✅ Apply Changes if Detected
        if ($changesDetected && !empty($updateData)) {
            DB::table('tbl_customer_info')
                ->where('user_id', $user->id)
                ->update($updateData);
    
            return response()->json(['message' => 'Profile updated successfully!']);
        } elseif (!$changesDetected) {
            return response()->json(['message' => 'No changes detected.']);
        }
    }

    public function getProfile($userId)
{
    $customer = Customer::where('user_id', $userId)->first(); // Get the customer info

    if (!$customer) {
        return response()->json(['message' => 'Customer not found'], 404);
    }

    return response()->json([
        'customer_name' => $customer->customer_name ?? 'User', // Return customer name
    ], 200);
}

    
}
