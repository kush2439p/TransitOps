package com.transitops.controller;

import com.transitops.dto.AuthResponse;
import com.transitops.dto.LoginRequest;
import com.transitops.dto.SignupRequest;
import com.transitops.dto.UserDto;
import com.transitops.entity.User;
import com.transitops.exception.NotFoundException;
import com.transitops.repository.UserRepository;
import com.transitops.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody SignupRequest req) {
        UserDto created = authService.signup(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Account created successfully",
                "user", created
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal User principal) {
        if (principal == null) {
            throw new NotFoundException("No authenticated user");
        }
        // re-fetch to get freshest state
        User u = userRepository.findById(principal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        return ResponseEntity.ok(UserDto.from(u));
    }
}
