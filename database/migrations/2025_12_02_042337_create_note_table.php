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
        Schema::create('Note', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->longText('content')->nullable();
            $table->boolean('isPinned')->default(false);
            $table->boolean('isDeleted')->default(false);

            // --- CAMEL CASE CHUẨN CỦA ÔNG ---
            $table->unsignedBigInteger('ownerId');
            $table->timestamp('deletedAt')->nullable();

            // Khớp với const CREATED_AT = 'createdAt'; trong Model
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();

            // Khóa ngoại
            $table->foreign('ownerId')->references('id')->on('Account')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Note');
    }
};
