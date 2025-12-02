<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('Account', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('name')->nullable();
            $table->integer('age')->nullable();
            $table->string('gender')->nullable(); // male, female, other

            // --- CỘT MỚI ÔNG CẦN ---
            $table->string('role')->default('user');

            // --- GIỮ NGUYÊN CẤU TRÚC CŨ CỦA ÔNG ---
            $table->timestamp('createdAt')->useCurrent(); // Khớp với $fillable['createdAt']
        });
    }

    public function down()
    {
        Schema::dropIfExists('Account');
    }
};
