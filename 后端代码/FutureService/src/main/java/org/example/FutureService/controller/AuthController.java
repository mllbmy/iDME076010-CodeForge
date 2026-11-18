package org.example.FutureService.controller;

import org.example.FutureService.common.Result;
import org.example.FutureService.util.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Result<Map<String, String>> login(@RequestBody LoginRequest request) {
        if ("admin".equals(request.getUsername()) && "123456".equals(request.getPassword())) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "admin");

            String token = jwtUtil.generateToken(request.getUsername(), claims);

            Map<String, String> result = new HashMap<>();
            result.put("token", token);
            result.put("tokenType", "Bearer");
            result.put("expiresIn", "86400");

            return Result.ok(result);
        }

        return Result.fail(401, "用户名或密码错误");
    }
}
