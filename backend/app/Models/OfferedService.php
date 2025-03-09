<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfferedService extends Model
{
    use HasFactory;

    protected $table = 'tbl_offered_services'; // Specify table name

    protected $primaryKey = 'offered_service_id'; // Primary key

    protected $fillable = [
        'category_id',
        'service_name',
        'service_description',
    ];

    // Relationship with Category Model
    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id', 'category_id');
    }
}