package org.example.FutureService.controller;

import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdsDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdsModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.WorkingProcedureDelegator;
import com.huawei.innovation.rdm.prims.dto.entity.*;
import org.example.FutureService.common.DeleteByConditionWrapper;
import org.example.FutureService.common.QueryRequestWrapper;
import org.example.FutureService.common.Result;
import org.example.FutureService.common.StaticsRequestWrapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/WorkingProcedure")
public class WorkingProcedureController {

    private final WorkingProcedureDelegator workingProcedureDelegator;

    public WorkingProcedureController(WorkingProcedureDelegator workingProcedureDelegator) {
        this.workingProcedureDelegator = workingProcedureDelegator;
    }

    @PostMapping("/add")
    public Result<WorkingProcedureViewDTO> create(@RequestBody WorkingProcedureCreateDTO dto) throws Exception {
        return Result.ok(workingProcedureDelegator.create(dto));
    }

    @PostMapping("/batchAdd")
    public Result<List<WorkingProcedureViewDTO>> batchCreate(@RequestBody List<WorkingProcedureCreateDTO> dtoList) throws Exception {
        return Result.ok(workingProcedureDelegator.batchCreate(dtoList));
    }

    @PostMapping("/get")
    public Result<WorkingProcedureViewDTO> getById(@RequestBody PersistObjectIdDecryptDTO dto) throws Exception {
        return Result.ok(workingProcedureDelegator.get(dto));
    }

    @PostMapping("/batchGet")
    public Result<List<WorkingProcedureViewDTO>> batchGetByIds(@RequestBody PersistObjectIdsDecryptDTO dto) throws Exception {
        return Result.ok(workingProcedureDelegator.batchGet(dto));
    }

    @PostMapping("/query")
    public Result<List<WorkingProcedureQueryViewDTO>> query(@RequestBody QueryRequestWrapper wrapper) throws Exception {
        return Result.ok(workingProcedureDelegator.query(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }

    @PostMapping("/list")
    public Result<List<WorkingProcedureListViewDTO>> list(@RequestBody QueryRequestWrapper wrapper) throws Exception {
        return Result.ok(workingProcedureDelegator.list(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }

    @PostMapping("/count")
    public Result<Long> count(@RequestBody QueryRequestVo queryRequest) throws Exception {
        return Result.ok(workingProcedureDelegator.count(queryRequest));
    }

    @PostMapping("/update")
    public Result<WorkingProcedureViewDTO> update(@RequestBody WorkingProcedureUpdateDTO dto) throws Exception {
        return Result.ok(workingProcedureDelegator.update(dto));
    }

    @PostMapping("/batchUpdate")
    public Result<List<WorkingProcedureViewDTO>> batchUpdate(@RequestBody List<WorkingProcedureUpdateDTO> dtoList) throws Exception {
        return Result.ok(workingProcedureDelegator.batchUpdate(dtoList));
    }

    @PostMapping("/save")
    public Result<Integer> save(@RequestBody List<WorkingProcedureSaveDTO> dtoList) throws Exception {
        return Result.ok(workingProcedureDelegator.save(dtoList));
    }

    @PostMapping("/saveAll")
    public Result<Integer> saveAll(@RequestBody List<WorkingProcedureSaveAllDTO> dtoList) throws Exception {
        return Result.ok(workingProcedureDelegator.saveAll(dtoList));
    }

    @PostMapping("/saveAs")
    public Result<WorkingProcedureViewDTO> saveAs(@RequestBody WorkingProcedureSaveAsDTO dto) throws Exception {
        return Result.ok(workingProcedureDelegator.saveAs(dto));
    }

    @PostMapping("/delete")
    public Result<Integer> delete(@RequestBody PersistObjectIdModifierDTO dto) throws Exception {
        return Result.ok(workingProcedureDelegator.delete(dto));
    }

    @PostMapping("/batchDelete")
    public Result<Integer> batchDelete(@RequestBody PersistObjectIdsModifierDTO dto) throws Exception {
        return Result.ok(workingProcedureDelegator.batchDelete(dto));
    }

    @PostMapping("/logicalDelete")
    public Result<Integer> logicalDelete(@RequestBody PersistObjectIdModifierDTO dto) throws Exception {
        return Result.ok(workingProcedureDelegator.logicalDelete(dto));
    }

    @PostMapping("/batchLogicalDelete")
    public Result<Integer> batchLogicalDelete(@RequestBody PersistObjectIdsModifierDTO dto) throws Exception {
        return Result.ok(workingProcedureDelegator.batchLogicalDelete(dto));
    }

    @PostMapping("/deleteByCondition")
    public Result<Integer> deleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) throws Exception {
        return Result.ok(workingProcedureDelegator.deleteByCondition(wrapper.toDeleteByConditionVo()));
    }

    @PostMapping("/logicalDeleteByCondition")
    public Result<Integer> logicalDeleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) throws Exception {
        return Result.ok(workingProcedureDelegator.logicalDeleteByCondition(wrapper.toDeleteByConditionVo()));
    }

    @PostMapping("/statics")
    public Result<List<Object>> statics(@RequestBody StaticsRequestWrapper wrapper) throws Exception {
        return Result.ok(workingProcedureDelegator.statics(wrapper.getQueryRequest()));
    }

    @PostMapping("/staticsPage")
    public Result<List<Object>> staticsPage(@RequestBody StaticsRequestWrapper wrapper) throws Exception {
        return Result.ok(workingProcedureDelegator.staticsPage(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }
}
