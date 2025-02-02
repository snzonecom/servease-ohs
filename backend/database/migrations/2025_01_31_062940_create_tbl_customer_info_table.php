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
            $table->string('profile_photo')->nullable();
            $table->string('customer_name');
            $table->string('contact_no');
            $table->string('house_add')->nullable();
            $table->string('street')->nullable();
            $table->string('brgy')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
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
