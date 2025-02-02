<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@mail.com'],  // Prevent duplicate seeding
            [
                'email' => 'admin@mail.com',
                'password' => Hash::make('admin'),  // ✅ Make sure to hash the password
                'role' => 'admin',  // ✅ Ensure your `users` table has a `role` column
            ]
        );
    }
}