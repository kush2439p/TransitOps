package com.transitops.service;

import com.transitops.dto.AuthResponse;
import com.transitops.dto.LoginRequest;
import com.transitops.dto.SignupRequest;
import com.transitops.dto.UserDto;
import com.transitops.entity.User;
import com.transitops.entity.UserStatus;
import com.transitops.exception.BadRequestException;
import com.transitops.repository.UserRepository;
import com.transitops.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public UserDto signup(SignupRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .name(req.getName().trim())
                .email(req.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(user);
        return UserDto.from(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmailIgnoreCase(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new BadCredentialsException("Account is inactive");
        }

        String token = jwtUtil.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getExpirationMs())
                .user(UserDto.from(user))
                .build();
    }
}
