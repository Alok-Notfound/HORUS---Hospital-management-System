package com.hospital.management.controller;

import com.hospital.management.dto.AuthRequest;
import com.hospital.management.dto.AuthResponse;
import com.hospital.management.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}