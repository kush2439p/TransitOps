package com.transitops.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {
    private int status;
    private String error;
    private String message;
    private List<String> details;
    private String path;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
