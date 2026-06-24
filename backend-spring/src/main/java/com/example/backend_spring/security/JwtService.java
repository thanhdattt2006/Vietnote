package com.example.backend_spring.security;

import com.example.backend_spring.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JwtService — Xử lý toàn bộ vòng đời JWT Token.
 *
 * Thay thế Laravel Sanctum token:
 * - $user->createToken('auth_token')->plainTextToken  →  generateToken(user)
 * - auth()->user()                                    →  extractUsername(token) → load from DB
 * - $request->user()->currentAccessToken()->delete()  →  JWT stateless, không cần revoke
 *
 * Thuật toán: HMAC-SHA256 (HS256)
 * Claim payload: sub (username/email), role, userId, iat, exp
 */
@Service
public class JwtService {

    @Value("${application.jwt.secret}")
    private String jwtSecret;

    @Value("${application.jwt.expiration-ms}")
    private long jwtExpirationMs;

    // ===== PUBLIC API =====

    /**
     * Sinh JWT token cho user sau khi login/register/OAuth2 thành công.
     * Tương đương: $user->createToken('auth_token')->plainTextToken
     */
    public String generateToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId());
        extraClaims.put("role", user.getRole());
        extraClaims.put("name", user.getName());
        return buildToken(extraClaims, user.getUsername());
    }

    /**
     * Trích xuất username (email) từ JWT — dùng trong JwtAuthenticationFilter.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Kiểm tra token có hợp lệ không (chữ ký đúng + chưa hết hạn).
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // ===== PRIVATE HELPERS =====

    private String buildToken(Map<String, Object> extraClaims, String subject) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
