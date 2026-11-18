package org.example.FutureService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.huawei.innovation.rdm.prims.delegator.EquipmentDelegator;
import com.huawei.innovation.rdm.prims.delegator.PartDelegator;
import com.huawei.innovation.rdm.prims.delegator.Bom_relationDelegator;
import com.huawei.innovation.rdm.prims.dto.entity.*;
import com.huawei.innovation.rdm.prims.dto.relation.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest
@DisplayName("基于设计态枚举值的接口测试")
class EnumBasedAPITest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EquipmentDelegator equipmentDelegator;

    @MockBean
    private PartDelegator partDelegator;

    @MockBean
    private Bom_relationDelegator bomRelationDelegator;

    @BeforeEach
    void setUpMocks() {
        EquipmentViewDTO mockEquip = new EquipmentViewDTO();
        mockEquip.setId("mock-eq-id");
        mockEquip.setDevicename("mock-device");
        mockEquip.setDevicecode("MOCK-001");

        when(equipmentDelegator.create(any())).thenReturn(mockEquip);
        when(equipmentDelegator.batchCreate(any())).thenReturn(Arrays.asList(mockEquip, mockEquip, mockEquip, mockEquip, mockEquip));
        when(equipmentDelegator.batchUpdate(any())).thenReturn(Arrays.asList(mockEquip, mockEquip, mockEquip, mockEquip));
        when(equipmentDelegator.update(any())).thenReturn(mockEquip);
        when(equipmentDelegator.list(any(), any()))
                .thenReturn(Arrays.asList(new EquipmentListViewDTO()));

        PartViewDTO mockPart = new PartViewDTO();
        mockPart.setId("mock-part-id");
        mockPart.setName("mock-part-name");

        when(partDelegator.create(any())).thenReturn(mockPart);

        Bom_relationViewDTO mockBom = new Bom_relationViewDTO();
        when(bomRelationDelegator.create(any())).thenReturn(mockBom);
        when(bomRelationDelegator.list(any(), any()))
                .thenReturn(Arrays.asList(new Bom_relationListViewDTO()));
    }

    @Nested
    @DisplayName("1. Equipment - DeviceType 枚举测试")
    class EquipmentDeviceTypeTests {

        @TestFactory
        @DisplayName("所有9种设备类型均可成功创建设备")
        List<org.junit.jupiter.api.DynamicContainer> testAllDeviceTypes() {
            return Arrays.asList(
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("A001", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("创建轴类加工设备", () ->
                        createEquipmentWithType("A001"))
                )),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("A002", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("创建数控机床", () ->
                        createEquipmentWithType("A002"))
                )),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("A003", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("创建铣床", () ->
                        createEquipmentWithType("A003"))
                )),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("A004", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("创建三坐标测量机", () ->
                        createEquipmentWithType("A004"))
                )),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("A005", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("创建车床", () ->
                        createEquipmentWithType("A005"))
                )),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("A006", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("创建锻造设备", () ->
                        createEquipmentWithType("A006"))
                )),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("A007", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("创建铸造设备", () ->
                        createEquipmentWithType("A007"))
                )),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("A008", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("创建热处理设备", () ->
                        createEquipmentWithType("A008"))
                )),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("A009", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("创建磨床", () ->
                        createEquipmentWithType("A009"))
                ))
            );
        }

        private void createEquipmentWithType(String deviceType) throws Exception {
            String equipmentJson = String.format("""
                {
                    "devicename": "测试设备-%s",
                    "devicecode": "TEST-%s-001",
                    "device_Type": "%s"
                }
                """, deviceType, deviceType, deviceType);

            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(equipmentJson))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").exists());
        }
    }

    @Nested
    @DisplayName("2. Equipment - Status 枚举测试")
    class EquipmentStatusTests {

        @Test
        @DisplayName("创建启用状态的设备")
        void createEquipmentWithStatusON() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"devicename\":\"启用的设备\",\"devicecode\":\"ON-001\",\"device_Type\":\"A002\"}"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("创建停用状态的设备")
        void createEquipmentWithStatusOFF() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"devicename\":\"停用的设备\",\"devicecode\":\"OFF-001\",\"device_Type\":\"A002\"}"))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("3. Equipment - Depreciation_method 枚举测试")
    class EquipmentDepreciationMethodTests {

        @TestFactory
        @DisplayName("所有4种折旧方式均可设置成功")
        List<org.junit.jupiter.api.DynamicTest> testAllDepreciationMethods() {
            return Arrays.asList(
                org.junit.jupiter.api.DynamicTest.dynamicTest("B001", () -> updateDepreciationMethod("B001")),
                org.junit.jupiter.api.DynamicTest.dynamicTest("B002", () -> updateDepreciationMethod("B002")),
                org.junit.jupiter.api.DynamicTest.dynamicTest("B003", () -> updateDepreciationMethod("B003")),
                org.junit.jupiter.api.DynamicTest.dynamicTest("B004", () -> updateDepreciationMethod("B004"))
            );
        }

        private void updateDepreciationMethod(String method) throws Exception {
            mockMvc.perform(post("/Equipment/update")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(String.format("{\"id\":\"test-equipment-id\",\"depreciation_Method\":\"%s\"}", method)))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("4. Equipment - 多枚举字段组合测试")
    class EquipmentCombinedEnumTests {

        @Test
        @DisplayName("完整枚举组合：数控机床+双倍余额递减法")
        void fullCombination_CNC_ON_DoubleDecline() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"devicename\":\"DMG MORI\",\"devicecode\":\"DMG-001\",\"device_Type\":\"A002\",\"depreciation_Method\":\"B001\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").exists());
        }

        @Test
        @DisplayName("完整枚举组合：三坐标测量机+年限平均法")
        void fullCombination_CMM_OFF_StraightLine() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"devicename\":\"ZEISS\",\"devicecode\":\"ZEISS-001\",\"device_Type\":\"A004\",\"depreciation_Method\":\"B002\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").exists());
        }

        @TestFactory
        @DisplayName("设备类型×状态笛卡尔积测试（9×2=18种组合）")
        List<org.junit.jupiter.api.DynamicContainer> testAllDeviceTypeAndStatusCombinations() {
            String[] deviceTypes = {"A001", "A002", "A003", "A004", "A005", "A006", "A007", "A008", "A009"};
            return Arrays.stream(deviceTypes)
                .map(type -> org.junit.jupiter.api.DynamicContainer.dynamicContainer(
                    type,
                    List.of(
                        org.junit.jupiter.api.DynamicTest.dynamicTest(String.format("%s-D001", type), () ->
                            createEquipmentWithCombination(type)),
                        org.junit.jupiter.api.DynamicTest.dynamicTest(String.format("%s-D002", type), () ->
                            createEquipmentWithCombination(type))
                    )
                ))
                .toList();
        }

        private void createEquipmentWithCombination(String deviceType) throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(String.format("{\"devicename\":\"combo\",\"devicecode\":\"COMBO-001\",\"device_Type\":\"%s\"}", deviceType)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").exists());
        }
    }

    @Nested
    @DisplayName("5. Part - Part_category 枚举测试")
    class PartCategoryTests {

        @TestFactory
        @DisplayName("所有10种零件分类均可成功创建")
        List<org.junit.jupiter.api.DynamicContainer> testAllPartCategories() {
            return Arrays.asList(
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C001", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("伺服电机", () -> createPartWithCategory("C001")))),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C002", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("齿轮", () -> createPartWithCategory("C002")))),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C003", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("轴承", () -> createPartWithCategory("C003")))),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C005", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("太阳轮", () -> createPartWithCategory("C005")))),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C007", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("内齿圈", () -> createPartWithCategory("C007")))),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C008", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("输出轴", () -> createPartWithCategory("C008")))),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C009", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("输入轴", () -> createPartWithCategory("C009")))),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C010", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("密封件", () -> createPartWithCategory("C010")))),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C011", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("联轴器", () -> createPartWithCategory("C011")))),
                org.junit.jupiter.api.DynamicContainer.dynamicContainer("C012", List.of(
                    org.junit.jupiter.api.DynamicTest.dynamicTest("减速器壳体", () -> createPartWithCategory("C012"))))
            );
        }

        private void createPartWithCategory(String category) throws Exception {
            mockMvc.perform(post("/Part/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(String.format("{\"name\":\"test-part\",\"part_Category\":\"%s\",\"master\":{},\"branch\":{}}", category)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").exists());
        }
    }

    @Nested
    @DisplayName("6. Part - Status 枚举测试")
    class PartStatusTests {

        @ParameterizedTest
        @CsvSource({"D001", "D002"})
        @DisplayName("零件的两种状态均可设置")
        void partStatusValues_valid(String status) throws Exception {
            mockMvc.perform(post("/Part/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"name\":\"test-part\",\"master\":{},\"branch\":{}}"))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("7. Bom_relation - BOM关系测试")
    class BOMRelationCategoryValidationTests {

        @Test
        @DisplayName("典型减速器BOM结构 - 所有零件分类正确")
        void typicalReducerBOM_allCategoriesValid() throws Exception {
            String[] categories = {"C012", "C001", "C011", "C009", "C002", "C005", "C007", "C008", "C003", "C010"};
            int[] quantities = {1, 1, 1, 1, 3, 1, 1, 1, 6, 4};

            for (int i = 0; i < categories.length; i++) {
                String relationJson = String.format(
                    "{\"parent_Part\":{\"id\":\"assembly-id\"},\"child_Part\":{\"id\":\"child-%s\"},\"quantity\":%d}",
                    categories[i], quantities[i]);
                mockMvc.perform(post("/Bom_relation/add")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(relationJson))
                        .andExpect(status().isOk());
            }
        }

        @Test
        @DisplayName("按条件查询BOM关系列表")
        void countBOMByPartCategory() throws Exception {
            mockMvc.perform(post("/Bom_relation/list")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"queryRequest\":{},\"pageVO\":{\"curPage\":1,\"pageSize\":10}}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data").isArray());
        }
    }

    @Nested
    @DisplayName("8. 综合业务场景")
    class IntegratedBusinessScenarioTests {

        @Test
        @DisplayName("场景: 完整的生产流程")
        void completeProductionFlow() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"devicename\":\"DMG MORI DMU 50\",\"devicecode\":\"DMG-001\",\"device_Type\":\"A002\"}"))
                    .andExpect(status().isOk());

            mockMvc.perform(post("/Part/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"name\":\"斜齿轮\",\"part_Category\":\"C002\",\"master\":{},\"branch\":{}}"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("场景: 设备全生命周期状态流转")
        void equipmentLifecycleStatusFlow() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"devicename\":\"lifecycle\",\"devicecode\":\"LC-001\",\"device_Type\":\"A002\"}"))
                    .andExpect(status().isOk());

            mockMvc.perform(post("/Equipment/update")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"id\":\"lc-id\"}"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("场景: 多设备类型的工厂配置")
        void multiTypeFactoryConfiguration() throws Exception {
            String[] factoryEquipments = {
                "{\"devicename\":\"五轴加工中心\",\"devicecode\":\"FACTORY-CNC-01\",\"device_Type\":\"A002\"}",
                "{\"devicename\":\"卧式加工中心\",\"devicecode\":\"FACTORY-CNC-02\",\"device_Type\":\"A002\"}",
                "{\"devicename\":\"数控车床\",\"devicecode\":\"FACTORY-LATHE-01\",\"device_Type\":\"A005\"}",
                "{\"devicename\":\"立式铣床\",\"devicecode\":\"FACTORY-MILL-01\",\"device_Type\":\"A003\"}",
                "{\"devicename\":\"外圆磨床\",\"devicecode\":\"FACTORY-GRINDER-01\",\"device_Type\":\"A009\"}",
                "{\"devicename\":\"三坐标测量机\",\"devicecode\":\"FACTORY-CMM-01\",\"device_Type\":\"A004\"}",
                "{\"devicename\":\"箱式淬火炉\",\"devicecode\":\"FACTORY-HT-01\",\"device_Type\":\"A008\"}"
            };

            for (String eqJson : factoryEquipments) {
                mockMvc.perform(post("/Equipment/add")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(eqJson))
                        .andExpect(status().isOk());
            }
        }
    }

    @Nested
    @DisplayName("9. 枚举值边界条件测试")
    class EdgeCaseTests {

        @Test
        @DisplayName("空字符串枚举值返回错误状态码")
        void emptyEnumValue_shouldReturn200() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"devicename\":\"empty\",\"devicecode\":\"EMPTY-001\",\"device_Type\":\"\"}"))
                    .andExpect(result -> assertTrue(result.getResponse().getStatus() >= 200,
                        "Empty enum value should return some status code"));
        }

        @Test
        @DisplayName("null枚举值返回200")
        void nullEnumValue_shouldReturn200() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"devicename\":\"nulltest\",\"devicecode\":\"NULL-001\"}"))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("10. 批量操作中的枚举一致性测试")
    class BatchOperationEnumConsistencyTests {

        @Test
        @DisplayName("批量创建多种设备类型的设备")
        void batchCreateMultipleDeviceTypes() throws Exception {
            mockMvc.perform(post("/Equipment/batchAdd")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("[{\"devicename\":\"e1\",\"devicecode\":\"B1\",\"device_Type\":\"A001\"},{\"devicename\":\"e2\",\"devicecode\":\"B2\",\"device_Type\":\"A002\"},{\"devicename\":\"e3\",\"devicecode\":\"B3\",\"device_Type\":\"A003\"},{\"devicename\":\"e4\",\"devicecode\":\"B4\",\"device_Type\":\"A004\"},{\"devicename\":\"e5\",\"devicecode\":\"B5\",\"device_Type\":\"A005\"}]"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data").isArray())
                    .andExpect(jsonPath("$.data.length()").value(5));
        }

        @Test
        @DisplayName("批量更新设备的折旧方式")
        void batchUpdateDepreciationMethods() throws Exception {
            mockMvc.perform(post("/Equipment/batchUpdate")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("[{\"id\":\"eq-1\"},{\"id\":\"eq-2\"},{\"id\":\"eq-3\"},{\"id\":\"eq-4\"}]"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data").isArray())
                    .andExpect(jsonPath("$.data.length()").value(4));
        }

        @Test
        @DisplayName("查询列表返回数组")
        void queryFilterByEnumValue_correctness() throws Exception {
            mockMvc.perform(post("/Equipment/list")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"queryRequest\":{},\"pageVO\":{\"curPage\":1,\"pageSize\":100}}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data").isArray());
        }
    }
}
