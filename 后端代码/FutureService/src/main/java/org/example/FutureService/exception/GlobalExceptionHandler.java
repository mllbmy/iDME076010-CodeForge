package org.example.FutureService.exception;

import org.example.FutureService.common.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Map<String, Object>> handleBusinessException(BusinessException e) {
        log.warn("【业务异常】错误码: {}, 消息: {}, 详情: {}", e.getErrorCode(), e.getErrorMessage(), e.getErrorDetail());

        Map<String, Object> errorDetail = new HashMap<>();
        errorDetail.put("errorCode", e.getErrorCode());
        errorDetail.put("errorMessage", e.getErrorMessage());
        errorDetail.put("errorDetail", e.getErrorDetail());
        errorDetail.put("exceptionType", "BusinessException");

        if (e.hasStructuredErrorData()) {
            errorDetail.put("data", e.getErrorData());
        }

        return Result.fail(e.getErrorCode(), e.getErrorMessage(), errorDetail);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Map<String, Object>> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        String errorMsg = "参数校验失败: " + errors.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining(", "));

        log.warn("【参数校验异常】{}", errorMsg);

        Map<String, Object> errorDetail = new HashMap<>();
        errorDetail.put("fieldErrors", errors);
        errorDetail.put("errorCount", errors.size());
        errorDetail.put("exceptionType", "MethodArgumentNotValidException");

        return Result.fail(ErrorCode.VALIDATION_FAILED.getCode(),
                          ErrorCode.VALIDATION_FAILED.getMessage(), errorDetail);
    }

    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Map<String, Object>> handleBindException(BindException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        log.warn("【绑定异常】参数绑定失败: {}", errors);

        Map<String, Object> errorDetail = new HashMap<>();
        errorDetail.put("fieldErrors", errors);
        errorDetail.put("exceptionType", "BindException");

        return Result.fail(ErrorCode.BAD_REQUEST.getCode(), "参数绑定失败", errorDetail);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Map<String, Object>> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        String errorMsg = "请求体解析失败";
        if (e.getMessage() != null) {
            if (e.getMessage().contains("JSON")) {
                errorMsg = "JSON格式错误: " + extractJsonErrorMessage(e.getMessage());
            } else {
                errorMsg = "请求体解析错误: " + e.getMessage();
            }
        }

        log.warn("【请求解析异常】{}", errorMsg);

        Map<String, Object> errorDetail = new HashMap<>();
        errorDetail.put("originalMessage", e.getMessage());
        errorDetail.put("suggestion", "请检查JSON格式是否正确，字段类型是否匹配");
        errorDetail.put("exceptionType", "HttpMessageNotReadableException");

        return Result.fail(ErrorCode.BAD_REQUEST.getCode(), errorMsg, errorDetail);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Map<String, Object>> handleMissingParams(MissingServletRequestParameterException e) {
        String errorMsg = String.format("缺少必填参数: %s (%s)", e.getParameterName(), e.getParameterType());

        log.warn("【参数缺失异常】{}", errorMsg);

        Map<String, Object> errorDetail = new HashMap<>();
        errorDetail.put("parameterName", e.getParameterName());
        errorDetail.put("parameterType", e.getParameterType());
        errorDetail.put("exceptionType", "MissingServletRequestParameterException");

        return Result.fail(ErrorCode.BAD_REQUEST.getCode(), errorMsg, errorDetail);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        String errorMsg = String.format("参数类型错误: %s 应为 %s 类型，但收到值: %s",
                                       e.getName(),
                                       e.getRequiredType() != null ? e.getRequiredType().getSimpleName() : "unknown",
                                       e.getValue());

        log.warn("【参数类型不匹配】{}", errorMsg);

        Map<String, Object> errorDetail = new HashMap<>();
        errorDetail.put("parameterName", e.getName());
        errorDetail.put("requiredType", e.getRequiredType() != null ? e.getRequiredType().getSimpleName() : null);
        errorDetail.put("actualValue", e.getValue());
        errorDetail.put("exceptionType", "MethodArgumentTypeMismatchException");

        return Result.fail(ErrorCode.BAD_REQUEST.getCode(), errorMsg, errorDetail);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Map<String, Object>> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("【非法参数异常】{}", e.getMessage());

        Map<String, Object> errorDetail = new HashMap<>();
        errorDetail.put("message", e.getMessage());
        errorDetail.put("exceptionType", "IllegalArgumentException");
        errorDetail.put("stackTrace", getStackTraceAsString(e));

        return Result.fail(ErrorCode.BAD_REQUEST.getCode(), "参数不合法: " + e.getMessage(), errorDetail);
    }

    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Map<String, Object>> handleNullPointerException(NullPointerException e) {
        log.error("【空指针异常】", e);

        Map<String, Object> errorDetail = new HashMap<>();
        errorDetail.put("message", "发生空指针异常");
        errorDetail.put("exceptionType", "NullPointerException");
        errorDetail.put("stackTrace", getStackTraceAsString(e));

        return Result.fail(ErrorCode.INTERNAL_ERROR.getCode(), "系统内部错误：空指针异常", errorDetail);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Map<String, Object>> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException e) {
        log.warn("【文件大小超限】最大允许大小: {}", e.getMaxUploadSize());

        Map<String, Object> errorDetail = new HashMap<>();
        errorDetail.put("maxSize", e.getMaxUploadSize());
        errorDetail.put("suggestion", "请减小文件大小后重新上传");
        errorDetail.put("exceptionType", "MaxUploadSizeExceededException");

        return Result.fail(ErrorCode.BAD_REQUEST.getCode(), "上传文件过大", errorDetail);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Map<String, Object>> handleGeneralException(Exception e) {
        log.error("【未处理异常】类型: {}, 消息: {}", e.getClass().getName(), e.getMessage(), e);

        Map<String, Object> errorInfo = new HashMap<>();
        errorInfo.put("errorType", e.getClass().getName());
        errorInfo.put("errorMessage", e.getMessage());
        errorInfo.put("timestamp", System.currentTimeMillis());
        errorInfo.put("exceptionType", e.getClass().getSimpleName());
        errorInfo.put("stackTrace", getStackTraceAsString(e));

        if (e.getCause() != null) {
            errorInfo.put("cause", e.getCause().getMessage());
            errorInfo.put("causeType", e.getCause().getClass().getName());
        }

        String userMessage = buildUserFriendlyMessage(e);

        return Result.fail(ErrorCode.INTERNAL_ERROR.getCode(), userMessage, errorInfo);
    }

    private String extractJsonErrorMessage(String originalMessage) {
        if (originalMessage == null) return "未知JSON错误";

        if (originalMessage.contains("Unexpected character")) {
            return "JSON中包含非法字符";
        } else if (originalMessage.contains("Unrecognized token")) {
            return "无法识别的JSON标记";
        } else if (originalMessage.contains("Was expecting")) {
            return "JSON格式不完整或结构错误";
        } else if (originalMessage.contains("Cannot deserialize")) {
            return "数据类型转换失败，请检查字段类型";
        }

        return originalMessage.length() > 200 ? originalMessage.substring(0, 200) + "..." : originalMessage;
    }

    private String buildUserFriendlyMessage(Exception e) {
        String className = e.getClass().getSimpleName();
        String message = e.getMessage();

        if (message == null) {
            return "服务器内部错误，请稍后重试";
        }

        if (className.contains("Timeout") || message.contains("timeout")) {
            return "操作超时，请稍后重试";
        } else if (className.contains("Connection") || message.contains("connection")) {
            return "连接失败，请检查网络连接";
        } else if (message.toLowerCase().contains("sql") || message.toLowerCase().contains("database")) {
            return "数据库操作失败";
        } else if (message.toLowerCase().contains("permission") || message.toLowerCase().contains("access denied")) {
            return "权限不足，无法完成操作";
        } else if (message.toLowerCase().contains("not found") || message.toLowerCase().contains("404")) {
            return "请求的资源不存在";
        }

        return "服务器内部错误: " + (message.length() > 100 ? message.substring(0, 100) + "..." : message);
    }

    private String getStackTraceAsString(Throwable e) {
        StringBuilder sb = new StringBuilder();
        StackTraceElement[] stackTrace = e.getStackTrace();

        int maxLines = Math.min(stackTrace.length, 20);
        for (int i = 0; i < maxLines; i++) {
            sb.append(stackTrace[i].toString()).append("\n");
        }

        if (stackTrace.length > maxLines) {
            sb.append("... 共 ").append(stackTrace.length).append(" 行堆栈信息");
        }

        return sb.toString();
    }
}
