package org.example.FutureService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.vo.DeleteByConditionVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.EquipmentDelegator;
import com.huawei.innovation.rdm.prims.dto.entity.*;
import org.example.FutureService.common.QueryRequestWrapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = EquipmentController.class)
@DisplayName("EquipmentController 单元测试")
class EquipmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EquipmentDelegator equipmentDelegator;

    private EquipmentViewDTO testEquipment;
    private EquipmentListViewDTO testEquipmentListItem;
    private final String TEST_ID = "test-equipment-id-12345";

    @BeforeEach
    void setUp() {
        testEquipment = new EquipmentViewDTO();
        testEquipment.setId(TEST_ID);
        testEquipment.setDevicename("测试设备");
        testEquipment.setDevicecode("TEST-EQ-001");

        testEquipmentListItem = new EquipmentListViewDTO();
        testEquipmentListItem.setId(TEST_ID);
        testEquipmentListItem.setDevicename("测试设备_列表视图");
        testEquipmentListItem.setDevicecode("TEST-EQ-LIST-001");
    }

    @Nested
    @DisplayName("创建设备接口测试")
    class CreateTests {

        @Test
        @DisplayName("创建设备 - 成功")
        void create_Success() throws Exception {
            when(equipmentDelegator.create(any(EquipmentCreateDTO.class))).thenReturn(testEquipment);

            EquipmentCreateDTO dto = new EquipmentCreateDTO();
            dto.setDevicename("新设备");
            dto.setDevicecode("NEW-EQ-001");

            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(equipmentDelegator, times(1)).create(any(EquipmentCreateDTO.class));
        }
    }

    @Nested
    @DisplayName("批量创建设备接口测试")
    class BatchCreateTests {

        @Test
        @DisplayName("批量创建设备 - 成功")
        void batchCreate_Success() throws Exception {
            List<EquipmentViewDTO> equipmentList = Arrays.asList(testEquipment, testEquipment);
            when(equipmentDelegator.batchCreate(any())).thenReturn(equipmentList);

            mockMvc.perform(post("/Equipment/batchAdd")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Arrays.asList(new EquipmentCreateDTO(), new EquipmentCreateDTO()))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.length()").value(2));

            verify(equipmentDelegator, times(1)).batchCreate(any());
        }
    }

    @Nested
    @DisplayName("读取设备接口测试")
    class ReadTests {

        @Test
        @DisplayName("根据ID获取设备 - 成功")
        void getById_Success() throws Exception {
            when(equipmentDelegator.get(any(PersistObjectIdDecryptDTO.class))).thenReturn(testEquipment);

            PersistObjectIdDecryptDTO dto = new PersistObjectIdDecryptDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Equipment/get")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(equipmentDelegator, times(1)).get(any(PersistObjectIdDecryptDTO.class));
        }

        @Test
        @DisplayName("根据ID获取设备 - 设备不存在")
        void getById_NotFound() throws Exception {
            when(equipmentDelegator.get(any(PersistObjectIdDecryptDTO.class))).thenReturn(null);

            PersistObjectIdDecryptDTO dto = new PersistObjectIdDecryptDTO();
            dto.setId("non-existent-id");

            mockMvc.perform(post("/Equipment/get")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").doesNotExist());
        }

        @Test
        @DisplayName("批量获取设备 - 成功")
        void batchGetByIds_Success() throws Exception {
            when(equipmentDelegator.batchGet(any())).thenReturn(Arrays.asList(testEquipment));

            mockMvc.perform(post("/Equipment/batchGet")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"ids\": [\"test-id-1\", \"test-id-2\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(equipmentDelegator, times(1)).batchGet(any());
        }
    }

    @Nested
    @DisplayName("查询设备接口测试")
    class QueryTests {

        @Test
        @DisplayName("获取设备列表 - 成功")
        void list_Success() throws Exception {
            when(equipmentDelegator.list(any(), any()))
                    .thenReturn(Arrays.asList(testEquipmentListItem));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/Equipment/list")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.length()").value(1));

            verify(equipmentDelegator, times(1)).list(any(), any());
        }

        @Test
        @DisplayName("获取设备列表 - 返回空列表")
        void list_Empty() throws Exception {
            when(equipmentDelegator.list(any(), any())).thenReturn(Collections.emptyList());

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/Equipment/list")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.length()").value(0));
        }

        @Test
        @DisplayName("统计设备数量 - 成功")
        void count_Success() throws Exception {
            when(equipmentDelegator.count(any(QueryRequestVo.class))).thenReturn(42L);

            mockMvc.perform(post("/Equipment/count")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new QueryRequestVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(42));

            verify(equipmentDelegator, times(1)).count(any(QueryRequestVo.class));
        }

        @Test
        @DisplayName("条件查询设备 - 成功")
        void query_Success() throws Exception {
            when(equipmentDelegator.query(any(), any()))
                    .thenReturn(Arrays.asList(new EquipmentQueryViewDTO()));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/Equipment/query")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(equipmentDelegator, times(1)).query(any(), any());
        }
    }

    @Nested
    @DisplayName("更新设备接口测试")
    class UpdateTests {

        @Test
        @DisplayName("更新设备 - 成功")
        void update_Success() throws Exception {
            EquipmentViewDTO updatedEquipment = new EquipmentViewDTO();
            updatedEquipment.setId(TEST_ID);
            updatedEquipment.setDevicename("更新后的设备名称");

            when(equipmentDelegator.update(any(EquipmentUpdateDTO.class))).thenReturn(updatedEquipment);

            EquipmentUpdateDTO dto = new EquipmentUpdateDTO();
            dto.setId(TEST_ID);
            dto.setDevicename("更新后的设备名称");

            mockMvc.perform(post("/Equipment/update")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.devicename").value("更新后的设备名称"));

            verify(equipmentDelegator, times(1)).update(any(EquipmentUpdateDTO.class));
        }

        @Test
        @DisplayName("批量更新设备 - 成功")
        void batchUpdate_Success() throws Exception {
            when(equipmentDelegator.batchUpdate(any())).thenReturn(Arrays.asList(testEquipment));

            mockMvc.perform(post("/Equipment/batchUpdate")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Arrays.asList(new EquipmentUpdateDTO(), new EquipmentUpdateDTO()))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(equipmentDelegator, times(1)).batchUpdate(any());
        }
    }

    @Nested
    @DisplayName("删除设备接口测试")
    class DeleteTests {

        @Test
        @DisplayName("删除设备 - 成功")
        void delete_Success() throws Exception {
            when(equipmentDelegator.delete(any(PersistObjectIdModifierDTO.class))).thenReturn(1);

            PersistObjectIdModifierDTO dto = new PersistObjectIdModifierDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Equipment/delete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(1));

            verify(equipmentDelegator, times(1)).delete(any(PersistObjectIdModifierDTO.class));
        }

        @Test
        @DisplayName("删除设备 - 设备不存在")
        void delete_NotFound() throws Exception {
            when(equipmentDelegator.delete(any(PersistObjectIdModifierDTO.class))).thenReturn(0);

            PersistObjectIdModifierDTO dto = new PersistObjectIdModifierDTO();
            dto.setId("non-existent-id");

            mockMvc.perform(post("/Equipment/delete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(0));
        }

        @Test
        @DisplayName("批量删除设备 - 成功")
        void batchDelete_Success() throws Exception {
            when(equipmentDelegator.batchDelete(any())).thenReturn(3);

            mockMvc.perform(post("/Equipment/batchDelete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"ids\": [\"test-id-1\", \"test-id-2\", \"test-id-3\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(3));

            verify(equipmentDelegator, times(1)).batchDelete(any());
        }

        @Test
        @DisplayName("逻辑删除设备 - 成功")
        void logicalDelete_Success() throws Exception {
            when(equipmentDelegator.logicalDelete(any(PersistObjectIdModifierDTO.class))).thenReturn(1);

            PersistObjectIdModifierDTO dto = new PersistObjectIdModifierDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Equipment/logicalDelete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(1));

            verify(equipmentDelegator, times(1)).logicalDelete(any(PersistObjectIdModifierDTO.class));
        }
    }

    @Nested
    @DisplayName("高级操作接口测试")
    class AdvancedOperationTests {

        @Test
        @DisplayName("保存设备 - 成功")
        void save_Success() throws Exception {
            when(equipmentDelegator.save(any())).thenReturn(2);

            mockMvc.perform(post("/Equipment/save")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Arrays.asList(new EquipmentSaveDTO(), new EquipmentSaveDTO()))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(2));

            verify(equipmentDelegator, times(1)).save(any());
        }

        @Test
        @DisplayName("另存为设备 - 成功")
        void saveAs_Success() throws Exception {
            when(equipmentDelegator.saveAs(any(EquipmentSaveAsDTO.class))).thenReturn(testEquipment);

            EquipmentSaveAsDTO dto = new EquipmentSaveAsDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Equipment/saveAs")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(equipmentDelegator, times(1)).saveAs(any(EquipmentSaveAsDTO.class));
        }

        @Test
        @DisplayName("按条件删除设备 - 成功")
        void deleteByCondition_Success() throws Exception {
            when(equipmentDelegator.deleteByCondition(any())).thenReturn(5);

            mockMvc.perform(post("/Equipment/deleteByCondition")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new DeleteByConditionVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(5));

            verify(equipmentDelegator, times(1)).deleteByCondition(any());
        }
    }

    @Nested
    @DisplayName("参数校验测试")
    class ValidationTests {

        @Test
        @DisplayName("请求体为空 - 返回400错误")
        void emptyBody_BadRequest() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(""))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Content-Type不正确 - 被全局异常处理器捕获返回500")
        void wrongContentType_UnsupportedMediaType() throws Exception {
            mockMvc.perform(post("/Equipment/add")
                            .contentType(MediaType.TEXT_PLAIN)
                            .content("plain text"))
                    .andExpect(status().is5xxServerError());
        }
    }
}
