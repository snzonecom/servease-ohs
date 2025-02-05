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
        Schema::create('tbl_services', function (Blueprint $table) {
            $table->id('service_id'); // Primary key        
            $table->unsignedBigInteger('provider_id'); // Foreign key
            $table->string('service_name');
            $table->string('service_description');
            $table->decimal('price_start', 8, 2);
            $table->timestamps();
    
            // Foreign key constraint
            $table->foreign('provider_id')->references('provider_id')->on('tbl_provider_info');

        });

        // Set AUTO_INCREMENT start value
        DB::statement('ALTER TABLE tbl_services AUTO_INCREMENT = 105010;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_services');
    }
};
