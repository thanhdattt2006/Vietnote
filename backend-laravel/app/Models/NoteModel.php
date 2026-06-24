<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoteModel extends Model
{
  use HasFactory;

  protected $table = 'Note';
  protected $primaryKey = 'id';
  public $timestamps = true;
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $fillable = [
    'title',
    'content',
    'isPinned',
    'isDeleted',
    'deletedAt',
    'ownerId',
  ];

  protected $casts = [
    'isPinned' => 'boolean',
    'isDeleted' => 'boolean',
    'createdAt' => 'datetime',
    'updatedAt' => 'datetime',
    'deletedAt' => 'datetime',
  ];

  public function account()
  {
    return $this->belongsTo(AccountModel::class, 'ownerId');
  }

  public function images()
  {
    return $this->hasMany(NoteImageModel::class, 'noteId');
  }
}
