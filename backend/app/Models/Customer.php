<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'tbl_customer_info';
    protected $primaryKey = 'customer_id';

    protected $fillable = [
        'user_id',          // ✅ Links to the User model
        'profile_photo',
        'customer_name',
        'contact_no',
        'house_add',
        'brgy',
        'city',
        'province',
    ];

    // ✅ Relationship to the User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ✅ Relationship to Bookings
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'user_id', 'user_id');
    }
}
