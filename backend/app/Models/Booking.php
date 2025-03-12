<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = 'tbl_bookings';
    protected $primaryKey = 'booking_id';

    protected $fillable = [
        'user_id',
        'provider_id',
        'services',          // ✅ Added this
        'book_date',
        'book_time',
        'book_status',
        'provider_rate',
        'provider_feedback',
        'proof',
        'isRated',
        'comment',
        'booking_address'
    ];

    protected $casts = [
        'services' => 'array',  // ✅ Automatically casts JSON to array
    ];

    public function getServiceDetailsAttribute()
    {
        $services = is_array($this->services) ? $this->services : json_decode($this->services, true);

        if (is_array($services)) {
            return Service::whereIn('service_id', $services)->get();
        }

        return collect();  // Return an empty collection if decoding fails
    }



    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }

    public function customer()
    {
        return $this->hasOne(Customer::class, 'user_id', 'user_id');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'tbl_services', 'service_id');
    }


}
