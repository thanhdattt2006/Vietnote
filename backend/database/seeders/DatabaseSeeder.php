<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Gọi file Seeder ông vừa viết
        $this->call([
            AdminSeeder::class,
        ]);
    }
}
