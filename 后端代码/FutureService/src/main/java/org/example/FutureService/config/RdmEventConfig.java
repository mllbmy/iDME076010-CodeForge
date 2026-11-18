package org.example.FutureService.config;

import com.huawei.innovation.rdm.bean.interfaces.Persistable;
import com.huawei.innovation.rdm.coresdk.basic.event.restevent.IRestEventPublisher;
import com.huawei.innovation.rdm.coresdk.basic.event.restevent.RestEvent;
import com.huawei.innovation.rdm.coresdk.basic.event.restevent.RestEventType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RdmEventConfig {

    @Bean
    public IRestEventPublisher restEventPublisher() {
        return new IRestEventPublisher() {
            @Override
            public <T extends Persistable> void publishPreEvent(String method, Class<T> modelClass, Object dto, Object entity) {

            }

            @Override
            public <T extends Persistable> void publishPreEvent(String method, Class<T> modelClass, Object dto) {

            }

            @Override
            public <T extends Persistable> void publishPostEvent(String method, Class<T> modelClass, Object dto, Object entity) {

            }

            @Override
            public <T extends Persistable> void publishPostEvent(String method, Class<T> modelClass, Object dto) {

            }

            @Override
            public RestEvent getRestEvent(RestEventType type, String method, Class modelClass, Object dto, Object entity) {
                return null;
            }
        };
    }
}
