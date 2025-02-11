<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SystemInfo;
use Illuminate\Support\Facades\Storage;

class SystemInfoController extends Controller
{
    /**
     * Retrieve system information.
     */
    public function index()
    {
        $systemInfo = SystemInfo::first();

        if (!$systemInfo) {
            $systemInfo = SystemInfo::create([
                'logo' => null,
                'about_text' => null,
                'faqs' => [],
                'contacts' => [] // Ensure it's stored as a JSON array
            ]);
        }

        return response()->json([
            'logo' => $systemInfo->logo ? url($systemInfo->logo) : null,
            'about_text' => $systemInfo->about_text ?? '',
            'faqs' => $systemInfo->faqs ?? [],
            'contacts' => $systemInfo->contacts ?? [],
        ]);
    }



    /**
     * Update system information.
     */
    public function update(Request $request)
    {
        $systemInfo = SystemInfo::first();

        if (!$systemInfo) {
            return response()->json(['message' => 'System information not found'], 404);
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if it exists
            if ($systemInfo->logo && file_exists(public_path($systemInfo->logo))) {
                unlink(public_path($systemInfo->logo));
            }

            // Store the new logo in `public/system-logo/`
            $file = $request->file('logo');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('system-logo'), $fileName);

            // Save the new logo path (relative to `public/`)
            $systemInfo->logo = 'system-logo/' . $fileName;
        }

        // Update other fields
        $systemInfo->about_text = $request->input('about_text', $systemInfo->about_text);
        $systemInfo->faqs = $request->input('faqs', $systemInfo->faqs);
        $systemInfo->contacts = $request->input('contacts', $systemInfo->contacts);

        // Save changes
        $systemInfo->save();

        return response()->json([
            'message' => 'System information updated successfully',
            'systemInfo' => $systemInfo
        ]);
    }


}
