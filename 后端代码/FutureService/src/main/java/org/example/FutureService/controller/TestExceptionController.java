package org.example.FutureService.controller;

import org.example.FutureService.common.Result;
import org.example.FutureService.exception.BusinessException;
import org.example.FutureService.exception.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestExceptionController {

    private static final Logger log = LoggerFactory.getLogger(TestExceptionController.class);

    @GetMapping("/success")
    public Result<Map<String, Object>> testSuccess() {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "测试成功");
        data.put("timestamp", System.currentTimeMillis());
        return Result.ok(data);
    }

    @GetMapping("/business-exception")
    public Result<Void> testBusinessException() {
        log.info("触发业务异常测试");
        throw new BusinessException(ErrorCode.VALIDATION_FAILED.getCode(),
                                   "这是一个测试业务异常",
                                   "详细错误信息：用户输入了非法参数");
    }

    @GetMapping("/null-pointer")
    public Result<Void> testNullPointerException() {
        log.info("触发空指针异常测试");
        String str = null;
        str.length();
        return Result.ok(null);
    }

    @GetMapping("/illegal-argument")
    public Result<Void> testIllegalArgumentException() {
        log.info("触发非法参数异常测试");
        throw new IllegalArgumentException("参数值不合法：年龄不能为负数");
    }

    @GetMapping("/runtime-exception")
    public Result<Void> testRuntimeException() {
        log.info("触发运行时异常测试");
        int result = 10 / 0;
        return Result.ok(null);
    }

    @PostMapping("/test-request-body")
    public Result<Map<String, Object>> testRequestBody(@RequestBody Map<String, Object> body) {
        log.info("收到请求体: {}", body);

        if (body.containsKey("triggerError") && Boolean.TRUE.equals(body.get("triggerError"))) {
            throw new RuntimeException("请求体中要求触发错误");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("receivedData", body);
        response.put("processed", true);
        return Result.ok(response);
    }

    @GetMapping("/type-mismatch/{id}")
    public Result<Map<String, Object>> testTypeMismatch(@PathVariable Long id) {
        log.info("收到ID参数: {}", id);
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        return Result.ok(response);
    }

    @GetMapping("/missing-param")
    public Result<Void> testMissingParam(@RequestParam String requiredParam) {
        log.info("收到必填参数: {}", requiredParam);
        return Result.ok(null);
    }

    @GetMapping("/custom-error")
    public Result<Map<String, Object>> testCustomError(@RequestParam(defaultValue = "false") boolean includeStackTrace) {
        log.info("自定义错误测试, includeStackTrace={}", includeStackTrace);

        try {
            simulateComplexError();
        } catch (Exception e) {
            Map<String, Object> errorDetail = new HashMap<>();
            errorDetail.put("errorType", "CustomError");
            errorDetail.put("message", "模拟复杂业务逻辑错误");
            errorDetail.put("operation", "simulateComplexError");

            if (includeStackTrace) {
                StringBuilder sb = new StringBuilder();
                StackTraceElement[] stackTrace = e.getStackTrace();
                for (int i = 0; i < Math.min(stackTrace.length, 5); i++) {
                    sb.append(stackTrace[i].toString()).append("\n");
                }
                errorDetail.put("stackTrace", sb.toString());
            }

            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(),
                                       "自定义错误",
                                       errorDetail);
        }

        return Result.ok(null);
    }

    @GetMapping("/all-error-types")
    public Result<Map<String, Object>> testAllErrorTypes() {
        Map<String, Object> result = new HashMap<>();
        result.put("availableTestEndpoints", java.util.Arrays.asList(
            "/test/success - 成功响应",
            "/test/business-exception - 业务异常",
            "/test/null-pointer - 空指针异常",
            "/test/illegal-argument - 非法参数异常",
            "/test/runtime-exception - 运行时异常",
            "/test/type-mismatch/{id} - 参数类型不匹配（传入非数字）",
            "/test/missing-param - 缺少必填参数",
            "/test/custom-error?includeStackTrace=true - 自定义错误（含堆栈）"
        ));
        return Result.ok(result);
    }

    private void simulateComplexError() throws Exception {
        try {
            throw new Exception("第一层异常");
        } catch (Exception e1) {
            try {
                throw new Exception("第二层异常（包装第一层）", e1);
            } catch (Exception e2) {
                throw new Exception("第三层异常（最终抛出）", e2);
            }
        }
    }
}
