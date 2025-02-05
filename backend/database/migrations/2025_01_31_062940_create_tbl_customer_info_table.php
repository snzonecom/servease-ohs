<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_customer_info', function (Blueprint $table) {
            $table->id('customer_id'); // Auto-incrementing primary key
            $table->string('profile_photo');
            $table->string('customer_name');
            $table->string('contact_no');
            $table->string('house_add');
            $table->string('brgy');
            $table->string('city');
            $table->string('province');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_customer_info');
    }
};
