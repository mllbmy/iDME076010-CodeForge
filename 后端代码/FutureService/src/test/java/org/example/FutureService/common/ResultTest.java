package org.example.FutureService.common;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Result 类单元测试")
class ResultTest {

    private TestData testData;

    @BeforeEach
    void setUp() {
        testData = new TestData();
        testData.setId(123L);
        testData.setName("Test Data");
    }

    static class TestData {
        private Long id;
        private String name;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    @Nested
    @DisplayName("ok(T data) 成功响应方法测试")
    class OkMethodTests {

        @Test
        @DisplayName("创建成功响应 - 基本功能")
        void createSuccessResponse_Basic() {
            Result<TestData> result = Result.ok(testData);

            assertEquals(200, result.getCode());
            assertEquals("success", result.getMessage());
            assertNotNull(result.getData());
            assertNull(result.getError());
        }

        @Test
        @DisplayName("创建成功响应 - data 为 null")
        void createSuccessResponse_NullData() {
            Result<Void> result = Result.ok(null);

            assertEquals(200, result.getCode());
            assertEquals("success", result.getMessage());
            assertNull(result.getData());
        }

        @Test
        @DisplayName("创建成功响应 - data 为字符串")
        void createSuccessResponse_StringData() {
            Result<String> result = Result.ok("Hello World");

            assertEquals(200, result.getCode());
            assertEquals("Hello World", result.getData());
        }

        @Test
        @DisplayName("创建成功响应 - data 为数字")
        void createSuccessResponse_NumericData() {
            Result<Long> result = Result.ok(42L);

            assertEquals(200, result.getCode());
            assertEquals(42L, result.getData());
        }

        @Test
        @DisplayName("创建成功响应 - data 为集合")
        void createSuccessResponse_CollectionData() {
            java.util.List<String> list = java.util.Arrays.asList("a", "b", "c");
            Result<java.util.List<String>> result = Result.ok(list);

            assertEquals(200, result.getCode());
            assertEquals(3, result.getData().size());
        }
    }

    @Nested
    @DisplayName("fail(String message) 失败响应方法测试")
    class FailWithMessageOnlyTests {

        @Test
        @DisplayName("创建失败响应 - 仅消息")
        void createFailResponse_MessageOnly() {
            Result<Object> result = Result.fail("Something went wrong");

            assertEquals(500, result.getCode());  // 默认错误码
            assertEquals("Something went wrong", result.getMessage());
            assertNull(result.getData());
        }

        @Test
        @DisplayName("默认错误码为 500")
        void defaultCodeIs500() {
            Result<Object> result = Result.fail("error");

            assertEquals(500, result.getCode());
        }

        @Test
        @DisplayName("消息可以为空字符串")
        void messageCanBeEmpty() {
            Result<Object> result = Result.fail("");

            assertEquals(500, result.getCode());
            assertEquals("", result.getMessage());
        }
    }

    @Nested
    @DisplayName("fail(int code, String message) 自定义错误码方法测试")
    class FailWithCodeAndMessageTests {

        @Test
        @DisplayName("自定义错误码 - 400 Bad Request")
        void customCode400() {
            Result<Object> result = Result.fail(400, "Bad Request");

            assertEquals(400, result.getCode());
            assertEquals("Bad Request", result.getMessage());
            assertNull(result.getData());
        }

        @Test
        @DisplayName("自定义错误码 - 404 Not Found")
        void customCode404() {
            Result<Object> result = Result.fail(404, "Not Found");

            assertEquals(404, result.getCode());
        }

        @Test
        @DisplayName("自定义错误码 - 422 Validation Failed")
        void customCode422() {
            Result<Object> result = Result.fail(422, "Validation Failed");

            assertEquals(422, result.getCode());
        }

        @Test
        @DisplayName("自定义错误码 - 500 Internal Error")
        void customCode500() {
            Result<Object> result = Result.fail(500, "Internal Error");

            assertEquals(500, result.getCode());
        }

        @Test
        @DisplayName("错误码可以使用任意整数")
        void customCodeAnyInteger() {
            Result<Object> result = Result.fail(999, "Custom Error");

            assertEquals(999, result.getCode());
        }
    }

    @Nested
    @DisplayName("fail(int code, String message, Object errorDetail) 带详情的失败响应测试")
    class FailWithDetailTests {

        @Test
        @DisplayName("带 Map 详情的错误响应")
        void failWithMapDetail() {
            Map<String, Object> errorDetail = new HashMap<>();
            errorDetail.put("field", "username");
            errorDetail.put("reason", "cannot be empty");

            Result<Object> result = Result.fail(422, "Validation Failed", errorDetail);

            assertEquals(422, result.getCode());
            assertEquals("Validation Failed", result.getMessage());
            assertNull(result.getData());
            assertNotNull(result.getError());

            Map<?, ?> returnedError = result.getError();
            assertEquals(errorDetail, returnedError.get("detail"));
        }

        @Test
        @DisplayName("带字符串详情的错误响应")
        void failWithStringDetail() {
            Result<Object> result = Result.fail(400, "Bad Request", "Invalid parameter format");

            assertNotNull(result.getError());
            assertEquals("Invalid parameter format",
                ((Map<?, ?>) result.getError()).get("detail"));
        }

        @Test
        @DisplayName("带 null 详情的错误响应")
        void failWithNullDetail() {
            Result<Object> result = Result.fail(500, "Error", null);

            assertNotNull(result.getError());
            assertNull(((Map<?, ?>) result.getError()).get("detail"));
        }

        @Test
        @DisplayName("带复杂嵌套结构的详情")
        void failWithComplexDetail() {
            Map<String, Object> complexDetail = new HashMap<>();
            complexDetail.put("errors", java.util.Arrays.asList("Error 1", "Error 2"));

            Map<String, Object> nested = new HashMap<>();
            nested.put("code", 1001);
            nested.put("message", "Inner error");
            complexDetail.put("nestedError", nested);

            Result<Object> result = Result.fail(500, "Complex Error", complexDetail);

            assertNotNull(result.getError());
            Map<?, ?> detailMap = (Map<?, ?>) result.getError();
            assertNotNull(detailMap.get("detail"));
        }
    }

    @Nested
    @DisplayName("Getter 方法测试")
    class GetterTests {

        @Test
        @DisplayName("getCode() 返回正确的值")
        void getCode_ReturnsCorrectValue() {
            Result<TestData> successResult = Result.ok(testData);
            Result<Object> failResult = Result.fail(400, "Error");

            assertEquals(200, successResult.getCode());
            assertEquals(400, failResult.getCode());
        }

        @Test
        @DisplayName("getMessage() 返回正确的值")
        void getMessage_ReturnsCorrectValue() {
            Result<TestData> successResult = Result.ok(testData);
            Result<Object> failResult = Result.fail(404, "Not Found");

            assertEquals("success", successResult.getMessage());
            assertEquals("Not Found", failResult.getMessage());
        }

        @Test
        @DisplayName("getData() 返回正确的值")
        void getData_ReturnsCorrectValue() {
            Result<TestData> withData = Result.ok(testData);
            Result<Void> withoutData = Result.ok(null);

            assertEquals(testData, withData.getData());
            assertNull(withoutData.getData());
        }

        @Test
        @DisplayName("getError() 在成功响应时返回 null")
        void getError_ReturnsNullForSuccess() {
            Result<TestData> result = Result.ok(testData);

            assertNull(result.getError());
        }

        @Test
        @DisplayName("getError() 在简单失败响应时返回 null")
        void getError_ReturnsNullForSimpleFail() {
            Result<Object> result = Result.fail("Error message");

            assertNull(result.getError());
        }

        @Test
        @DisplayName("getError() 在带详情的失败响应时返回非 null")
        void getError_ReturnsNonNullForDetailedFail() {
            Map<String, Object> detail = new HashMap<>();
            detail.put("key", "value");

            Result<Object> result = Result.fail(500, "Error", detail);

            assertNotNull(result.getError());
            assertTrue(result.getError().containsKey("detail"));
        }
    }

    @Nested
    @DisplayName("泛型类型安全测试")
    class GenericTypeSafetyTests {

        @Test
        @DisplayName("Result<String> 类型安全")
        void stringTypeSafety() {
            Result<String> result = Result.ok("test");

            String data = result.getData();
            assertEquals("test", data);
        }

        @Test
        @DisplayName("Result<Long> 类型安全")
        void longTypeSafety() {
            Result<Long> result = Result.ok(42L);

            Long data = result.getData();
            assertEquals(42L, data.longValue());
        }

        @Test
        @DisplayName("Result<List> 类型安全")
        void listTypeSafety() {
            java.util.List<Integer> numbers = java.util.Arrays.asList(1, 2, 3);
            Result<java.util.List<Integer>> result = Result.ok(numbers);

            java.util.List<Integer> data = result.getData();
            assertEquals(3, data.size());
            assertEquals(Integer.valueOf(1), data.get(0));
        }

        @Test
        @DisplayName("Result<Void> 用于无数据响应")
        void voidTypeSafety() {
            Result<Void> result = Result.ok(null);

            Void data = result.getData();
            assertNull(data);
        }
    }

    @Nested
    @DisplayName("实际使用场景模拟")
    class RealWorldScenarios {

        @Test
        @DisplayName("场景1: API 成功响应")
        void scenario1_ApiSuccessResponse() {
            Map<String, Object> apiResponse = new HashMap<>();
            apiResponse.put("id", 123);
            apiResponse.put("name", "Equipment A01");

            Result<Map<String, Object>> result = Result.ok(apiResponse);

            assertEquals(200, result.getCode());
            assertEquals("Equipment A01", result.getData().get("name"));
        }

        @Test
        @DisplayName("场景2: 业务异常响应（简单）")
        void scenario2_SimpleBusinessErrorResponse() {
            Result<Object> result = Result.fail(400, "设备编码已存在");

            assertEquals(400, result.getCode());
            assertEquals("设备编码已存在", result.getMessage());
        }

        @Test
        @DisplayName("场景3: 校验异常响应（带字段错误）")
        void scenario3_ValidationErrorResponse() {
            Map<String, String> fieldErrors = new HashMap<>();
            fieldErrors.put("equipmentName", "不能为空");
            fieldErrors.put("equipmentCode", "格式错误");

            Result<Object> result = Result.fail(422, "参数校验失败", fieldErrors);

            assertEquals(422, result.getCode());
            assertNotNull(result.getError());

            @SuppressWarnings("unchecked")
            Map<String, Object> errorDetail = (Map<String, Object>) result.getError().get("detail");
            assertEquals(2, errorDetail.size());
        }

        @Test
        @DisplayName("场景4: SDK 异常响应（结构化信息）")
        void scenario4_SdkErrorResponse() {
            Map<String, Object> sdkErrorInfo = new HashMap<>();
            sdkErrorInfo.put("operation", "create");
            sdkErrorInfo.put("sdkError", "Connection timeout");
            sdkErrorInfo.put("timestamp", System.currentTimeMillis());

            Result<Object> result = Result.fail(501, "iDME SDK 调用失败", sdkErrorInfo);

            assertEquals(501, result.getCode());
            assertNotNull(result.getError());

            @SuppressWarnings("unchecked")
            Map<String, Object> detail = (Map<String, Object>) result.getError().get("detail");
            assertEquals("create", detail.get("operation"));
            assertEquals("Connection timeout", detail.get("sdkError"));
        }

        @Test
        @DisplayName("场景5: 统计接口响应")
        void scenario5_CountResponse() {
            Result<Long> countResult = Result.ok(100L);

            assertEquals(200, countResult.getCode());
            assertEquals(100L, countResult.getData());
        }
    }
}
