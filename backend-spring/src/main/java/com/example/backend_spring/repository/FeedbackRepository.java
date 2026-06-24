package com.example.backend_spring.repository;

import com.example.backend_spring.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository cho entity Feedback (bảng Response).
 * Tương đương: ResponseModel:: trong Laravel AdminController.
 */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    /**
     * Lấy feedbacks sắp xếp theo thời gian gửi mới nhất.
     * Tương đương: ResponseModel::orderBy('sentAt', 'desc')->paginate(10)
     */
    Page<Feedback> findAllByOrderBySentAtDesc(Pageable pageable);
}
