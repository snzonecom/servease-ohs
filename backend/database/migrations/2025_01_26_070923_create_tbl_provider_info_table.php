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
        Schema::create('tbl_provider_info', function (Blueprint $table) {
            $table->id('provider_id'); // Primary key
            $table->string('profile_pic')->nullable();
            $table->string('provider_name');
            $table->string('contact_no');
            $table->string('office_add')->nullable();
            $table->string('street')->nullable();
            $table->string('brgy')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('brn')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('attachment')->nullable();
            $table->string('service_type')->nullable();
            $table->string('account_status')->nullable();
            $table->boolean('email_verified')->default(false);
            $table->timestamps();
        });

        // Set AUTO_INCREMENT start value
        DB::statement('ALTER TABLE tbl_provider_info AUTO_INCREMENT = 672493;');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_provider_info');
    }
};
