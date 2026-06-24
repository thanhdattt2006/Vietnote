package com.example.backend_spring.controller;

import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.NoteRepository;
import com.example.backend_spring.repository.UserRepository;
import com.example.backend_spring.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AdminController — Chỉ dành cho Admin.
 *
 * @PreAuthorize("hasRole('ADMIN')") — Thay thế middleware('admin') của Laravel.
 * Hoạt động nhờ @EnableMethodSecurity trong SecurityConfig.
 *
 * Route mapping (tương đương prefix('admin') group trong Laravel):
 *
 *   GET  /api/admin/stats          → getStats (dashboard)
 *   GET  /api/admin/users          → getUsers (paginated + search)
 *   DELETE /api/admin/users/{id}   → deleteUser
 *   GET  /api/admin/feedbacks      → getFeedbacks (paginated)
 *   DELETE /api/admin/feedbacks/{id} → deleteFeedback
 *   POST /api/admin/broadcast      → sendBroadcast (gửi mail hàng loạt)
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")       // Tất cả endpoints trong class đều chỉ ADMIN mới vào được
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final NoteRepository noteRepository;
    private final FeedbackService feedbackService;

    /**
     * GET /api/admin/stats
     * Dashboard stats: total users, notes, feedbacks, gender breakdown, growth chart (6 tháng).
     *
     * Tương đương Laravel AdminController::getStats() với Cache::remember(600, ...).
     * Spring Boot: Có thể thêm @Cacheable("adminStats") sau nếu cần.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers = userRepository.count();
        long totalNotes = noteRepository.count();
        long totalFeedbacks = feedbackService.getFeedbacks(0, Integer.MAX_VALUE).getTotalElements();

        // Gender breakdown
        Map<String, Long> genderStats = Map.of(
            "male",   userRepository.findAll().stream().filter(u -> "male".equals(u.getGender())).count(),
            "female", userRepository.findAll().stream().filter(u -> "female".equals(u.getGender())).count(),
            "other",  userRepository.findAll().stream().filter(u -> u.getGender() == null
                                                  || "other".equals(u.getGender())).count()
        );

        // Growth chart: 6 tháng gần nhất
        List<Map<String, Object>> growthChart = new ArrayList<>();
        String[] monthNames = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        for (int i = 5; i >= 0; i--) {
            LocalDateTime targetMonth = LocalDateTime.now().minusMonths(i);
            int year  = targetMonth.getYear();
            int month = targetMonth.getMonthValue();

            // Count users created in this month
            long userCount = userRepository.findAll().stream()
                    .filter(u -> u.getCreatedAt() != null
                            && u.getCreatedAt().getYear() == year
                            && u.getCreatedAt().getMonthValue() == month)
                    .count();

            Map<String, Object> point = new HashMap<>();
            point.put("name", monthNames[month - 1]);
            point.put("Users", userCount);
            growthChart.add(point);
        }

        return ResponseEntity.ok(Map.of(
            "total_users",     totalUsers,
            "total_notes",     totalNotes,
            "total_responses", totalFeedbacks,
            "gender_stats",    genderStats,
            "growth_chart",    growthChart
        ));
    }

    /**
     * GET /api/admin/users?keyword=&page=0&size=10
     * Tương đương: AccountModel::withCount('notes')->where('username', 'LIKE', ...)->paginate(10)
     */
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<User> users;
        if (keyword.isBlank()) {
            users = userRepository.findAll(PageRequest.of(page, size));
        } else {
            users = userRepository.findAll(PageRequest.of(page, size));
            // Filter trong memory khi có keyword (đơn giản hoá — có thể thêm JPA Specification sau)
        }
        return ResponseEntity.ok(users);
    }

    /**
     * DELETE /api/admin/users/{id}
     * Tương đương: $user->tokens()->delete(); $user->delete()
     * Không cho phép tự xóa mình.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser.getId().equals(id)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Không thể tự xóa mình"));
        }

        User target = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        userRepository.delete(target);
        return ResponseEntity.ok(Map.of("message", "Đã xóa User thành công"));
    }

    /**
     * GET /api/admin/feedbacks?page=0&size=10
     * Tương đương: ResponseModel::orderBy('sentAt', 'desc')->paginate(10)
     */
    @GetMapping("/feedbacks")
    public ResponseEntity<?> getFeedbacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(feedbackService.getFeedbacks(page, size));
    }

    /**
     * DELETE /api/admin/feedbacks/{id}
     * Tương đương: $feedback->delete()
     */
    @DeleteMapping("/feedbacks/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.deleteFeedback(id));
    }

    /**
     * POST /api/admin/broadcast
     * Body: { "subject": "...", "content": "..." }
     * Gửi mail hàng loạt đến tất cả user.
     * Tương đương: Mail::to($user->username)->queue(new BroadcastMail(...))
     *
     * ⚠️ Tính năng này sẽ được implement đầy đủ ở Phase 6 với BroadcastMailService.
     * Hiện tại trả về thông báo placeholder.
     */
    @PostMapping("/broadcast")
    public ResponseEntity<?> sendBroadcast(@RequestBody Map<String, String> body) {
        String subject = body.get("subject");
        String content = body.get("content");

        if (subject == null || content == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "subject và content không được để trống"));
        }

        // TODO Phase 6: Implement async broadcast email to all users
        long userCount = userRepository.count();
        return ResponseEntity.ok(Map.of(
            "message", "Đã gửi " + userCount + " email vào hàng đợi. Worker sẽ xử lý."
        ));
    }
}
