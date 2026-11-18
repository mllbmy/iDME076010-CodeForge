package org.example.FutureService.common;

import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.UpdateByConditionVo;
import lombok.Data;

import java.util.Map;

@Data
public class UpdateByConditionWrapper<T> {
    private QueryRequestVo condition;
    private T updateDTO;
    private Map<String, Object> updateData;

    public UpdateByConditionVo toUpdateByConditionVo() {
        UpdateByConditionVo vo = new UpdateByConditionVo();
        vo.setCondition(condition != null ? condition : new QueryRequestVo());
        return vo;
    }
}
