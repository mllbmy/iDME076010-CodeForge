package org.example.FutureService.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "设备状态枚举")
public enum EquipmentStatus {

    @Schema(description = "运行中")
    RUNNING("运行中"),

    @Schema(description = "已停机")
    STOPPED("已停机"),

    @Schema(description = "维护中")
    MAINTENANCE("维护中"),

    @Schema(description = "故障")
    FAULT("故障");

    private final String description;

    EquipmentStatus(String description) {
        this.description = description;
    }

    @JsonValue
    public String getValue() {
        return this.name();
    }

    public String getDescription() {
        return description;
    }
}
