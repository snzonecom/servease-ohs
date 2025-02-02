<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Provider;
use App\Models\User;

class ProviderController extends Controller
{
    // ✅ List all providers
    public function index()
    {
        $providers = Provider::with('user')->get();
        return response()->json($providers);
    }

    // ✅ Show provider by ID
    public function show($id)
    {
        $provider = Provider::with('user')->findOrFail($id);
        return response()->json($provider);
    }

    // ✅ Update provider details
    public function update(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);

        $request->validate([
            'provider_name' => 'sometimes|required|string|max:255',
            'contact_no' => 'sometimes|required|string|max:20',
            'profile_pic' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'attachment' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle file updates
        if ($request->hasFile('profile_pic')) {
            $provider->profile_pic = $request->file('profile_pic')->store('public/profile_pics');
        }

        if ($request->hasFile('attachment')) {
            $provider->attachment = $request->file('attachment')->store('public/attachments');
        }

        $provider->fill($request->except(['profile_pic', 'attachment']));
        $provider->save();

        return response()->json([
            'message' => 'Provider updated successfully!',
            'provider' => $provider,
        ]);
    }

    // ✅ Delete a provider
    public function destroy($id)
    {
        $provider = Provider::findOrFail($id);
        $provider->delete();

        return response()->json(['message' => 'Provider deleted successfully.']);
    }

    // ✅ Approve provider application
    public function approve($id)
    {
        $provider = Provider::findOrFail($id);
        $provider->account_status = 'approved';
        $provider->save();

        return response()->json(['message' => 'Provider application approved.']);
    }

    // ✅ Reject provider application
    public function reject($id)
    {
        $provider = Provider::findOrFail($id);
        $provider->account_status = 'rejected';
        $provider->save();

        return response()->json(['message' => 'Provider application rejected.']);
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
                $provider->profile_pic = $provider->profile_pic ? asset( $provider->profile_pic) : null;
                $provider->attachment = $provider->attachment ? asset( $provider->attachment) : null;
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
                $provider->profile_pic = $provider->profile_pic ? asset( $provider->profile_pic) : null;
                $provider->attachment = $provider->attachment ? asset( $provider->attachment) : null;
                $provider->service_type_name = $provider->serviceCategory ? $provider->serviceCategory->category_name : 'Unknown';
                $provider->email = $provider->user ? $provider->user->email : 'N/A';
                return $provider;
            });
    
        return response()->json($approvedProviders);
    }
    
    
}
