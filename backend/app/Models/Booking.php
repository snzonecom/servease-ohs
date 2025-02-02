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
    ];

    protected $casts = [
        'services' => 'array',  // ✅ Automatically casts JSON to array
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }
}
