<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Provider extends Model
{
    use HasFactory, SoftDeletes;

    // Specify the table name
    protected $table = 'tbl_provider_info';

    // Specify the primary key
    protected $primaryKey = 'provider_id';
    protected $dates = ['deleted_at'];

    // Allow mass assignment for these fields
    protected $fillable = [
        'user_id',
        'profile_pic',
        'provider_name',
        'contact_no',
        'office_add',
        'street',
        'brgy',
        'city',
        'province',
        'brn',
        'contact_person',
        'attachment',
        'service_type',
        'account_status',
        'email_verified'
    ];

    // Relationship: A provider belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function serviceCategory()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_type', 'category_id');
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'provider_id', 'provider_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'provider_id');
    }
    
    // ✅ Get the average rating
    public function getAverageRatingAttribute()
    {
        return $this->bookings()->avg('provider_rate') ?? 0;  // Return 0 if no ratings yet
    }
    
    
}
