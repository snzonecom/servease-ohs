<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;

class ServiceCategory extends Model
{
    public static function getAllServiceCategory()
    {
        return DB::table('tbl_categories')->get();
    }
}
