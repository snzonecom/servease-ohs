<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    public static function getAllProviders()
    {
        try {
            return DB::table('tbl_provider_info')->get();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Database query failed', 'message' => $e->getMessage()], 500);
        }
    }
}
