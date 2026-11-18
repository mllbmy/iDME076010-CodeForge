package org.example.FutureService.controller;

import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdsDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdsModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.vo.DeleteByConditionVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.EquipmentDelegator;
import com.huawei.innovation.rdm.prims.dto.entity.*;
import org.example.FutureService.common.DeleteByConditionWrapper;
import org.example.FutureService.common.QueryRequestWrapper;
import org.example.FutureService.common.Result;
import org.example.FutureService.common.StaticsRequestWrapper;
import org.example.FutureService.common.UpdateByConditionWrapper;
import org.example.FutureService.exception.BusinessException;
import org.example.FutureService.exception.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Equipment")
public class EquipmentController {

    private static final Logger log = LoggerFactory.getLogger(EquipmentController.class);

    private final EquipmentDelegator equipmentDelegator;

    public EquipmentController(EquipmentDelegator equipmentDelegator) {
        this.equipmentDelegator = equipmentDelegator;
    }

    @PostMapping("/add")
    public Result<EquipmentViewDTO> create(@RequestBody EquipmentCreateDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();

        try {
            log.info("[{}] 开始创建设备, 请求参数: {}", operationId, dto);

            validateCreateRequest(dto);

            EquipmentViewDTO result = equipmentDelegator.create(dto);

            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 创建设备成功, 设备ID: {}, 耗时: {}ms", operationId, result.getId(), duration);

            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 创建设备失败, 耗时: {}ms, 请求参数: {}, 异常类型: {}, 异常消息: {}",
                     operationId, duration, dto, e.getClass().getSimpleName(), e.getMessage(), e);

            throw new BusinessException(
                ErrorCode.IDME_SDK_ERROR.getCode(),
                "设备创建失败",
                buildDetailedErrorInfo(e, "create", dto)
            );
        }
    }

    @PostMapping("/batchAdd")
    public Result<List<EquipmentViewDTO>> batchCreate(@RequestBody List<EquipmentCreateDTO> dtoList) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();

        try {
            log.info("[{}] 开始批量创建设备, 数量: {}", operationId, dtoList.size());

            if (dtoList == null || dtoList.isEmpty()) {
                throw new BusinessException(ErrorCode.BAD_REQUEST.getCode(), "设备列表不能为空");
            }

            List<EquipmentViewDTO> result = equipmentDelegator.batchCreate(dtoList);

            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 批量创建设备成功, 成功数量: {}, 耗时: {}ms", operationId, result.size(), duration);

            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 批量创建设备失败, 耗时: {}ms, 异常类型: {}, 异常消息: {}",
                     operationId, duration, e.getClass().getSimpleName(), e.getMessage(), e);

            throw new BusinessException(
                ErrorCode.IDME_SDK_ERROR.getCode(),
                "批量创建设备失败",
                buildDetailedErrorInfo(e, "batchCreate", dtoList)
            );
        }
    }

    @PostMapping("/get")
    public Result<EquipmentViewDTO> getById(@RequestBody PersistObjectIdDecryptDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();

        try {
            log.info("[{}] 获取设备详情, 请求参数: {}", operationId, dto);

            EquipmentViewDTO result = equipmentDelegator.get(dto);

            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 获取设备详情成功, 耗时: {}ms", operationId, duration);

            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 获取设备详情失败, 耗时: {}ms, 异常类型: {}, 异常消息: {}",
                     operationId, duration, e.getClass().getSimpleName(), e.getMessage(), e);

            throw new BusinessException(
                ErrorCode.IDME_SDK_ERROR.getCode(),
                "获取设备详情失败",
                buildDetailedErrorInfo(e, "getById", dto)
            );
        }
    }

    @PostMapping("/batchGet")
    public Result<List<EquipmentViewDTO>> batchGetByIds(@RequestBody PersistObjectIdsDecryptDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();

        try {
            log.info("[{}] 批量获取设备详情, 请求参数: {}", operationId, dto);

            List<EquipmentViewDTO> result = equipmentDelegator.batchGet(dto);

            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 批量获取设备详情成功, 数量: {}, 耗时: {}ms", operationId, result.size(), duration);

            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 批量获取设备详情失败, 耗时: {}ms, 异常类型: {}, 异常消息: {}",
                     operationId, duration, e.getClass().getSimpleName(), e.getMessage(), e);

            throw new BusinessException(
                ErrorCode.IDME_SDK_ERROR.getCode(),
                "批量获取设备详情失败",
                buildDetailedErrorInfo(e, "batchGetByIds", dto)
            );
        }
    }

    @PostMapping("/query")
    public Result<List<EquipmentQueryViewDTO>> query(@RequestBody QueryRequestWrapper wrapper) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();

        try {
            log.info("[{}] 查询设备列表", operationId);

            List<EquipmentQueryViewDTO> result = equipmentDelegator.query(wrapper.getQueryRequest(), wrapper.getPageVO());

            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 查询设备列表成功, 结果数量: {}, 耗时: {}ms", operationId, result.size(), duration);

            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 查询设备列表失败, 耗时: {}ms, 异常类型: {}, 异常消息: {}",
                     operationId, duration, e.getClass().getSimpleName(), e.getMessage(), e);

            throw new BusinessException(
                ErrorCode.IDME_SDK_ERROR.getCode(),
                "查询设备列表失败",
                buildDetailedErrorInfo(e, "query", wrapper)
            );
        }
    }

    @PostMapping("/list")
    public Result<List<EquipmentListViewDTO>> list(@RequestBody QueryRequestWrapper wrapper) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();

        try {
            log.info("[{}] 查询设备简要列表", operationId);

            List<EquipmentListViewDTO> result = equipmentDelegator.list(wrapper.getQueryRequest(), wrapper.getPageVO());

            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 查询设备简要列表成功, 结果数量: {}, 耗时: {}ms", operationId, result.size(), duration);

            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 查询设备简要列表失败, 耗时: {}ms, 异常类型: {}, 异常消息: {}",
                     operationId, duration, e.getClass().getSimpleName(), e.getMessage(), e);

            throw new BusinessException(
                ErrorCode.IDME_SDK_ERROR.getCode(),
                "查询设备简要列表失败",
                buildDetailedErrorInfo(e, "list", wrapper)
            );
        }
    }

    @PostMapping("/count")
    public Result<Long> count(@RequestBody QueryRequestVo queryRequest) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();

        try {
            log.info("[{}] 查询设备数量", operationId);

            Long countResult = equipmentDelegator.count(queryRequest);

            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 查询设备数量成功, 数量: {}, 耗时: {}ms", operationId, countResult, duration);

            return Result.ok(countResult);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 查询设备数量失败, 耗时: {}ms, 异常类型: {}, 异常消息: {}",
                     operationId, duration, e.getClass().getSimpleName(), e.getMessage(), e);

            throw new BusinessException(
                ErrorCode.IDME_SDK_ERROR.getCode(),
                "查询设备数量失败",
                buildDetailedErrorInfo(e, "count", queryRequest)
            );
        }
    }

    @PostMapping("/update")
    public Result<EquipmentViewDTO> update(@RequestBody EquipmentUpdateDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();

        try {
            log.info("[{}] 更新设备, 请求参数: {}", operationId, dto);

            EquipmentViewDTO result = equipmentDelegator.update(dto);

            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 更新设备成功, 设备ID: {}, 耗时: {}ms", operationId, result.getId(), duration);

            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 更新设备失败, 耗时: {}ms, 异常类型: {}, 异常消息: {}",
                     operationId, duration, e.getClass().getSimpleName(), e.getMessage(), e);

            throw new BusinessException(
                ErrorCode.IDME_SDK_ERROR.getCode(),
                "更新设备失败",
                buildDetailedErrorInfo(e, "update", dto)
            );
        }
    }

    @PostMapping("/batchUpdate")
    public Result<List<EquipmentViewDTO>> batchUpdate(@RequestBody List<EquipmentUpdateDTO> dtoList) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 批量更新设备, 数量: {}", operationId, dtoList.size());
            if (dtoList == null || dtoList.isEmpty()) {
                throw new BusinessException(ErrorCode.BAD_REQUEST.getCode(), "更新列表不能为空");
            }
            List<EquipmentViewDTO> result = equipmentDelegator.batchUpdate(dtoList);
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 批量更新设备成功, 数量: {}, 耗时: {}ms", operationId, result.size(), duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 批量更新设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "批量更新设备失败", buildDetailedErrorInfo(e, "batchUpdate", dtoList));
        }
    }

    @PostMapping("/delete")
    public Result<Integer> delete(@RequestBody PersistObjectIdModifierDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 删除设备, ID: {}", operationId, dto.getId());
            Integer result = equipmentDelegator.delete(dto);
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 删除设备成功, 耗时: {}ms", operationId, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 删除设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "删除设备失败", buildDetailedErrorInfo(e, "delete", dto));
        }
    }

    @PostMapping("/batchDelete")
    public Result<Integer> batchDelete(@RequestBody PersistObjectIdsModifierDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 批量删除设备");
            Integer result = equipmentDelegator.batchDelete(dto);
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 批量删除设备成功, 耗时: {}ms", operationId, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 批量删除设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "批量删除设备失败", buildDetailedErrorInfo(e, "batchDelete", dto));
        }
    }

    @PostMapping("/logicalDelete")
    public Result<Integer> logicalDelete(@RequestBody PersistObjectIdModifierDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 逻辑删除设备, ID: {}", operationId, dto.getId());
            Integer result = equipmentDelegator.logicalDelete(dto);
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 逻辑删除设备成功, 耗时: {}ms", operationId, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 逻辑删除设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "逻辑删除设备失败", buildDetailedErrorInfo(e, "logicalDelete", dto));
        }
    }

    @PostMapping("/batchLogicalDelete")
    public Result<Integer> batchLogicalDelete(@RequestBody PersistObjectIdsModifierDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 批量逻辑删除设备");
            Integer result = equipmentDelegator.batchLogicalDelete(dto);
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 批量逻辑删除设备成功, 耗时: {}ms", operationId, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 批量逻辑删除设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "批量逻辑删除设备失败", buildDetailedErrorInfo(e, "batchLogicalDelete", dto));
        }
    }

    @PostMapping("/deleteByCondition")
    public Result<Integer> deleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 按条件删除设备");
            Integer result = equipmentDelegator.deleteByCondition(wrapper.toDeleteByConditionVo());
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 按条件删除设备成功, 删除数量: {}, 耗时: {}ms", operationId, result, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 按条件删除设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "按条件删除设备失败", buildDetailedErrorInfo(e, "deleteByCondition", wrapper));
        }
    }

    @PostMapping("/logicalDeleteByCondition")
    public Result<Integer> logicalDeleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 按条件逻辑删除设备");
            Integer result = equipmentDelegator.logicalDeleteByCondition(wrapper.toDeleteByConditionVo());
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 按条件逻辑删除设备成功, 删除数量: {}, 耗时: {}ms", operationId, result, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 按条件逻辑删除设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "按条件逻辑删除设备失败", buildDetailedErrorInfo(e, "logicalDeleteByCondition", wrapper));
        }
    }

    @PostMapping("/save")
    public Result<Integer> save(@RequestBody List<EquipmentSaveDTO> dtoList) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 保存设备, 数量: {}", operationId, dtoList.size());
            Integer result = equipmentDelegator.save(dtoList);
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 保存设备成功, 耗时: {}ms", operationId, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 保存设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "保存设备失败", buildDetailedErrorInfo(e, "save", dtoList));
        }
    }

    @PostMapping("/saveAll")
    public Result<Integer> saveAll(@RequestBody List<EquipmentSaveAllDTO> dtoList) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 全量保存设备, 数量: {}", operationId, dtoList.size());
            Integer result = equipmentDelegator.saveAll(dtoList);
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 全量保存设备成功, 耗时: {}ms", operationId, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 全量保存设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "全量保存设备失败", buildDetailedErrorInfo(e, "saveAll", dtoList));
        }
    }

    @PostMapping("/saveAs")
    public Result<EquipmentViewDTO> saveAs(@RequestBody EquipmentSaveAsDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 另存为设备");
            EquipmentViewDTO result = equipmentDelegator.saveAs(dto);
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 另存为设备成功, 耗时: {}ms", operationId, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 另存为设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "另存为设备失败", buildDetailedErrorInfo(e, "saveAs", dto));
        }
    }

    @PostMapping("/statics")
    public Result<List<Object>> statics(@RequestBody StaticsRequestWrapper wrapper) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 设备统计查询");
            List<Object> result = equipmentDelegator.statics(wrapper.getQueryRequest());
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 设备统计查询成功, 耗时: {}ms", operationId, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 设备统计查询失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "设备统计查询失败", buildDetailedErrorInfo(e, "statics", wrapper));
        }
    }

    @PostMapping("/staticsPage")
    public Result<List<Object>> staticsPage(@RequestBody StaticsRequestWrapper wrapper) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 设备分页统计查询");
            List<Object> result = equipmentDelegator.staticsPage(wrapper.getQueryRequest(), wrapper.getPageVO());
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 设备分页统计查询成功, 耗时: {}ms", operationId, duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 设备分页统计查询失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "设备分页统计查询失败", buildDetailedErrorInfo(e, "staticsPage", wrapper));
        }
    }

    @PostMapping("/updateByCondition")
    public Result<List<EquipmentViewDTO>> updateByCondition(@RequestBody UpdateByConditionWrapper<EquipmentUpdateDTO> wrapper) {
        long startTime = System.currentTimeMillis();
        String operationId = generateOperationId();
        try {
            log.info("[{}] 按条件更新设备");
            List<EquipmentViewDTO> result = equipmentDelegator.updateByCondition(wrapper.toUpdateByConditionVo());
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] 按条件更新设备成功, 数量: {}, 耗时: {}ms", operationId, result.size(), duration);
            return Result.ok(result);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 按条件更新设备失败, 耗时: {}ms, 异常: {}", operationId, duration, e.getMessage(), e);
            throw new BusinessException(ErrorCode.IDME_SDK_ERROR.getCode(), "按条件更新设备失败", buildDetailedErrorInfo(e, "updateByCondition", wrapper));
        }
    }

    private void validateCreateRequest(EquipmentCreateDTO dto) throws BusinessException {
        if (dto == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST.getCode(), "请求体不能为空");
        }
    }

    private Map<String, Object> buildDetailedErrorInfo(Exception e, String operation, Object requestParams) {
        Map<String, Object> errorInfo = new java.util.HashMap<>();
        errorInfo.put("operation", operation);
        errorInfo.put("exceptionClass", e.getClass().getName());
        errorInfo.put("exceptionMessage", e.getMessage());
        errorInfo.put("timestamp", System.currentTimeMillis());
        errorInfo.put("requestParams", requestParams != null ? requestParams.toString() : null);

        if (e.getCause() != null) {
            errorInfo.put("causeClass", e.getCause().getClass().getName());
            errorInfo.put("causeMessage", e.getCause().getMessage());
        }

        return errorInfo;
    }

    private String generateOperationId() {
        return "OP-" + System.currentTimeMillis() + "-" + Thread.currentThread().getId();
    }
}
