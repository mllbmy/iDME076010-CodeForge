package org.example.FutureService.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ErrorCode 枚举单元测试")
class ErrorCodeTest {

    @Nested
    @DisplayName("枚举值完整性测试")
    class EnumValuesCompletenessTests {

        @Test
        @DisplayName("包含 SUCCESS 枚举值")
        void containsSuccess() {
            assertNotNull(ErrorCode.SUCCESS);
            assertEquals(200, ErrorCode.SUCCESS.getCode());
        }

        @Test
        @DisplayName("包含所有客户端错误码 (4xx)")
        void containsAllClientErrors() {
            assertEquals(400, ErrorCode.BAD_REQUEST.getCode());
            assertEquals(401, ErrorCode.UNAUTHORIZED.getCode());
            assertEquals(403, ErrorCode.FORBIDDEN.getCode());
            assertEquals(404, ErrorCode.NOT_FOUND.getCode());
            assertEquals(422, ErrorCode.VALIDATION_FAILED.getCode());
        }

        @Test
        @DisplayName("包含所有服务端错误码 (5xx)")
        void containsAllServerErrors() {
            assertEquals(500, ErrorCode.INTERNAL_ERROR.getCode());
            assertEquals(501, ErrorCode.IDME_SDK_ERROR.getCode());
            assertEquals(502, ErrorCode.DATABASE_ERROR.getCode());
            assertEquals(503, ErrorCode.EXTERNAL_SERVICE_ERROR.getCode());
        }

        @Test
        @DisplayName("枚举总数正确")
        void correctTotalCount() {
            ErrorCode[] values = ErrorCode.values();
            assertEquals(10, values.length);  // 1个成功 + 5个客户端 + 4个服务端
        }
    }

    @Nested
    @DisplayName("getCode() 方法测试")
    class GetCodeTests {

        @Test
        @DisplayName("SUCCESS 返回 200")
        void successReturns200() {
            assertEquals(200, ErrorCode.SUCCESS.getCode());
        }

        @Test
        @DisplayName("BAD_REQUEST 返回 400")
        void badRequestReturns400() {
            assertEquals(400, ErrorCode.BAD_REQUEST.getCode());
        }

        @Test
        @DisplayName("INTERNAL_ERROR 返回 500")
        void internalErrorReturns500() {
            assertEquals(500, ErrorCode.INTERNAL_ERROR.getCode());
        }

        @Test
        @DisplayName("所有错误码都是正整数")
        void allCodesArePositive() {
            for (ErrorCode code : ErrorCode.values()) {
                assertTrue(code.getCode() > 0,
                    code.name() + " 的错误码应该是正数，实际: " + code.getCode());
            }
        }

        @Test
        @DisplayName("错误码不重复")
        void noDuplicateCodes() {
            long distinctCount = java.util.Arrays.stream(ErrorCode.values())
                    .map(ErrorCode::getCode)
                    .distinct()
                    .count();

            assertEquals(ErrorCode.values().length, distinctCount,
                "存在重复的错误码");
        }
    }

    @Nested
    @DisplayName("getMessage() 方法测试")
    class GetMessageTests {

        @Test
        @DisplayName("所有枚举都有非空消息")
        void allHaveNonEmptyMessage() {
            for (ErrorCode code : ErrorCode.values()) {
                assertNotNull(code.getMessage(), code.name() + " 消息不应为空");
                assertFalse(code.getMessage().isBlank(), code.name() + " 消息不应为空白");
            }
        }

        @Test
        @DisplayName("SUCCESS 消息为 '操作成功'")
        void successMessage() {
            assertEquals("操作成功", ErrorCode.SUCCESS.getMessage());
        }

        @Test
        @DisplayName("消息长度合理（不超过50字符）")
        void messageLengthReasonable() {
            for (ErrorCode code : ErrorCode.values()) {
                assertTrue(code.getMessage().length() <= 50,
                    code.name() + " 消息过长: " + code.getMessage().length() + "字符");
            }
        }
    }

    @Nested
    @DisplayName("valueOf() 方法测试")
    class ValueOfTests {

        @Test
        @DisplayName("通过名称获取枚举值 - SUCCESS")
        void valueOfSuccess() {
            ErrorCode code = ErrorCode.valueOf("SUCCESS");
            assertSame(ErrorCode.SUCCESS, code);
        }

        @Test
        @DisplayName("通过名称获取枚举值 - IDME_SDK_ERROR")
        void valueOfIdmeSdkError() {
            ErrorCode code = ErrorCode.valueOf("IDME_SDK_ERROR");
            assertSame(ErrorCode.IDME_SDK_ERROR, code);
        }

        @Test
        @DisplayName("无效名称抛出 IllegalArgumentException")
        void invalidNameThrowsException() {
            assertThrows(IllegalArgumentException.class, () -> {
                ErrorCode.valueOf("INVALID_CODE");
            });
        }

        @Test
        @DisplayName("null 名称抛出 NullPointerException")
        void nullNameThrowsException() {
            assertThrows(NullPointerException.class, () -> {
                ErrorCode.valueOf(null);
            });
        }
    }

    @Nested
    @DisplayName("业务场景分类测试")
    class BusinessScenarioClassificationTests {

        @Test
        @DisplayName("成功场景使用 2xx 码")
        void successUses2xx() {
            int code = ErrorCode.SUCCESS.getCode();
            assertTrue(code >= 200 && code < 300, "成功应该用 2xx 码");
        }

        @Test
        @DisplayName("客户端错误使用 4xx 码")
        void clientErrorsUse4xx() {
            ErrorCode[] clientErrors = {
                ErrorCode.BAD_REQUEST,
                ErrorCode.UNAUTHORIZED,
                ErrorCode.FORBIDDEN,
                ErrorCode.NOT_FOUND,
                ErrorCode.VALIDATION_FAILED
            };

            for (ErrorCode code : clientErrors) {
                assertTrue(code.getCode() >= 400 && code.getCode() < 500,
                    code.name() + " 应该使用 4xx 码");
            }
        }

        @Test
        @DisplayName("服务端错误使用 5xx 码")
        void serverErrorsUse5xx() {
            ErrorCode[] serverErrors = {
                ErrorCode.INTERNAL_ERROR,
                ErrorCode.IDME_SDK_ERROR,
                ErrorCode.DATABASE_ERROR,
                ErrorCode.EXTERNAL_SERVICE_ERROR
            };

            for (ErrorCode code : serverErrors) {
                assertTrue(code.getCode() >= 500 && code.getCode() < 600,
                    code.name() + " 应该使用 5xx 码");
            }
        }
    }

    @Nested
    @DisplayName("实际使用场景模拟")
    class RealWorldUsageScenarios {

        @Test
        @DisplayName("场景1: 参数校验失败返回 VALIDATION_FAILED")
        void scenario1_ValidationFailure() {
            ErrorCode expected = ErrorCode.VALIDATION_FAILED;
            assertEquals(422, expected.getCode());
            assertTrue(expected.getMessage().contains("校验"));
        }

        @Test
        @DisplayName("场景2: iDME SDK 调用失败返回 IDME_SDK_ERROR")
        void scenario2_SdkCallFailure() {
            ErrorCode expected = ErrorCode.IDME_SDK_ERROR;
            assertEquals(501, expected.getCode());
            assertTrue(expected.getMessage().contains("iDME"));
            assertTrue(expected.getMessage().contains("SDK"));
        }

        @Test
        @DisplayName("场景3: 数据库操作失败返回 DATABASE_ERROR")
        void scenario3_DatabaseOperationFailure() {
            ErrorCode expected = ErrorCode.DATABASE_ERROR;
            assertEquals(502, expected.getCode());
            assertTrue(expected.getMessage().contains("数据库"));
        }

        @Test
        @DisplayName("场景4: 未认证访问返回 UNAUTHORIZED")
        void scenario4_UnauthorizedAccess() {
            ErrorCode expected = ErrorCode.UNAUTHORIZED;
            assertEquals(401, expected.getCode());
            assertTrue(expected.getMessage().contains("认证"));
        }

        @Test
        @DisplayName("场景5: 权限不足返回 FORBIDDEN")
        void scenario5_ForbiddenAccess() {
            ErrorCode expected = ErrorCode.FORBIDDEN;
            assertEquals(403, expected.getCode());
            assertTrue(expected.getMessage().contains("权限"));
        }
    }
}
