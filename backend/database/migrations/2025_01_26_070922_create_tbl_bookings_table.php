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
        Schema::create('tbl_bookings', function (Blueprint $table) {
            $table->id('booking_id'); // Primary key
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('provider_id'); // Foreign key
            $table->json('services');
            $table->date('book_date');
            $table->string('book_time');
            $table->string('book_status');
            $table->decimal('provider_rate', 8, 2)->nullable();
            $table->text('provider_feedback')->nullable();
            $table->timestamps();
        
            // // Foreign key constraints
            // $table->foreign('provider_id')->references('provider_id')->on('tbl_provider_info')->onDelete('cascade');
            // $table->foreign('service_id')->references('service_id')->on('tbl_services')->onDelete('cascade');
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_bookings');
    }
};
