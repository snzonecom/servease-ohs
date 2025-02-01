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
            $table->string('customer_name');
            $table->string('contact_no')->unique();
            $table->string('house_add');
            $table->string('street')->nullable();
            $table->string('brgy')->nullable();
            $table->string('city');
            $table->timestamps(); // Adds created_at and updated_at columns
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
