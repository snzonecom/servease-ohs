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
        Schema::table('tbl_provider_info', function (Blueprint $table) {
            $table->text('description')->after('provider_name'); // ✅ Add description after provider_name
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbl_provider_info', function (Blueprint $table) {
            $table->dropColumn('description'); // ✅ Rollback changes if needed
        });
    }
};
