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
        Schema::create('NoteImage', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('noteId'); // CamelCase
            $table->string('imageUrl');

            // Khớp với $fillable['uploadedAt']
            $table->timestamp('uploadedAt')->useCurrent();

            $table->foreign('noteId')->references('id')->on('Note')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('NoteImage');
    }
};
