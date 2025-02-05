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
        Schema::table('tbl_bookings', function (Blueprint $table) {
            $table->decimal('provider_rate', 3, 2)->nullable()->after('price');  // Rating out of 5
            $table->text('provider_feedback')->nullable()->after('provider_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbl_bookings', function (Blueprint $table) {
            $table->dropColumn(['provider_rate', 'provider_feedback']);
        });
    }
};
