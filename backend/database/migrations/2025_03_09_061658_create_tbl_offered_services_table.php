<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_offered_services', function (Blueprint $table) {
            $table->id('offered_service_id'); // Primary key
            $table->unsignedBigInteger('category_id'); // Foreign key
            $table->string('service_name');
            $table->text('service_description');
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('category_id')->references('category_id')->on('tbl_categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_offered_services');
    }
};