<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoteImageModel extends Model
{
  use HasFactory;

  protected $table = 'NoteImage';
  protected $primaryKey = 'id';
  public $timestamps = false;

  protected $fillable = [
    'noteId',
    'imageUrl',
    'uploadedAt',
  ];

  protected $casts = [
    'uploadedAt' => 'datetime',
  ];

  public function note()
  {
    return $this->belongsTo(NoteModel::class, 'noteId');
  }
}
