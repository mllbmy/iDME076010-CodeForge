package org.example.FutureService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.vo.DeleteByConditionVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.WorkingPlanDelegator;
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

@WebMvcTest(value = WorkingPlanController.class)
@DisplayName("WorkingPlanController 单元测试")
class WorkingPlanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private WorkingPlanDelegator workingPlanDelegator;

    private WorkingPlanViewDTO testPlan;
    private WorkingPlanListViewDTO testPlanListItem;
    private final String TEST_ID = "test-plan-id-12345";

    @BeforeEach
    void setUp() {
        testPlan = new WorkingPlanViewDTO();
        testPlan.setId(TEST_ID);
        testPlan.setPlan_Name("测试计划");
        testPlan.setPlan_Code("PLAN-001");

        testPlanListItem = new WorkingPlanListViewDTO();
        testPlanListItem.setId(TEST_ID);
        testPlanListItem.setPlan_Name("测试计划_列表视图");
    }

    @Nested
    @DisplayName("创建计划接口测试")
    class CreateTests {

        @Test
        @DisplayName("创建计划 - 成功")
        void create_Success() throws Exception {
            when(workingPlanDelegator.create(any(WorkingPlanCreateDTO.class))).thenReturn(testPlan);

            WorkingPlanCreateDTO dto = new WorkingPlanCreateDTO();
            dto.setPlan_Name("新计划");
            dto.setPlan_Code("PLAN-NEW-001");

            mockMvc.perform(post("/WorkingPlan/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(workingPlanDelegator, times(1)).create(any(WorkingPlanCreateDTO.class));
        }
    }

    @Nested
    @DisplayName("读取计划接口测试")
    class ReadTests {

        @Test
        @DisplayName("根据ID获取计划 - 成功")
        void getById_Success() throws Exception {
            when(workingPlanDelegator.get(any(PersistObjectIdDecryptDTO.class))).thenReturn(testPlan);

            PersistObjectIdDecryptDTO dto = new PersistObjectIdDecryptDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/WorkingPlan/get")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(workingPlanDelegator, times(1)).get(any(PersistObjectIdDecryptDTO.class));
        }

        @Test
        @DisplayName("批量获取计划 - 成功")
        void batchGetByIds_Success() throws Exception {
            when(workingPlanDelegator.batchGet(any())).thenReturn(Arrays.asList(testPlan));

            mockMvc.perform(post("/WorkingPlan/batchGet")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"ids\": [\"test-id-1\", \"test-id-2\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(workingPlanDelegator, times(1)).batchGet(any());
        }
    }

    @Nested
    @DisplayName("查询计划接口测试")
    class QueryTests {

        @Test
        @DisplayName("获取计划列表 - 成功")
        void list_Success() throws Exception {
            when(workingPlanDelegator.list(any(), any()))
                    .thenReturn(Arrays.asList(testPlanListItem));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/WorkingPlan/list")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.length()").value(1));

            verify(workingPlanDelegator, times(1)).list(any(), any());
        }

        @Test
        @DisplayName("统计计划数量 - 成功")
        void count_Success() throws Exception {
            when(workingPlanDelegator.count(any(QueryRequestVo.class))).thenReturn(42L);

            mockMvc.perform(post("/WorkingPlan/count")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new QueryRequestVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(42));

            verify(workingPlanDelegator, times(1)).count(any(QueryRequestVo.class));
        }

        @Test
        @DisplayName("条件查询计划 - 成功")
        void query_Success() throws Exception {
            when(workingPlanDelegator.query(any(), any()))
                    .thenReturn(Arrays.asList(new WorkingPlanQueryViewDTO()));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/WorkingPlan/query")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(workingPlanDelegator, times(1)).query(any(), any());
        }

        @Test
        @DisplayName("计划统计分页 - 成功")
        void staticsPage_Success() throws Exception {
            when(workingPlanDelegator.staticsPage(any(), any())).thenReturn(Collections.emptyList());

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/WorkingPlan/staticsPage")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(workingPlanDelegator, times(1)).staticsPage(any(), any());
        }
    }

    @Nested
    @DisplayName("更新计划接口测试")
    class UpdateTests {

        @Test
        @DisplayName("更新计划 - 成功")
        void update_Success() throws Exception {
            WorkingPlanViewDTO updatedPlan = new WorkingPlanViewDTO();
            updatedPlan.setId(TEST_ID);
            updatedPlan.setPlan_Name("更新后的计划名称");

            when(workingPlanDelegator.update(any(WorkingPlanUpdateDTO.class))).thenReturn(updatedPlan);

            WorkingPlanUpdateDTO dto = new WorkingPlanUpdateDTO();
            dto.setId(TEST_ID);
            dto.setPlan_Name("更新后的计划名称");

            mockMvc.perform(post("/WorkingPlan/update")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.plan_Name").value("更新后的计划名称"));

            verify(workingPlanDelegator, times(1)).update(any(WorkingPlanUpdateDTO.class));
        }
    }

    @Nested
    @DisplayName("删除计划接口测试")
    class DeleteTests {

        @Test
        @DisplayName("删除计划 - 成功")
        void delete_Success() throws Exception {
            when(workingPlanDelegator.delete(any(PersistObjectIdModifierDTO.class))).thenReturn(1);

            PersistObjectIdModifierDTO dto = new PersistObjectIdModifierDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/WorkingPlan/delete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(1));

            verify(workingPlanDelegator, times(1)).delete(any(PersistObjectIdModifierDTO.class));
        }

        @Test
        @DisplayName("批量删除计划 - 成功")
        void batchDelete_Success() throws Exception {
            when(workingPlanDelegator.batchDelete(any())).thenReturn(3);

            mockMvc.perform(post("/WorkingPlan/batchDelete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"ids\": [\"test-id-1\", \"test-id-2\", \"test-id-3\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(3));

            verify(workingPlanDelegator, times(1)).batchDelete(any());
        }

        @Test
        @DisplayName("按条件删除计划 - 成功")
        void deleteByCondition_Success() throws Exception {
            when(workingPlanDelegator.deleteByCondition(any())).thenReturn(5);

            mockMvc.perform(post("/WorkingPlan/deleteByCondition")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new DeleteByConditionVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(5));

            verify(workingPlanDelegator, times(1)).deleteByCondition(any());
        }
    }

    @Nested
    @DisplayName("高级操作接口测试")
    class AdvancedOperationTests {

        @Test
        @DisplayName("保存计划 - 成功")
        void save_Success() throws Exception {
            when(workingPlanDelegator.save(any())).thenReturn(2);

            mockMvc.perform(post("/WorkingPlan/save")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Arrays.asList(new WorkingPlanSaveDTO(), new WorkingPlanSaveDTO()))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(2));

            verify(workingPlanDelegator, times(1)).save(any());
        }

        @Test
        @DisplayName("另存为计划 - 成功")
        void saveAs_Success() throws Exception {
            when(workingPlanDelegator.saveAs(any(WorkingPlanSaveAsDTO.class))).thenReturn(testPlan);

            WorkingPlanSaveAsDTO dto = new WorkingPlanSaveAsDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/WorkingPlan/saveAs")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(workingPlanDelegator, times(1)).saveAs(any(WorkingPlanSaveAsDTO.class));
        }
    }
}
