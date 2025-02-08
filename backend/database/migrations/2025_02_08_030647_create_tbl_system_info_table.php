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
        Schema::create('tbl_system_info', function (Blueprint $table) {
            $table->id();
            $table->string('logo')->nullable();
            $table->text('about_text')->nullable();
            $table->json('faqs')->nullable();
            $table->json('contacts')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_system_info');
    }
};
