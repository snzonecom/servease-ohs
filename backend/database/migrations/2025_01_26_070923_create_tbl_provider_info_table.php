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
        Schema::create('tbl_provider_info', function (Blueprint $table) {
            $table->id('provider_id'); // Primary key
            $table->string('profile_pic');
            $table->string('provider_name');
            $table->string('contact_no');
            $table->string('office_add');
            $table->string('brgy');
            $table->string('city');
            $table->string('province');
            $table->string('brn');
            $table->string('contact_person');
            $table->string('attachment');
            $table->string('service_type');
            $table->string('account_status');
            $table->string('account_status');
            $table->string('reject_type');
            $table->string('reject_description');
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
