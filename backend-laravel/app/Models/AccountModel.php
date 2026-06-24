<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // ← Đổi từ Model
use Laravel\Sanctum\HasApiTokens; // ← Thêm trait

class AccountModel extends Authenticatable // ← Đổi extends
{
  use HasFactory, HasApiTokens; // ← Thêm HasApiTokens

  protected $table = 'Account';
  protected $primaryKey = 'id';
  public $timestamps = false;

  protected $fillable = [
    'username',
    'password',
    'name',
    'age',
    'gender',
    'role',
    'createdAt',
  ];

  protected $hidden = [
    'password',
  ];

  public function notes()
  {
    return $this->hasMany(NoteModel::class, 'ownerId');
  }
}
