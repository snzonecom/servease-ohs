<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'phservease@gmail.com'],  // Prevent duplicate seeding
            [
                'email' => 'phservease@gmail.com',
                'password' => Hash::make('LETServe!402'),  // ✅ Make sure to hash the password
                'role' => 'admin',  // ✅ Ensure your `users` table has a `role` column
            ]
        );

        $categories = [
            ['category_name' => 'Cleaning', 'category_description' => 'Professional cleaning services for homes and offices.', 'created_at' => now(), 'updated_at' => now()],
            ['category_name' => 'Electrical Repair', 'category_description' => 'Expert electrical repair services for residential and commercial needs.', 'created_at' => now(), 'updated_at' => now()],
            ['category_name' => 'Appliance Repair', 'category_description' => 'Reliable appliance repair services for all major brands.', 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($categories as $category) {
            DB::table('tbl_categories')->updateOrInsert(
                ['category_name' => $category['category_name']],  // Avoid duplicates
                $category
            );
        }
    }
}