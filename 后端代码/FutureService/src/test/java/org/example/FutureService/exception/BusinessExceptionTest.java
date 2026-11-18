package org.example.FutureService.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("BusinessException 单元测试")
class BusinessExceptionTest {

    @Nested
    @DisplayName("构造函数 (int, String) 测试")
    class TwoParamsConstructorTests {

        @Test
        @DisplayName("基本功能 - 正确设置 errorCode 和 message")
        void basicFunctionality() {
            BusinessException ex = new BusinessException(400, "Bad Request");

            assertEquals(400, ex.getErrorCode());
            assertEquals("Bad Request", ex.getErrorMessage());
            assertEquals("Bad Request", ex.getErrorDetail());
            assertNull(ex.getErrorData());
            assertFalse(ex.hasStructuredErrorData());
        }

        @Test
        @DisplayName("错误码边界值 - 使用 0")
        void errorCodeZero() {
            BusinessException ex = new BusinessException(0, "No Error");
            assertEquals(0, ex.getErrorCode());
        }

        @Test
        @DisplayName("错误码边界值 - 使用负数")
        void errorCodeNegative() {
            BusinessException ex = new BusinessException(-1, "Custom Error");
            assertEquals(-1, ex.getErrorCode());
        }

        @Test
        @DisplayName("错误码边界值 - 使用大数")
        void errorCodeLarge() {
            BusinessException ex = new BusinessException(99999, "Large Code");
            assertEquals(99999, ex.getErrorCode());
        }
    }

    @Nested
    @DisplayName("构造函数 (int, String, String) 测试")
    class ThreeParamsStringConstructorTests {

        @Test
        @DisplayName("带详细信息的错误")
        void withDetail() {
            BusinessException ex = new BusinessException(404, "Not Found", "Resource ID=123 not found");

            assertEquals(404, ex.getErrorCode());
            assertEquals("Not Found", ex.getErrorMessage());
            assertEquals("Resource ID=123 not found", ex.getErrorDetail());
            assertNull(ex.getErrorData());
            assertFalse(ex.hasStructuredErrorData());
        }

        @Test
        @DisplayName("detail 为 null")
        void detailIsNull() {
            BusinessException ex = new BusinessException(500, "Error", (String) null);

            assertEquals(500, ex.getErrorCode());
            assertNull(ex.getErrorDetail());
            assertNull(ex.getErrorData());
        }

        @Test
        @DisplayName("detail 为空字符串")
        void detailIsEmpty() {
            BusinessException ex = new BusinessException(400, "Error", "");

            assertEquals(400, ex.getErrorCode());
            assertEquals("", ex.getErrorDetail());
            assertNull(ex.getErrorData());
        }

        @Test
        @DisplayName("detail 包含特殊字符")
        void detailWithSpecialChars() {
            String detail = "错误信息: 字段 <name> 不能为空! @#$%";
            BusinessException ex = new BusinessException(422, "Validation Failed", detail);

            assertEquals(detail, ex.getErrorDetail());
        }
    }

    @Nested
    @DisplayName("构造函数 (int, String, Object) 测试 - 核心修复验证")
    class ThreeParamsObjectConstructorTests {

        @Test
        @DisplayName("传入 Map<String, Object> 数据")
        void withMapData() {
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("operation", "create");
            errorData.put("exceptionClass", "com.huawei.rdm.SdkException");
            errorData.put("exceptionMessage", "Connection timeout");

            BusinessException ex = new BusinessException(501, "SDK Error", errorData);

            assertEquals(501, ex.getErrorCode());
            assertEquals("SDK Error", ex.getErrorMessage());
            assertNotNull(ex.getErrorDetail());  // toString() 结果
            assertTrue(ex.hasStructuredErrorData());
            assertNotNull(ex.getErrorData());
            assertSame(errorData, ex.getErrorData());  // 同一个对象引用
        }

        @Test
        @DisplayName("传入 List<String> 数据")
        void withListData() {
            List<String> errors = Arrays.asList("字段A不能为空", "字段B格式错误");

            BusinessException ex = new BusinessException(422, "Multiple Errors", errors);

            assertEquals(422, ex.getErrorCode());
            assertTrue(ex.hasStructuredErrorData());
            assertNotNull(ex.getErrorData());

            @SuppressWarnings("unchecked")
            List<?> dataList = (List<?>) ex.getErrorData();
            assertEquals(2, dataList.size());
        }

        @Test
        @DisplayName("传入 Integer 对象（非 String）")
        void withIntegerObject() {
            BusinessException ex = new BusinessException(500, "Numeric Error", 42);

            assertEquals(500, ex.getErrorCode());
            assertTrue(ex.hasStructuredErrorData());
            assertEquals(Integer.valueOf(42), ex.getErrorData());
            assertEquals("42", ex.getErrorDetail());  // toString()
        }

        @Test
        @DisplayName("传入自定义对象")
        void withCustomObject() {
            CustomErrorInfo customError = new CustomErrorInfo("field1", "cannot be null");

            BusinessException ex = new BusinessException(422, "Custom Error", customError);

            assertTrue(ex.hasStructuredErrorData());
            assertNotNull(ex.getErrorData());
            assertSame(customError, ex.getErrorData());
        }

        @Test
        @DisplayName("传入 null 值")
        void withNullData() {
            BusinessException ex = new BusinessException(500, "Error", (Object) null);

            assertEquals(500, ex.getErrorCode());
            assertNull(ex.getErrorDetail());
            assertNull(ex.getErrorData());
            assertFalse(ex.hasStructuredErrorData());
        }

        @Test
        @DisplayName("传入空 Map")
        void withEmptyMap() {
            Map<String, Object> emptyMap = new HashMap<>();
            BusinessException ex = new BusinessException(400, "Error", emptyMap);

            assertTrue(ex.hasStructuredErrorData());
            assertEquals(0, ((Map<?, ?>) ex.getErrorData()).size());
        }

        @Test
        @DisplayName("传入复杂嵌套结构")
        void withNestedStructure() {
            Map<String, Object> nested = new HashMap<>();
            nested.put("level1", "value1");

            Map<String, Object> inner = new HashMap<>();
            inner.put("level2", "value2");
            nested.put("nested", inner);

            BusinessException ex = new BusinessException(500, "Complex Error", nested);

            assertTrue(ex.hasStructuredErrorData());
            assertNotNull(ex.getErrorData());
        }

        static class CustomErrorInfo {
            private final String field;
            private final String reason;

            CustomErrorInfo(String field, String reason) {
                this.field = field;
                this.reason = reason;
            }

            @Override
            public String toString() {
                return "CustomErrorInfo{field='" + field + "', reason='" + reason + "'}";
            }
        }
    }

    @Nested
    @DisplayName("hasStructuredErrorData() 方法测试")
    class HasStructuredErrorDataTests {

        @Test
        @DisplayName("String 类型的 detail 返回 false")
        void stringDetail_ReturnsFalse() {
            BusinessException ex = new BusinessException(400, "Error", "string detail");
            assertFalse(ex.hasStructuredErrorData());
        }

        @Test
        @DisplayName("Map 类型返回 true")
        void mapData_ReturnsTrue() {
            BusinessException ex = new BusinessException(400, "Error", new HashMap<>());
            assertTrue(ex.hasStructuredErrorData());
        }

        @Test
        @DisplayName("List 类型返回 true")
        void listData_ReturnsTrue() {
            BusinessException ex = new BusinessException(400, "Error", Arrays.asList("a", "b"));
            assertTrue(ex.hasStructuredErrorData());
        }

        @Test
        @DisplayName("null data 返回 false")
        void nullData_ReturnsFalse() {
            BusinessException ex = new BusinessException(400, "Error", (Object) null);
            assertFalse(ex.hasStructuredErrorData());
        }
    }

    @Nested
    @DisplayName("equals() 和 hashCode() 方法测试")
    class EqualsAndHashCodeTests {

        @Test
        @DisplayName("相同属性的对象相等")
        void sameProperties_AreEqual() {
            BusinessException ex1 = new BusinessException(400, "Error", "Detail");
            BusinessException ex2 = new BusinessException(400, "Error", "Detail");

            assertEquals(ex1, ex2);
            assertEquals(ex1.hashCode(), ex2.hashCode());
        }

        @Test
        @DisplayName("不同 errorCode 不相等")
        void differentCode_NotEqual() {
            BusinessException ex1 = new BusinessException(400, "Error", "Detail");
            BusinessException ex2 = new BusinessException(401, "Error", "Detail");

            assertNotEquals(ex1, ex2);
        }

        @Test
        @DisplayName("不同 message 不相等")
        void differentMessage_NotEqual() {
            BusinessException ex1 = new BusinessException(400, "Error1", "Detail");
            BusinessException ex2 = new BusinessException(400, "Error2", "Detail");

            assertNotEquals(ex1, ex2);
        }

        @Test
        @DisplayName("与自身相等")
        void equalItself() {
            BusinessException ex = new BusinessException(400, "Error");
            assertEquals(ex, ex);
        }

        @Test
        @DisplayName("与 null 不相等")
        void notEqualToNull() {
            BusinessException ex = new BusinessException(400, "Error");
            assertNotEquals(null, ex);
        }

        @Test
        @DisplayName("与其他类型不相等")
        void notEqualToOtherType() {
            BusinessException ex = new BusinessException(400, "Error");
            assertNotEquals("string", ex);
        }
    }

    @Nested
    @DisplayName("toString() 方法测试")
    class ToStringTests {

        @Test
        @DisplayName("包含 errorCode")
        void containsErrorCode() {
            BusinessException ex = new BusinessException(400, "Test");
            assertTrue(ex.toString().contains("errorCode=400"));
        }

        @Test
        @DisplayName("包含 errorMessage")
        void containsErrorMessage() {
            BusinessException ex = new BusinessException(400, "Test Message");
            assertTrue(ex.toString().contains("errorMessage='Test Message'"));
        }

        @Test
        @DisplayName("包含 hasStructuredData 标志")
        void containsHasStructuredDataFlag() {
            BusinessException exWithString = new BusinessException(400, "Error", "detail");
            assertTrue(exWithString.toString().contains("hasStructuredData=false"));

            BusinessException exWithMap = new BusinessException(400, "Error", new HashMap<>());
            assertTrue(exWithMap.toString().contains("hasStructuredData=true"));
        }
    }

    @Nested
    @DisplayName("异常链继承测试")
    class ExceptionChainTests {

        @Test
        @DisplayName("可以设置 cause")
        void canSetCause() {
            RuntimeException cause = new RuntimeException("Original error");
            BusinessException ex = new BusinessException(500, "Wrapper", "Detail");
            ex.initCause(cause);

           assertSame(cause, ex.getCause());
        }

        @Test
        @DisplayName("getMessage() 返回 message")
        void getMessageReturnsMessage() {
            BusinessException ex = new BusinessException(400, "Test Message");
            assertEquals("Test Message", ex.getMessage());
        }
    }

    @Nested
    @DisplayName("实际使用场景模拟")
    class RealWorldScenarios {

        @Test
        @DisplayName("场景1: 简单业务规则违反")
        void scenario1_SimpleBusinessRuleViolation() {
            BusinessException ex = new BusinessException(400, "设备编码已存在");

            assertEquals(400, ex.getErrorCode());
            assertEquals("设备编码已存在", ex.getErrorMessage());
            assertFalse(ex.hasStructuredErrorData());
        }

        @Test
        @DisplayName("场景2: 参数校验失败（字符串详情）")
        void scenario2_ValidationFailureWithStringDetail() {
            BusinessException ex = new BusinessException(422, "参数校验失败",
                    "equipmentName 不能超过50字符");

            assertEquals(422, ex.getErrorCode());
            assertEquals("equipmentName 不能超过50字符", ex.getErrorDetail());
            assertFalse(ex.hasStructuredErrorData());
        }

        @Test
        @DisplayName("场景3: SDK 异常（结构化数据）")
        void scenario3_SdkExceptionWithStructuredData() {
            Map<String, Object> sdkErrorContext = new HashMap<>();
            sdkErrorContext.put("operation", "createEquipment");
            sdkErrorContext.put("sdkErrorCode", "RDME-1001");
            sdkErrorContext.put("sdkErrorMessage", "Connection timeout to iDME server");
            sdkErrorContext.put("requestId", "REQ-1715678900000-001");
            sdkErrorContext.put("timestamp", System.currentTimeMillis());

            BusinessException ex = new BusinessException(501, "iDME SDK 调用失败", sdkErrorContext);

            assertEquals(501, ex.getErrorCode());
            assertTrue(ex.hasStructuredErrorData());

            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) ex.getErrorData();
            assertEquals("createEquipment", data.get("operation"));
            assertEquals("RDME-1001", data.get("sdkErrorCode"));
        }

        @Test
        @DisplayName("场景4: 多个校验错误列表")
        void scenario4_MultipleValidationErrors() {
            List<String> validationErrors = Arrays.asList(
                "设备名称不能为空",
                "设备编码格式不正确",
                "设备类型不在允许范围内"
            );

            BusinessException ex = new BusinessException(422, "数据校验失败", validationErrors);

            assertTrue(ex.hasStructuredErrorData());

            @SuppressWarnings("unchecked")
            List<?> errors = (List<?>) ex.getErrorData();
            assertEquals(3, errors.size());
            assertEquals("设备名称不能为空", errors.get(0));
        }

        @Test
        @DisplayName("场景5: 异常详情包含异常链")
        void scenario5_ExceptionWithCauseChain() {
            try {
                try {
                    throw new RuntimeException("Level 3 error");
                } catch (RuntimeException e3) {
                    throw new RuntimeException("Level 2 error", e3);
                }
            } catch (RuntimeException e2) {
                Map<String, Object> errorInfo = new HashMap<>();
                errorInfo.put("rootCause", e2.getCause().getMessage());
                errorInfo.put("wrapperMessage", e2.getMessage());

                BusinessException ex = new BusinessException(500, "Nested exception", errorInfo);

                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) ex.getErrorData();
                assertEquals("Level 3 error", data.get("rootCause"));
                assertEquals("Level 2 error", data.get("wrapperMessage"));
            }
        }
    }
}
