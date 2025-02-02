<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'tbl_services';
    protected $primaryKey = 'service_id';

    protected $fillable = [
        'provider_id',
        'service_name',
        'service_description',
        'price_start'
    ];
}
