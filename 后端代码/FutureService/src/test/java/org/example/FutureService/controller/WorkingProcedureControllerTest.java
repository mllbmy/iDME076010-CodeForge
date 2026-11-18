package org.example.FutureService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.vo.DeleteByConditionVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.WorkingProcedureDelegator;
import com.huawei.innovation.rdm.prims.dto.entity.*;
import org.example.FutureService.common.QueryRequestWrapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
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

@WebMvcTest(value = WorkingProcedureController.class)
@DisplayName("WorkingProcedureController 单元测试")
class WorkingProcedureControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private WorkingProcedureDelegator workingProcedureDelegator;

    private WorkingProcedureViewDTO testProcedure;
    private WorkingProcedureListViewDTO testProcedureListItem;
    private final String TEST_ID = "test-procedure-id-12345";

    @BeforeEach
    void setUp() {
        testProcedure = new WorkingProcedureViewDTO();
        testProcedure.setId(TEST_ID);
        testProcedure.setProcedure_Name("测试工序");
        testProcedure.setProcedure_Code("PROC-001");

        testProcedureListItem = new WorkingProcedureListViewDTO();
        testProcedureListItem.setId(TEST_ID);
        testProcedureListItem.setProcedure_Name("测试工序_列表视图");
    }

    @Nested
    @DisplayName("创建工序接口测试")
    class CreateTests {

        @Test
        @DisplayName("创建工序 - 成功")
        void create_Success() throws Exception {
            when(workingProcedureDelegator.create(any(WorkingProcedureCreateDTO.class))).thenReturn(testProcedure);

            WorkingProcedureCreateDTO dto = new WorkingProcedureCreateDTO();
            dto.setProcedure_Name("新工序");
            dto.setProcedure_Code("PROC-NEW-001");

            mockMvc.perform(post("/WorkingProcedure/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(workingProcedureDelegator, times(1)).create(any(WorkingProcedureCreateDTO.class));
        }
    }

    @Nested
    @DisplayName("读取工序接口测试")
    class ReadTests {

        @Test
        @DisplayName("根据ID获取工序 - 成功")
        void getById_Success() throws Exception {
            when(workingProcedureDelegator.get(any(PersistObjectIdDecryptDTO.class))).thenReturn(testProcedure);

            PersistObjectIdDecryptDTO dto = new PersistObjectIdDecryptDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/WorkingProcedure/get")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(workingProcedureDelegator, times(1)).get(any(PersistObjectIdDecryptDTO.class));
        }

        @Test
        @DisplayName("批量获取工序 - 成功")
        void batchGetByIds_Success() throws Exception {
            when(workingProcedureDelegator.batchGet(any())).thenReturn(Arrays.asList(testProcedure));

            mockMvc.perform(post("/WorkingProcedure/batchGet")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"ids\": [\"test-id-1\", \"test-id-2\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(workingProcedureDelegator, times(1)).batchGet(any());
        }
    }

    @Nested
    @DisplayName("查询工序接口测试")
    class QueryTests {

        @Test
        @DisplayName("获取工序列表 - 成功")
        void list_Success() throws Exception {
            when(workingProcedureDelegator.list(any(), any()))
                    .thenReturn(Arrays.asList(testProcedureListItem));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/WorkingProcedure/list")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.length()").value(1));

            verify(workingProcedureDelegator, times(1)).list(any(), any());
        }

        @Test
        @DisplayName("统计工序数量 - 成功")
        void count_Success() throws Exception {
            when(workingProcedureDelegator.count(any(QueryRequestVo.class))).thenReturn(42L);

            mockMvc.perform(post("/WorkingProcedure/count")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new QueryRequestVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(42));

            verify(workingProcedureDelegator, times(1)).count(any(QueryRequestVo.class));
        }

        @Test
        @DisplayName("条件查询工序 - 成功")
        void query_Success() throws Exception {
            when(workingProcedureDelegator.query(any(), any()))
                    .thenReturn(Arrays.asList(new WorkingProcedureQueryViewDTO()));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/WorkingProcedure/query")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(workingProcedureDelegator, times(1)).query(any(), any());
        }

        @Test
        @DisplayName("工序统计分页 - 成功")
        void staticsPage_Success() throws Exception {
            when(workingProcedureDelegator.staticsPage(any(), any())).thenReturn(Collections.emptyList());

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/WorkingProcedure/staticsPage")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(workingProcedureDelegator, times(1)).staticsPage(any(), any());
        }
    }

    @Nested
    @DisplayName("更新工序接口测试")
    class UpdateTests {

        @Test
        @DisplayName("更新工序 - 成功")
        void update_Success() throws Exception {
            WorkingProcedureViewDTO updatedProcedure = new WorkingProcedureViewDTO();
            updatedProcedure.setId(TEST_ID);
            updatedProcedure.setProcedure_Name("更新后的工序名称");

            when(workingProcedureDelegator.update(any(WorkingProcedureUpdateDTO.class))).thenReturn(updatedProcedure);

            WorkingProcedureUpdateDTO dto = new WorkingProcedureUpdateDTO();
            dto.setId(TEST_ID);
            dto.setProcedure_Name("更新后的工序名称");

            mockMvc.perform(post("/WorkingProcedure/update")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.procedure_Name").value("更新后的工序名称"));

            verify(workingProcedureDelegator, times(1)).update(any(WorkingProcedureUpdateDTO.class));
        }
    }

    @Nested
    @DisplayName("删除工序接口测试")
    class DeleteTests {

        @Test
        @DisplayName("删除工序 - 成功")
        void delete_Success() throws Exception {
            when(workingProcedureDelegator.delete(any(PersistObjectIdModifierDTO.class))).thenReturn(1);

            PersistObjectIdModifierDTO dto = new PersistObjectIdModifierDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/WorkingProcedure/delete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(1));

            verify(workingProcedureDelegator, times(1)).delete(any(PersistObjectIdModifierDTO.class));
        }

        @Test
        @DisplayName("批量删除工序 - 成功")
        void batchDelete_Success() throws Exception {
            when(workingProcedureDelegator.batchDelete(any())).thenReturn(3);

            mockMvc.perform(post("/WorkingProcedure/batchDelete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"ids\": [\"test-id-1\", \"test-id-2\", \"test-id-3\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(3));

            verify(workingProcedureDelegator, times(1)).batchDelete(any());
        }

        @Test
        @DisplayName("按条件删除工序 - 成功")
        void deleteByCondition_Success() throws Exception {
            when(workingProcedureDelegator.deleteByCondition(any())).thenReturn(5);

            mockMvc.perform(post("/WorkingProcedure/deleteByCondition")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new DeleteByConditionVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(5));

            verify(workingProcedureDelegator, times(1)).deleteByCondition(any());
        }
    }

    @Nested
    @DisplayName("高级操作接口测试")
    class AdvancedOperationTests {

        @Test
        @DisplayName("保存工序 - 成功")
        void save_Success() throws Exception {
            when(workingProcedureDelegator.save(any())).thenReturn(2);

            mockMvc.perform(post("/WorkingProcedure/save")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Arrays.asList(new WorkingProcedureSaveDTO(), new WorkingProcedureSaveDTO()))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(2));

            verify(workingProcedureDelegator, times(1)).save(any());
        }

        @Test
        @DisplayName("另存为工序 - 成功")
        void saveAs_Success() throws Exception {
            when(workingProcedureDelegator.saveAs(any(WorkingProcedureSaveAsDTO.class))).thenReturn(testProcedure);

            WorkingProcedureSaveAsDTO dto = new WorkingProcedureSaveAsDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/WorkingProcedure/saveAs")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(workingProcedureDelegator, times(1)).saveAs(any(WorkingProcedureSaveAsDTO.class));
        }
    }

    @Nested
    @DisplayName("参数校验测试")
    class ValidationTests {

        @Test
        @DisplayName("请求体为空 - 返回400错误")
        void emptyBody_BadRequest() throws Exception {
            mockMvc.perform(post("/WorkingProcedure/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(""))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Content-Type不正确 - 返回错误状态码")
        void wrongContentType_UnsupportedMediaType() throws Exception {
            mockMvc.perform(post("/WorkingProcedure/add")
                            .contentType(MediaType.TEXT_PLAIN)
                            .content("plain text"))
                    .andExpect(result -> assertTrue(result.getResponse().getStatus() >= 400,
                        "Wrong content type should return error status"));
        }
    }
}
