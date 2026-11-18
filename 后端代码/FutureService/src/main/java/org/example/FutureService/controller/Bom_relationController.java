package org.example.FutureService.controller;

import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdsDecryptDTO;
import com.huawei.innovation.rdm.coresdk.basic.dto.PersistObjectIdsModifierDTO;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.prims.delegator.Bom_relationDelegator;
import com.huawei.innovation.rdm.prims.dto.entity.*;
import com.huawei.innovation.rdm.prims.dto.relation.*;
import org.example.FutureService.common.DeleteByConditionWrapper;
import org.example.FutureService.common.QueryRequestWrapper;
import org.example.FutureService.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Bom_relation")
public class Bom_relationController {

    private final Bom_relationDelegator bomRelationDelegator;

    public Bom_relationController(Bom_relationDelegator bomRelationDelegator) {
        this.bomRelationDelegator = bomRelationDelegator;
    }

    @PostMapping("/add")
    public Result<Bom_relationViewDTO> create(@RequestBody Bom_relationCreateDTO dto) throws Exception {
        return Result.ok(bomRelationDelegator.create(dto));
    }

    @PostMapping("/batchAdd")
    public Result<List<Bom_relationViewDTO>> batchCreate(@RequestBody List<Bom_relationCreateDTO> dtoList) throws Exception {
        return Result.ok(bomRelationDelegator.batchCreate(dtoList));
    }

    @PostMapping("/get")
    public Result<Bom_relationViewDTO> getById(@RequestBody PersistObjectIdDecryptDTO dto) throws Exception {
        return Result.ok(bomRelationDelegator.get(dto));
    }

    @PostMapping("/batchGet")
    public Result<List<Bom_relationViewDTO>> batchGetByIds(@RequestBody PersistObjectIdsDecryptDTO dto) throws Exception {
        return Result.ok(bomRelationDelegator.batchGet(dto));
    }

    @PostMapping("/query")
    public Result<List<Bom_relationQueryViewDTO>> query(@RequestBody QueryRequestWrapper wrapper) throws Exception {
        return Result.ok(bomRelationDelegator.query(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }

    @PostMapping("/list")
    public Result<List<Bom_relationListViewDTO>> list(@RequestBody QueryRequestWrapper wrapper) throws Exception {
        return Result.ok(bomRelationDelegator.list(wrapper.getQueryRequest(), wrapper.getPageVO()));
    }

    @PostMapping("/count")
    public Result<Long> count(@RequestBody QueryRequestVo queryRequest) throws Exception {
        return Result.ok(bomRelationDelegator.count(queryRequest));
    }

    @PostMapping("/update")
    public Result<Bom_relationViewDTO> update(@RequestBody Bom_relationUpdateDTO dto) throws Exception {
        return Result.ok(bomRelationDelegator.update(dto));
    }

    @PostMapping("/batchUpdate")
    public Result<List<Bom_relationViewDTO>> batchUpdate(@RequestBody List<Bom_relationUpdateDTO> dtoList) throws Exception {
        return Result.ok(bomRelationDelegator.batchUpdate(dtoList));
    }

    @PostMapping("/save")
    public Result<Integer> save(@RequestBody List<Bom_relationSaveDTO> dtoList) throws Exception {
        return Result.ok(bomRelationDelegator.save(dtoList));
    }

    @PostMapping("/saveAll")
    public Result<Integer> saveAll(@RequestBody List<Bom_relationSaveAllDTO> dtoList) throws Exception {
        return Result.ok(bomRelationDelegator.saveAll(dtoList));
    }

    @PostMapping("/saveAs")
    public Result<Bom_relationViewDTO> saveAs(@RequestBody Bom_relationSaveAsDTO dto) throws Exception {
        return Result.ok(bomRelationDelegator.saveAs(dto));
    }

    @PostMapping("/delete")
    public Result<Integer> delete(@RequestBody PersistObjectIdModifierDTO dto) throws Exception {
        return Result.ok(bomRelationDelegator.delete(dto));
    }

    @PostMapping("/batchDelete")
    public Result<Integer> batchDelete(@RequestBody PersistObjectIdsModifierDTO dto) throws Exception {
        return Result.ok(bomRelationDelegator.batchDelete(dto));
    }

    @PostMapping("/logicalDelete")
    public Result<Integer> logicalDelete(@RequestBody PersistObjectIdModifierDTO dto) throws Exception {
        return Result.ok(bomRelationDelegator.logicalDelete(dto));
    }

    @PostMapping("/batchLogicalDelete")
    public Result<Integer> batchLogicalDelete(@RequestBody PersistObjectIdsModifierDTO dto) throws Exception {
        return Result.ok(bomRelationDelegator.batchLogicalDelete(dto));
    }

    @PostMapping("/deleteByCondition")
    public Result<Integer> deleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) throws Exception {
        return Result.ok(bomRelationDelegator.deleteByCondition(wrapper.toDeleteByConditionVo()));
    }

    @PostMapping("/logicalDeleteByCondition")
    public Result<Integer> logicalDeleteByCondition(@RequestBody DeleteByConditionWrapper wrapper) throws Exception {
        return Result.ok(bomRelationDelegator.logicalDeleteByCondition(wrapper.toDeleteByConditionVo()));
    }
}
