<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SystemInfo extends Model
{
    use HasFactory;

    protected $table = 'tbl_system_info'; // Ensure it matches the table name in your migration

    protected $fillable = [
        'logo',
        'about_text',
        'faqs',
        'contacts'
    ];

    protected $casts = [
        'faqs' => 'array',     // Automatically cast JSON data to an array
        'contacts' => 'array'  // Automatically cast JSON data to an array
    ];
}
