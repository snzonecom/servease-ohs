<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Provider;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class DeletedProviderController extends Controller
{
    /**
     * ✅ Get Soft-Deleted Providers
     */
    public function index()
    {
        $deletedProviders = Provider::onlyTrashed()->with(['user', 'serviceCategory'])->get(); // ✅ Ensure 'serviceCategory' relationship is loaded

        // 🔍 Debugging Log
        Log::info('Fetching Soft Deleted Providers', ['count' => $deletedProviders->count()]);

        if ($deletedProviders->isEmpty()) {
            return response()->json([], 200); // ✅ Return an empty array instead of 404
        }

        // 🔹 Append Full URL to `profile_pic` and `attachment`, and include user & service category details
        $deletedProviders->transform(function ($provider) {
            if ($provider->profile_pic) {
                $provider->profile_pic = asset($provider->profile_pic); // Convert to full URL
            }
            if ($provider->attachment) {
                $provider->attachment = asset($provider->attachment); // Convert to full URL
            }

            // ✅ Ensure user relationship is properly loaded
            $user = $provider->user()->withTrashed()->first(); // Fetch even soft-deleted users

            return [
                'provider_id' => $provider->provider_id,
                'user_id' => $provider->user_id,
                'provider_name' => $provider->provider_name,
                'profile_pic' => $provider->profile_pic,
                'contact_no' => $provider->contact_no,
                'office_add' => $provider->office_add,
                'brgy' => $provider->brgy,
                'city' => $provider->city,
                'province' => $provider->province,
                'brn' => $provider->brn,
                'contact_person' => $provider->contact_person,
                'attachment' => $provider->attachment,
                'service_type' => $provider->service_type,
                'account_status' => $provider->account_status,
                'created_at' => $provider->created_at,
                'updated_at' => $provider->updated_at,
                'deleted_at' => $provider->deleted_at,

                // 🔹 Include user data (ensure it's not null)
                'user' => $user ? [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role,
                ] : null,

                // ✅ Include service category name
                'service_category' => $provider->serviceCategory ? [
                    'category_id' => $provider->serviceCategory->category_id,
                    'category_name' => $provider->serviceCategory->category_name, // ✅ Fetch actual category name
                ] : null,
            ];
        });

        return response()->json($deletedProviders);
    }






    /**
     * ✅ Restore a Soft-Deleted Provider
     */
    public function restore($id)
    {
        $provider = Provider::onlyTrashed()->find($id);
        if (!$provider) {
            return response()->json(['message' => 'Provider not found or not deleted'], 404);
        }

        // ✅ Restore Provider
        $provider->restore();

        // ✅ Restore Associated User
        $user = User::onlyTrashed()->find($provider->user_id);
        if ($user) {
            $user->restore();
        }

        return response()->json(['message' => 'Provider and account restored successfully']);
    }

    /**
     * ✅ Permanently Delete a Provider (Force Delete)
     */
    public function forceDelete($id)
    {
        $provider = Provider::onlyTrashed()->find($id);
        if (!$provider) {
            return response()->json(['message' => 'Provider not found or not deleted'], 404);
        }

        // ✅ Permanently Delete Associated User
        $user = User::onlyTrashed()->find($provider->user_id);
        if ($user) {
            $user->forceDelete();
        }

        // ✅ Permanently Delete Provider
        $provider->forceDelete();

        return response()->json(['message' => 'Provider and account permanently deleted']);
    }
}
