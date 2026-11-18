package org.example.FutureService.exception;

public enum ErrorCode {

    SUCCESS(200, "操作成功"),

    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未认证"),
    FORBIDDEN(403, "无权限"),
    NOT_FOUND(404, "资源不存在"),
    VALIDATION_FAILED(422, "数据校验失败"),

    INTERNAL_ERROR(500, "服务器内部错误"),
    IDME_SDK_ERROR(501, "iDME SDK 调用失败"),
    DATABASE_ERROR(502, "数据库操作失败"),
    EXTERNAL_SERVICE_ERROR(503, "外部服务调用失败");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
