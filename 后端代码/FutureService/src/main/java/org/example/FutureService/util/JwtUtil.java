package org.example.FutureService.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret:your-256-bit-secret-key-must-be-at-least-32-characters}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username, Map<String, Object> claims) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(username)
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new org.example.FutureService.exception.BusinessException(401, "Token已过期");
        } catch (UnsupportedJwtException e) {
            throw new org.example.FutureService.exception.BusinessException(401, "不支持的Token格式");
        } catch (MalformedJwtException e) {
            throw new org.example.FutureService.exception.BusinessException(401, "Token格式错误");
        } catch (SignatureException e) {
            throw new org.example.FutureService.exception.BusinessException(401, "Token签名无效");
        } catch (IllegalArgumentException e) {
            throw new org.example.FutureService.exception.BusinessException(401, "Token为空");
        }
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
