<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model cho bảng Response
 * Quản lý các response từ người dùng
 */
class ResponseModel extends Model
{
  use HasFactory;

  // Tên bảng trong database
  protected $table = 'Response';

  // Primary key của bảng
  protected $primaryKey = 'id';

  // Tắt timestamps mặc định của Laravel vì dùng sentAt
  public $timestamps = false;

  // Các cột có thể fill mass assignment
  protected $fillable = [
    'name',      // Tên người gửi
    'gmail',     // Email Gmail
    'subject', // Lý do response
    'content',   // Nội dung response
    'sentAt'     // Thời gian gửi
  ];

  // Cast kiểu dữ liệu cho các cột
  protected $casts = [
    'sentAt' => 'datetime', // Cast sentAt thành datetime object
  ];

  // Các cột ẩn khi convert sang JSON (nếu cần)
  protected $hidden = [];

  /**
   * Scope query: Lọc theo email
   * Sử dụng: ResponseModel::byGmail('test@gmail.com')->get()
   */
  public function scopeByGmail($query, $gmail)
  {
    return $query->where('gmail', $gmail);
  }

  /**
   * Scope query: Lọc theo khoảng thời gian
   * Sử dụng: ResponseModel::betweenDates($start, $end)->get()
   */
  public function scopeBetweenDates($query, $startDate, $endDate)
  {
    return $query->whereBetween('sentAt', [$startDate, $endDate]);
  }

  /**
   * Scope query: Lấy response mới nhất
   * Sử dụng: ResponseModel::latest()->get()
   */
  public function scopeLatest($query)
  {
    return $query->orderBy('sentAt', 'desc');
  }

  /**
   * Accessor: Format thời gian sentAt sang định dạng đẹp
   * Sử dụng: $response->formatted_sent_at
   */
  public function getFormattedSentAtAttribute()
  {
    return $this->sentAt ? $this->sentAt->format('d/m/Y H:i:s') : null;
  }

  /**
   * Accessor: Kiểm tra xem response có được gửi trong hôm nay không
   * Sử dụng: $response->is_today
   */
  public function getIsTodayAttribute()
  {
    return $this->sentAt ? $this->sentAt->isToday() : false;
  }

  /**
   * Mutator: Tự động trim và lowercase gmail trước khi lưu
   */
  public function setGmailAttribute($value)
  {
    $this->attributes['gmail'] = strtolower(trim($value));
  }

  /**
   * Mutator: Tự động trim name trước khi lưu
   */
  public function setNameAttribute($value)
  {
    $this->attributes['name'] = trim($value);
  }
}
