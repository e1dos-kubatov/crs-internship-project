package com.carrental.dto;

import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class UserBanDto {
    private boolean banned;
    private String reason;
}

