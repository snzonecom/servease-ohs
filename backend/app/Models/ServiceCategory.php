<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;

class ServiceCategory extends Model
{
    protected $table = 'tbl_categories';
    protected $primaryKey = 'category_id';
    protected $fillable = ['category_name', 'category_description'];
    
    public static function getAllServiceCategory()
    {
        return DB::table('tbl_categories')->get();
    }
}
