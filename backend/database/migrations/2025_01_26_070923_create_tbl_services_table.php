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
            $table->decimal('price_start', 8, 2);
            $table->string('role')->nullable();
            $table->timestamps();
    
            // Foreign key constraint
            $table->foreign('provider_id')->references('provider_id')->on('tbl_provider_info');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_services');
    }
};
