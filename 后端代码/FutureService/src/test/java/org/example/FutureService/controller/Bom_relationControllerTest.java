package org.example.FutureService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.vo.DeleteByConditionVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.Bom_relationDelegator;
import com.huawei.innovation.rdm.prims.dto.entity.*;
import com.huawei.innovation.rdm.prims.dto.relation.*;
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

@WebMvcTest(value = Bom_relationController.class)
@DisplayName("Bom_relationController 单元测试")
class Bom_relationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private Bom_relationDelegator bomRelationDelegator;

    private Bom_relationViewDTO testBomRelation;
    private Bom_relationListViewDTO testBomRelationListItem;
    private final String TEST_ID = "test-bom-id-12345";

    @BeforeEach
    void setUp() {
        testBomRelation = new Bom_relationViewDTO();
        testBomRelation.setId(TEST_ID);

        testBomRelationListItem = new Bom_relationListViewDTO();
        testBomRelationListItem.setId(TEST_ID);
    }

    @Nested
    @DisplayName("创建BOM关系接口测试")
    class CreateTests {

        @Test
        @DisplayName("创建BOM关系 - 成功")
        void create_Success() throws Exception {
            when(bomRelationDelegator.create(any(Bom_relationCreateDTO.class))).thenReturn(testBomRelation);

            Bom_relationCreateDTO dto = new Bom_relationCreateDTO();
            dto.setQuantity(2);

            mockMvc.perform(post("/Bom_relation/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(bomRelationDelegator, times(1)).create(any(Bom_relationCreateDTO.class));
        }

    }

    @Nested
    @DisplayName("读取BOM关系接口测试")
    class ReadTests {

        @Test
        @DisplayName("根据ID获取BOM关系 - 成功")
        void getById_Success() throws Exception {
            when(bomRelationDelegator.get(any(PersistObjectIdDecryptDTO.class))).thenReturn(testBomRelation);

            PersistObjectIdDecryptDTO dto = new PersistObjectIdDecryptDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Bom_relation/get")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(bomRelationDelegator, times(1)).get(any(PersistObjectIdDecryptDTO.class));
        }

        @Test
        @DisplayName("批量获取BOM关系 - 成功")
        void batchGetByIds_Success() throws Exception {
            when(bomRelationDelegator.batchGet(any())).thenReturn(Arrays.asList(testBomRelation));

            mockMvc.perform(post("/Bom_relation/batchGet")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"ids\": [\"test-id-1\", \"test-id-2\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(bomRelationDelegator, times(1)).batchGet(any());
        }
    }

    @Nested
    @DisplayName("查询BOM关系接口测试")
    class QueryTests {

        @Test
        @DisplayName("获取BOM关系列表 - 成功")
        void list_Success() throws Exception {
            when(bomRelationDelegator.list(any(), any()))
                    .thenReturn(Arrays.asList(testBomRelationListItem));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/Bom_relation/list")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.length()").value(1));

            verify(bomRelationDelegator, times(1)).list(any(), any());
        }

        @Test
        @DisplayName("统计BOM关系数量 - 成功")
        void count_Success() throws Exception {
            when(bomRelationDelegator.count(any(QueryRequestVo.class))).thenReturn(42L);

            mockMvc.perform(post("/Bom_relation/count")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new QueryRequestVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(42));

            verify(bomRelationDelegator, times(1)).count(any(QueryRequestVo.class));
        }

        @Test
        @DisplayName("条件查询BOM关系 - 成功")
        void query_Success() throws Exception {
            when(bomRelationDelegator.query(any(), any()))
                    .thenReturn(Arrays.asList(new Bom_relationQueryViewDTO()));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/Bom_relation/query")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(bomRelationDelegator, times(1)).query(any(), any());
        }
    }

    @Nested
    @DisplayName("更新BOM关系接口测试")
    class UpdateTests {

        @Test
        @DisplayName("更新BOM关系 - 成功")
        void update_Success() throws Exception {
            when(bomRelationDelegator.update(any(Bom_relationUpdateDTO.class))).thenReturn(testBomRelation);

            Bom_relationUpdateDTO dto = new Bom_relationUpdateDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Bom_relation/update")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(bomRelationDelegator, times(1)).update(any(Bom_relationUpdateDTO.class));
        }
    }

    @Nested
    @DisplayName("删除BOM关系接口测试")
    class DeleteTests {

        @Test
        @DisplayName("删除BOM关系 - 成功")
        void delete_Success() throws Exception {
            when(bomRelationDelegator.delete(any(PersistObjectIdModifierDTO.class))).thenReturn(1);

            PersistObjectIdModifierDTO dto = new PersistObjectIdModifierDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Bom_relation/delete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(1));

            verify(bomRelationDelegator, times(1)).delete(any(PersistObjectIdModifierDTO.class));
        }

        @Test
        @DisplayName("批量删除BOM关系 - 成功")
        void batchDelete_Success() throws Exception {
            when(bomRelationDelegator.batchDelete(any())).thenReturn(3);

            mockMvc.perform(post("/Bom_relation/batchDelete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"ids\": [\"test-id-1\", \"test-id-2\", \"test-id-3\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(3));

            verify(bomRelationDelegator, times(1)).batchDelete(any());
        }

        @Test
        @DisplayName("按条件删除BOM关系 - 成功")
        void deleteByCondition_Success() throws Exception {
            when(bomRelationDelegator.deleteByCondition(any())).thenReturn(5);

            mockMvc.perform(post("/Bom_relation/deleteByCondition")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new DeleteByConditionVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(5));

            verify(bomRelationDelegator, times(1)).deleteByCondition(any());
        }
    }

    @Nested
    @DisplayName("高级操作接口测试")
    class AdvancedOperationTests {

        @Test
        @DisplayName("保存BOM关系 - 成功")
        void save_Success() throws Exception {
            when(bomRelationDelegator.save(any())).thenReturn(2);

            mockMvc.perform(post("/Bom_relation/save")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Arrays.asList(new Bom_relationSaveDTO(), new Bom_relationSaveDTO()))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(2));

            verify(bomRelationDelegator, times(1)).save(any());
        }

        @Test
        @DisplayName("另存为BOM关系 - 成功")
        void saveAs_Success() throws Exception {
            when(bomRelationDelegator.saveAs(any(Bom_relationSaveAsDTO.class))).thenReturn(testBomRelation);

            Bom_relationSaveAsDTO dto = new Bom_relationSaveAsDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Bom_relation/saveAs")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(bomRelationDelegator, times(1)).saveAs(any(Bom_relationSaveAsDTO.class));
        }
    }
}
