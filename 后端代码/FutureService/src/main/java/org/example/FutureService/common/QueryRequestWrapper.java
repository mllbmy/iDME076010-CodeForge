package org.example.FutureService.common;

import com.huawei.innovation.rdm.coresdk.basic.vo.QueryRequestVo;
import com.huawei.innovation.rdm.coresdk.basic.vo.RDMPageVO;
import lombok.Data;

@Data
public class QueryRequestWrapper {
    private QueryRequestVo queryRequest;
    private RDMPageVO pageVO;

    public QueryRequestVo getQueryRequest() {
        if (queryRequest == null) {
            queryRequest = new QueryRequestVo();
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
