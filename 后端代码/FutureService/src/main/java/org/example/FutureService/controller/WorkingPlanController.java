package org.example.FutureService.controller;

import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdsDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdsModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.WorkingPlanDelegator;
import com.huawei.innovation.rdm.prims.dto.entity.*;
import org.example.FutureService.common.DeleteByConditionWrapper;
import org.example.FutureService.common.QueryRequestWrapper;
import org.example.FutureService.common.Result;
import org.example.FutureService.common.StaticsRequestWrapper;
import org.example.FutureService.common.UpdateByConditionWrapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/WorkingPlan")
public class WorkingPlanController {

    private final WorkingPlanDelegator workingPlanDelegator;

    public WorkingPlanController(WorkingPlanDelegator workingPlanDelegator) {
        this.workingPlanDelegator = workingPlanDelegator;
    }

    @PostMapping("/add")
    public Result<WorkingPlanViewDTO> create(@RequestBody WorkingPlanCreateDTO dto) throws Exception {
        return Result.ok(workingPlanDelegator.create(dto));
    }

    @PostMapping("/batchAdd")
    public Result<List<WorkingPlanViewDTO>> batchCreate(@RequestBody List<WorkingPlanCreateDTO> dtoList) throws Exception {
        return Result.ok(workingPlanDelegator.batchCreate(dtoList));
    }

    @PostMapping("/get")
    public Result<WorkingPlanViewDTO> getById(@RequestBody PersistObjectIdDecryptDTO dto) throws Exception {
        return Result.ok(workingPlanDelegator.get(dto));
    }

    @PostMapping("/batchGet")
    public Result<List<WorkingPlanViewDTO>> batchGetByIds(@RequestBody PersistObjectIdsDecryptDTO dto) throws Exception {
        return Result.ok(workingPlanDelegator.batchGet(dto));
    }

    @PostMapping("/query")
    public Result<List<WorkingPlanQueryViewDTO>> query(@RequestBody QueryRequestWrapper wrapper) throws Exception {
        return Result.ok(workingPlanDelegator.query(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }

    @PostMapping("/list")
    public Result<List<WorkingPlanListViewDTO>> list(@RequestBody QueryRequestWrapper wrapper) throws Exception {
        return Result.ok(workingPlanDelegator.list(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }

    @PostMapping("/count")
    public Result<Long> count(@RequestBody QueryRequestVo queryRequest) throws Exception {
        return Result.ok(workingPlanDelegator.count(queryRequest));
    }

    @PostMapping("/update")
    public Result<WorkingPlanViewDTO> update(@RequestBody WorkingPlanUpdateDTO dto) throws Exception {
        return Result.ok(workingPlanDelegator.update(dto));
    }

    @PostMapping("/batchUpdate")
    public Result<List<WorkingPlanViewDTO>> batchUpdate(@RequestBody List<WorkingPlanUpdateDTO> dtoList) throws Exception {
        return Result.ok(workingPlanDelegator.batchUpdate(dtoList));
    }

    @PostMapping("/save")
    public Result<Integer> save(@RequestBody List<WorkingPlanSaveDTO> dtoList) throws Exception {
        return Result.ok(workingPlanDelegator.save(dtoList));
    }

    @PostMapping("/saveAll")
    public Result<Integer> saveAll(@RequestBody List<WorkingPlanSaveAllDTO> dtoList) throws Exception {
        return Result.ok(workingPlanDelegator.saveAll(dtoList));
    }

    @PostMapping("/saveAs")
    public Result<WorkingPlanViewDTO> saveAs(@RequestBody WorkingPlanSaveAsDTO dto) throws Exception {
        return Result.ok(workingPlanDelegator.saveAs(dto));
    }

    @PostMapping("/delete")
    public Result<Integer> delete(@RequestBody PersistObjectIdModifierDTO dto) throws Exception {
        return Result.ok(workingPlanDelegator.delete(dto));
    }

    @PostMapping("/batchDelete")
    public Result<Integer> batchDelete(@RequestBody PersistObjectIdsModifierDTO dto) throws Exception {
        return Result.ok(workingPlanDelegator.batchDelete(dto));
    }

    @PostMapping("/logicalDelete")
    public Result<Integer> logicalDelete(@RequestBody PersistObjectIdModifierDTO dto) throws Exception {
        return Result.ok(workingPlanDelegator.logicalDelete(dto));
    }

    @PostMapping("/batchLogicalDelete")
    public Result<Integer> batchLogicalDelete(@RequestBody PersistObjectIdsModifierDTO dto) throws Exception {
        return Result.ok(workingPlanDelegator.batchLogicalDelete(dto));
    }

    @PostMapping("/deleteByCondition")
    public Result<Integer> deleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) throws Exception {
        return Result.ok(workingPlanDelegator.deleteByCondition(wrapper.toDeleteByConditionVo()));
    }

    @PostMapping("/logicalDeleteByCondition")
    public Result<Integer> logicalDeleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) throws Exception {
        return Result.ok(workingPlanDelegator.logicalDeleteByCondition(wrapper.toDeleteByConditionVo()));
    }

    @PostMapping("/statics")
    public Result<List<Object>> statics(@RequestBody StaticsRequestWrapper wrapper) throws Exception {
        return Result.ok(workingPlanDelegator.statics(wrapper.getQueryRequest()));
    }

    @PostMapping("/staticsPage")
    public Result<List<Object>> staticsPage(@RequestBody StaticsRequestWrapper wrapper) throws Exception {
        return Result.ok(workingPlanDelegator.staticsPage(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }

    @PostMapping("/updateByCondition")
    public Result<List<WorkingPlanViewDTO>> updateByCondition(@RequestBody UpdateByConditionWrapper<WorkingPlanUpdateDTO> wrapper) throws Exception {
        return Result.ok(workingPlanDelegator.updateByCondition(wrapper.toUpdateByConditionVo()));
    }
}
