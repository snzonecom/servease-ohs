<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use DB;

class ServiceCategory extends Model
{
    use SoftDeletes;

    protected $table = 'tbl_categories';
    protected $primaryKey = 'category_id';
    protected $fillable = ['category_name', 'category_description'];
    protected $dates = ['deleted_at'];

    public static function getAllServiceCategory()
    {
        return DB::table('tbl_categories')->get();
    }
}
