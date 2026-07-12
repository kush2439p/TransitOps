package com.transitops.dto;

import com.transitops.entity.Role;
import com.transitops.entity.User;
import com.transitops.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String name;
    private String email;
    private Role role;
    private UserStatus status;
    private Instant createdAt;

    public static UserDto from(User u) {
        return UserDto.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .status(u.getStatus())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
