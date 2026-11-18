package org.example.FutureService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.huawei.innovation.rdm.coresdk.basic.dto.MasterIdModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.MasterIdsModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.vo.DeleteByConditionVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.PartDelegator;
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

@WebMvcTest(value = PartController.class)
@DisplayName("PartController 单元测试")
class PartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PartDelegator partDelegator;

    private PartViewDTO testPart;
    private PartListViewDTO testPartListItem;
    private final String TEST_ID = "test-part-id-12345";

    @BeforeEach
    void setUp() {
        testPart = new PartViewDTO();
        testPart.setId(TEST_ID);
        testPart.setName("测试零件");

        testPartListItem = new PartListViewDTO();
        testPartListItem.setId(TEST_ID);
        testPartListItem.setName("测试零件_列表视图");
    }

    @Nested
    @DisplayName("创建零件接口测试")
    class CreateTests {

        @Test
        @DisplayName("创建零件 - 成功")
        void create_Success() throws Exception {
            when(partDelegator.create(any(PartCreateDTO.class))).thenReturn(testPart);

            PartCreateDTO dto = new PartCreateDTO();
            dto.setName("新零件");

            mockMvc.perform(post("/Part/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(partDelegator, times(1)).create(any(PartCreateDTO.class));
        }
    }

    @Nested
    @DisplayName("批量创建零件接口测试")
    class BatchCreateTests {

        @Test
        @DisplayName("批量创建零件 - 成功")
        void batchCreate_Success() throws Exception {
            List<PartViewDTO> partList = Arrays.asList(testPart, testPart);
            when(partDelegator.batchCreate(any())).thenReturn(partList);

            mockMvc.perform(post("/Part/batchAdd")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Arrays.asList(new PartCreateDTO(), new PartCreateDTO()))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.length()").value(2));

            verify(partDelegator, times(1)).batchCreate(any());
        }
    }

    @Nested
    @DisplayName("读取零件接口测试")
    class ReadTests {

        @Test
        @DisplayName("根据ID获取零件 - 成功")
        void getById_Success() throws Exception {
            when(partDelegator.get(any(PersistObjectIdDecryptDTO.class))).thenReturn(testPart);

            PersistObjectIdDecryptDTO dto = new PersistObjectIdDecryptDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Part/get")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(partDelegator, times(1)).get(any(PersistObjectIdDecryptDTO.class));
        }

        @Test
        @DisplayName("批量获取零件 - 成功")
        void batchGetByIds_Success() throws Exception {
            when(partDelegator.batchGet(any())).thenReturn(Arrays.asList(testPart));

            mockMvc.perform(post("/Part/batchGet")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"ids\": [\"test-id-1\", \"test-id-2\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(partDelegator, times(1)).batchGet(any());
        }
    }

    @Nested
    @DisplayName("查询零件接口测试")
    class QueryTests {

        @Test
        @DisplayName("获取零件列表 - 成功")
        void list_Success() throws Exception {
            when(partDelegator.list(any(), any()))
                    .thenReturn(Arrays.asList(testPartListItem));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/Part/list")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.length()").value(1));

            verify(partDelegator, times(1)).list(any(), any());
        }

        @Test
        @DisplayName("统计零件数量 - 成功")
        void count_Success() throws Exception {
            when(partDelegator.count(any(QueryRequestVo.class))).thenReturn(42L);

            mockMvc.perform(post("/Part/count")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new QueryRequestVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(42));

            verify(partDelegator, times(1)).count(any(QueryRequestVo.class));
        }

        @Test
        @DisplayName("条件查询零件 - 成功")
        void query_Success() throws Exception {
            when(partDelegator.query(any(), any()))
                    .thenReturn(Arrays.asList(new PartQueryViewDTO()));

            QueryRequestWrapper wrapper = new QueryRequestWrapper();

            mockMvc.perform(post("/Part/query")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(wrapper)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));

            verify(partDelegator, times(1)).query(any(), any());
        }
    }

    @Nested
    @DisplayName("更新零件接口测试")
    class UpdateTests {

        @Test
        @DisplayName("更新零件 - 成功")
        void update_Success() throws Exception {
            PartViewDTO updatedPart = new PartViewDTO();
            updatedPart.setId(TEST_ID);
            updatedPart.setName("更新后的零件名称");

            when(partDelegator.update(any(PartUpdateDTO.class))).thenReturn(updatedPart);

            PartUpdateDTO dto = new PartUpdateDTO();
            dto.setId(TEST_ID);
            dto.setName("更新后的零件名称");

            mockMvc.perform(post("/Part/update")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.name").value("更新后的零件名称"));

            verify(partDelegator, times(1)).update(any(PartUpdateDTO.class));
        }
    }

    @Nested
    @DisplayName("删除零件接口测试")
    class DeleteTests {

        @Test
        @DisplayName("删除零件 - 成功")
        void delete_Success() throws Exception {
            when(partDelegator.delete(any(MasterIdModifierDTO.class))).thenReturn(1);

            MasterIdModifierDTO dto = new MasterIdModifierDTO();
            dto.setMasterId(TEST_ID);

            mockMvc.perform(post("/Part/delete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(1));

            verify(partDelegator, times(1)).delete(any(MasterIdModifierDTO.class));
        }

        @Test
        @DisplayName("批量删除零件 - 成功")
        void batchDelete_Success() throws Exception {
            when(partDelegator.batchDelete(any())).thenReturn(3);

            mockMvc.perform(post("/Part/batchDelete")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"masterIds\": [\"test-id-1\", \"test-id-2\", \"test-id-3\"]}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(3));

            verify(partDelegator, times(1)).batchDelete(any());
        }

        @Test
        @DisplayName("按条件删除零件 - 成功")
        void deleteByCondition_Success() throws Exception {
            when(partDelegator.deleteByCondition(any())).thenReturn(5);

            mockMvc.perform(post("/Part/deleteByCondition")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new DeleteByConditionVo())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(5));

            verify(partDelegator, times(1)).deleteByCondition(any());
        }
    }

    @Nested
    @DisplayName("高级操作接口测试")
    class AdvancedOperationTests {

        @Test
        @DisplayName("保存零件 - 成功")
        void save_Success() throws Exception {
            when(partDelegator.save(any())).thenReturn(2);

            mockMvc.perform(post("/Part/save")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Arrays.asList(new PartSaveDTO(), new PartSaveDTO()))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data").value(2));

            verify(partDelegator, times(1)).save(any());
        }

        @Test
        @DisplayName("另存为零件 - 成功")
        void saveAs_Success() throws Exception {
            when(partDelegator.saveAs(any(PartSaveAsDTO.class))).thenReturn(testPart);

            PartSaveAsDTO dto = new PartSaveAsDTO();
            dto.setId(TEST_ID);

            mockMvc.perform(post("/Part/saveAs")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(TEST_ID));

            verify(partDelegator, times(1)).saveAs(any(PartSaveAsDTO.class));
        }
    }

    @Nested
    @DisplayName("参数校验测试")
    class ValidationTests {

        @Test
        @DisplayName("请求体为空 - 返回400错误")
        void emptyBody_BadRequest() throws Exception {
            mockMvc.perform(post("/Part/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(""))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Content-Type不正确 - 被全局异常处理器捕获返回500")
        void wrongContentType_UnsupportedMediaType() throws Exception {
            mockMvc.perform(post("/Part/add")
                            .contentType(MediaType.TEXT_PLAIN)
                            .content("plain text"))
                    .andExpect(status().is5xxServerError());
        }
    }
}
