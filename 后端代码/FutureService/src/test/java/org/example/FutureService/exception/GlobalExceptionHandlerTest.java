package org.example.FutureService.exception;

import org.example.FutureService.common.Result;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("GlobalExceptionHandler 单元测试")
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Nested
    @DisplayName("handleBusinessException() 测试")
    class HandleBusinessExceptionTests {

        @Test
        @DisplayName("处理简单 BusinessException")
        void handleSimpleBusinessException() {
            BusinessException ex = new BusinessException(400, "Bad Request");

            Result<Map<String, Object>> result = exceptionHandler.handleBusinessException(ex);

            assertEquals(400, result.getCode());
            assertEquals("Bad Request", result.getMessage());
            assertNotNull(result.getError());
        }

        @Test
        @DisplayName("处理带字符串详情的 BusinessException")
        void handleBusinessExceptionWithStringDetail() {
            BusinessException ex = new BusinessException(422, "Validation Failed",
                    "Field equipmentName cannot be empty");

            Result<Map<String, Object>> result = exceptionHandler.handleBusinessException(ex);

            assertEquals(422, result.getCode());
            assertNotNull(result.getError());

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertEquals(422, detail.get("errorCode"));
            assertEquals("Validation Failed", detail.get("errorMessage"));
            assertEquals("Field equipmentName cannot be empty", detail.get("errorDetail"));
        }

        @Test
        @DisplayName("处理带 Map 数据的 BusinessException（结构化数据）")
        void handleBusinessExceptionWithStructuredData() {
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("operation", "create");
            errorData.put("sdkError", "Connection timeout");

            BusinessException ex = new BusinessException(501, "SDK Error", errorData);

            Result<Map<String, Object>> result = exceptionHandler.handleBusinessException(ex);

            assertEquals(501, result.getCode());
            assertNotNull(result.getError());

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertNotNull(detail.get("data"));  // 结构化数据应该存在
            assertTrue(detail.containsKey("data"));
        }

        @Test
        @DisplayName("处理带 List 数据的 BusinessException")
        void handleBusinessExceptionWithListData() {
            java.util.List<String> errors = java.util.Arrays.asList("Error 1", "Error 2");
            BusinessException ex = new BusinessException(422, "Multiple Errors", errors);

            Result<Map<String, Object>> result = exceptionHandler.handleBusinessException(ex);

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertNotNull(detail.get("data"));
        }
    }

    @Nested
    @DisplayName("handleGeneralException() 兜底异常测试")
    class HandleGeneralExceptionTests {

        @Test
        @DisplayName("处理 RuntimeException")
        void handleRuntimeException() {
            RuntimeException ex = new RuntimeException("Unexpected error");

            Result<Map<String, Object>> result = exceptionHandler.handleGeneralException(ex);

            assertEquals(500, result.getCode());
            assertNotNull(result.getMessage());
            assertNotNull(result.getError());

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertEquals("RuntimeException", detail.get("exceptionType"));
            assertEquals("Unexpected error", detail.get("errorMessage"));
            assertNotNull(detail.get("stackTrace"));
            assertNotNull(detail.get("timestamp"));
        }

        @Test
        @DisplayName("处理带 cause 的异常")
        void handleExceptionWithCause() {
            RuntimeException cause = new RuntimeException("Root cause");
            RuntimeException ex = new RuntimeException("Wrapper", cause);

            Result<Map<String, Object>> result = exceptionHandler.handleGeneralException(ex);

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertEquals("Root cause", detail.get("cause"));
            assertNotNull(detail.get("causeType"));
        }

        @Test
        @DisplayName("处理 NullPointerException")
        void handleNullPointerException() {
            NullPointerException ex = new NullPointerException("Object is null");

            Result<Map<String, Object>> result = exceptionHandler.handleGeneralException(ex);

            assertEquals(500, result.getCode());
            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertEquals("NullPointerException", detail.get("exceptionType"));
        }

        @Test
        @DisplayName("处理异常消息为 null 的情况")
        void handleExceptionWithNullMessage() {
            RuntimeException ex = new RuntimeException((String) null);

            Result<Map<String, Object>> result = exceptionHandler.handleGeneralException(ex);

            assertNotNull(result.getMessage());
            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertNull(detail.get("errorMessage"));
        }

        @Test
        @DisplayName("异常消息过长时自动截断")
        void handleExceptionWithLongMessage() {
            String longMessage = "A".repeat(200);
            RuntimeException ex = new RuntimeException(longMessage);

            Result<Map<String, Object>> result = exceptionHandler.handleGeneralException(ex);

            assertNotNull(result.getMessage());
            assertTrue(result.getMessage().length() <= 200,
                "消息应该被截断到合理长度");
        }
    }

    @Nested
    @DisplayName("特殊异常类型处理测试")
    class SpecialExceptionHandlingTests {

        @Test
        @DisplayName("处理 HttpMessageNotReadableException (JSON 解析错误)")
        void handleJsonParseException() {
            HttpMessageNotReadableException ex =
                new HttpMessageNotReadableException("JSON parse error: Unexpected character");

            Result<Map<String, Object>> result = exceptionHandler.handleHttpMessageNotReadable(ex);

            assertEquals(400, result.getCode());
            assertTrue(result.getMessage().contains("JSON"));

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertEquals("HttpMessageNotReadableException", detail.get("exceptionType"));
            assertNotNull(detail.get("suggestion"));
        }

        @Test
        @DisplayName("处理 MissingServletRequestParameterException")
        void handleMissingParameterException() {
            MissingServletRequestParameterException ex =
                new MissingServletRequestParameterException("id", "Long");

            Result<Map<String, Object>> result = exceptionHandler.handleMissingParams(ex);

            assertEquals(400, result.getCode());
            assertTrue(result.getMessage().contains("id"));

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertEquals("id", detail.get("parameterName"));
            assertEquals("Long", detail.get("parameterType"));
        }

        @Test
        @DisplayName("处理 MethodArgumentTypeMismatchException")
        void handleTypeMismatchException() {
            MethodArgumentTypeMismatchException ex =
                new MethodArgumentTypeMismatchException("abc", Long.class, "id", null, null);

            Result<Map<String, Object>> result = exceptionHandler.handleTypeMismatch(ex);

            assertEquals(400, result.getCode());
            assertTrue(result.getMessage().contains("参数类型错误"));

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertEquals("id", detail.get("parameterName"));
            assertEquals("Long", detail.get("requiredType"));
            assertEquals("abc", detail.get("actualValue"));
        }

        @Test
        @DisplayName("处理 IllegalArgumentException")
        void handleIllegalArgumentException() {
            IllegalArgumentException ex =
                new IllegalArgumentException("Invalid argument value: -1");

            Result<Map<String, Object>> result = exceptionHandler.handleIllegalArgument(ex);

            assertEquals(400, result.getCode());
            assertTrue(result.getMessage().contains("参数不合法"));

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertNotNull(detail.get("stackTrace"));
        }
    }

    @Nested
    @DisplayName("响应格式一致性测试")
    class ResponseFormatConsistencyTests {

        @Test
        @DisplayName("所有异常响应都包含 code 字段")
        void allResponsesContainCode() {
            BusinessException businessEx = new BusinessException(400, "Error");
            RuntimeException runtimeEx = new RuntimeException("Error");

            Result<?> businessResult = exceptionHandler.handleBusinessException(businessEx);
            Result<?> runtimeResult = exceptionHandler.handleGeneralException(runtimeEx);

            assertNotNull(businessResult.getCode());
            assertNotNull(runtimeResult.getCode());
        }

        @Test
        @DisplayName("所有异常响应都包含 message 字段")
        void allResponsesContainMessage() {
            BusinessException ex = new BusinessException(400, "Error");
            Result<?> result = exceptionHandler.handleBusinessException(ex);

            assertNotNull(result.getMessage());
            assertFalse(result.getMessage().isBlank());
        }

        @Test
        @DisplayName("失败响应的 data 字段为 null")
        void failResponseHasNullData() {
            BusinessException ex = new BusinessException(400, "Error");
            Result<?> result = exceptionHandler.handleBusinessException(ex);

            assertNull(result.getData());
        }

        @Test
        @DisplayName("结构化错误详情包含 exceptionType 字段")
        void structuredDetailContainsExceptionType() {
            BusinessException ex = new BusinessException(400, "Error", "Detail");
            Result<?> result = exceptionHandler.handleBusinessException(ex);

            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertEquals("BusinessException", detail.get("exceptionType"));
        }
    }

    @Nested
    @DisplayName("边界情况和异常场景测试")
    class EdgeCaseAndExceptionScenarioTests {

        @Test
        @DisplayName("空字符串异常消息")
        void emptyExceptionMessage() {
            BusinessException ex = new BusinessException(400, "");
            Result<?> result = exceptionHandler.handleBusinessException(ex);

            assertEquals("", result.getMessage());
        }

        @Test
        @DisplayName("超长异常消息")
        void veryLongExceptionMessage() {
            String longMsg = "X".repeat(1000);
            BusinessException ex = new BusinessException(400, longMsg);
            Result<?> result = exceptionHandler.handleBusinessException(ex);

            assertNotNull(result.getMessage());
        }

        @Test
        @DisplayName("嵌套异常链（3层）")
        void nestedExceptionChain() {
            try {
                try {
                    throw new RuntimeException("Level 3");
                } catch (RuntimeException e3) {
                    try {
                        throw new RuntimeException("Level 2", e3);
                    } catch (RuntimeException e2) {
                        throw new RuntimeException("Level 1", e2);
                    }
                }
            } catch (RuntimeException e1) {
                Result<?> result = exceptionHandler.handleGeneralException(e1);

                Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
                assertNotNull(detail.get("cause"));
                assertNotNull(detail.get("causeType"));
            }
        }

        @Test
        @DisplayName("自定义异常类")
        void customExceptionClass() {
            class CustomException extends Exception {
                public CustomException(String msg) { super(msg); }
            }

            CustomException ex = new CustomException("Custom error");
            Result<?> result = exceptionHandler.handleGeneralException(ex);

            assertEquals(500, result.getCode());
            Map<?, ?> detail = (Map<?, ?>) result.getError().get("detail");
            assertEquals("CustomException", detail.get("exceptionType"));
        }
    }
}
