package org.example.FutureService.controller;

import com.huawei.innovation.rdm.coresdk.basic.dto.*;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.PartDelegator;
import com.huawei.innovation.rdm.prims.dto.entity.*;
import org.example.FutureService.common.DeleteByConditionWrapper;
import org.example.FutureService.common.QueryRequestWrapper;
import org.example.FutureService.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Part")
public class PartController {

    private final PartDelegator partDelegator;

    public PartController(PartDelegator partDelegator) {
        this.partDelegator = partDelegator;
    }

    @PostMapping("/add")
    public Result<PartViewDTO> create(@RequestBody PartCreateDTO dto) throws Exception {
        return Result.ok(partDelegator.create(dto));
    }

    @PostMapping("/batchAdd")
    public Result<List<PartViewDTO>> batchCreate(@RequestBody List<PartCreateDTO> dtoList) throws Exception {
        return Result.ok(partDelegator.batchCreate(dtoList));
    }

    @PostMapping("/get")
    public Result<PartViewDTO> getById(@RequestBody PersistObjectIdDecryptDTO dto) throws Exception {
        return Result.ok(partDelegator.get(dto));
    }

    @PostMapping("/batchGet")
    public Result<List<PartViewDTO>> batchGetByIds(@RequestBody PersistObjectIdsDecryptDTO dto) throws Exception {
        return Result.ok(partDelegator.batchGet(dto));
    }

    @PostMapping("/query")
    public Result<List<PartQueryViewDTO>> query(@RequestBody QueryRequestWrapper wrapper) throws Exception {
        return Result.ok(partDelegator.query(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }

    @PostMapping("/list")
    public Result<List<PartListViewDTO>> list(@RequestBody QueryRequestWrapper wrapper) throws Exception {
        return Result.ok(partDelegator.list(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }

    @PostMapping("/count")
    public Result<Long> count(@RequestBody QueryRequestVo queryRequest) throws Exception {
        return Result.ok(partDelegator.count(queryRequest));
    }

    @PostMapping("/update")
    public Result<PartViewDTO> update(@RequestBody PartUpdateDTO dto) throws Exception {
        return Result.ok(partDelegator.update(dto));
    }

    @PostMapping("/batchUpdate")
    public Result<List<PartViewDTO>> batchUpdate(@RequestBody List<PartUpdateDTO> dtoList) throws Exception {
        return Result.ok(partDelegator.batchUpdate(dtoList));
    }

    @PostMapping("/save")
    public Result<Integer> save(@RequestBody List<PartSaveDTO> dtoList) throws Exception {
        return Result.ok(partDelegator.save(dtoList));
    }

    @PostMapping("/saveAll")
    public Result<Integer> saveAll(@RequestBody List<PartSaveAllDTO> dtoList) throws Exception {
        return Result.ok(partDelegator.saveAll(dtoList));
    }

    @PostMapping("/saveAs")
    public Result<PartViewDTO> saveAs(@RequestBody PartSaveAsDTO dto) throws Exception {
        return Result.ok(partDelegator.saveAs(dto));
    }

    @PostMapping("/delete")
    public Result<Integer> delete(@RequestBody MasterIdModifierDTO dto) throws Exception {
        return Result.ok(partDelegator.delete(dto));
    }

    @PostMapping("/batchDelete")
    public Result<Integer> batchDelete(@RequestBody MasterIdsModifierDTO dto) throws Exception {
        return Result.ok(partDelegator.batchDelete(dto));
    }

    @PostMapping("/logicalDelete")
    public Result<Integer> logicalDelete(@RequestBody MasterIdModifierDTO dto) throws Exception {
        return Result.ok(partDelegator.logicalDelete(dto));
    }

    @PostMapping("/batchLogicalDelete")
    public Result<Integer> batchLogicalDelete(@RequestBody MasterIdsModifierDTO dto) throws Exception {
        return Result.ok(partDelegator.batchLogicalDelete(dto));
    }

    @PostMapping("/deleteByCondition")
    public Result<Integer> deleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) throws Exception {
        return Result.ok(partDelegator.deleteByCondition(wrapper.toDeleteByConditionVo()));
    }

    @PostMapping("/logicalDeleteByCondition")
    public Result<Integer> logicalDeleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) throws Exception {
        return Result.ok(partDelegator.logicalDeleteByCondition(wrapper.toDeleteByConditionVo()));
    }
}
