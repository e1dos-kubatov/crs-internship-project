package com.carrental.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class JwtResponse {
    String token;
}
