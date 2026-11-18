package org.example.FutureService.common;

import com.huawei.innovation.rdm.coresdk.basic.vo.DeleteByConditionVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import lombok.Data;

@Data
public class DeleteByConditionWrapper {
    private QueryRequestVo condition;

    public DeleteByConditionVo toDeleteByConditionVo() {
        DeleteByConditionVo vo = new DeleteByConditionVo();
        vo.setCondition(condition != null ? condition : new QueryRequestVo());
        return vo;
    }
}
