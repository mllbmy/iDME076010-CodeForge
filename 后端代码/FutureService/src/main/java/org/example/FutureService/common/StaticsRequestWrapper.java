package org.example.FutureService.common;

import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestStaticsVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.RDMPageVO;
import lombok.Data;

@Data
public class StaticsRequestWrapper {
    private QueryRequestStaticsVo queryRequest;
    private RDMPageVO pageVO;

    public QueryRequestStaticsVo getQueryRequest() {
        if (queryRequest == null) {
            queryRequest = new QueryRequestStaticsVo();
        }
        return queryRequest;
    }

    public RDMPageVO getPageVO() {
        if (pageVO == null) {
            pageVO = new RDMPageVO();
        }
        return pageVO;
    }
}
