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
        Schema::create('tbl_reports', function (Blueprint $table) {
            $table->id('report_id'); // Primary key
            $table->unsignedBigInteger('provider_id');
            $table->unsignedBigInteger('user_id');
            $table->string('report_title');
            $table->text('report_description');
            $table->string('report_proof')->nullable();
            $table->timestamps();
    
            // Foreign keys (optional)
            $table->foreign('provider_id')->references('provider_id')->on('tbl_provider_info');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_reports');
    }
};
