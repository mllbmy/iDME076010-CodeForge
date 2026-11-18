package org.example.FutureService.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.deser.ContextualDeserializer;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.util.ClassUtil;
import com.fasterxml.jackson.databind.util.EnumValues;
import org.springframework.util.ReflectionUtils;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 通用枚举反序列化器
 * 支持：
 *  - 字符串输入：根据 @JsonValue 标注的字段或方法的值进行匹配，若无则使用枚举名称。
 *  - 对象输入：从对象中提取 "alias" 字段的值（可根据需要调整字段名）。
 */
public class GenericEnumDeserializer extends StdDeserializer<Enum<?>> implements ContextualDeserializer {

    // 缓存每个枚举类的映射关系：字符串值 -> 枚举常量
    private static final Map<Class<?>, Map<String, Enum<?>>> ENUM_MAP_CACHE = new ConcurrentHashMap<>();

    private Class<? extends Enum<?>> enumClass;
    private Map<String, Enum<?>> enumValueMap;

    public GenericEnumDeserializer() {
        super(Enum.class);
    }

    private GenericEnumDeserializer(Class<? extends Enum<?>> enumClass) {
        super(enumClass);
        this.enumClass = enumClass;
        this.enumValueMap = buildEnumMap(enumClass);
    }

    @Override
    public JsonDeserializer<?> createContextual(DeserializationContext ctxt, BeanProperty property) throws JsonMappingException {
        // 获取当前字段/属性的具体类型
        JavaType type = ctxt.getContextualType();
        Class<?> rawClass = type.getRawClass();
        if (Enum.class.isAssignableFrom(rawClass)) {
            return new GenericEnumDeserializer((Class<? extends Enum<?>>) rawClass);
        }
        return this;
    }

    @Override
    public Enum<?> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        if (enumClass == null) {
            return (Enum<?>) ctxt.handleUnexpectedToken(Enum.class, p);
        }

        // 根据当前 token 类型处理
        if (p.currentToken() == JsonToken.VALUE_STRING) {
            String text = p.getText();
            Enum<?> result = enumValueMap.get(text);
            if (result == null) {
                // 尝试使用枚举名称（大小写不敏感）
                result = findByName(text);
            }
            if (result == null) {
                return (Enum<?>) ctxt.handleWeirdStringValue(enumClass, text,
                        "No enum constant with @JsonValue matching string: %s", text);
            }
            return result;
        } else if (p.currentToken() == JsonToken.START_OBJECT) {
            // 处理对象格式：从中提取某个字段（例如 "alias"）
            JsonNode node = p.readValueAsTree();
            JsonNode aliasNode = node.get("alias");
            if (aliasNode != null && aliasNode.isTextual()) {
                String alias = aliasNode.asText();
                Enum<?> result = enumValueMap.get(alias);
                if (result != null) {
                    return result;
                }
            }
            // 如果对象中没有匹配字段，尝试将对象作为字符串处理？或抛异常
            return (Enum<?>) ctxt.handleUnexpectedToken(enumClass, p);
        }

        return (Enum<?>) ctxt.handleUnexpectedToken(enumClass, p);
    }

    private Map<String, Enum<?>> buildEnumMap(Class<? extends Enum<?>> clazz) {
        // 先从缓存获取
        if (ENUM_MAP_CACHE.containsKey(clazz)) {
            return ENUM_MAP_CACHE.get(clazz);
        }

        Map<String, Enum<?>> map = new HashMap<>();
        Enum<?>[] constants = clazz.getEnumConstants();

        // 查找 @JsonValue 标注的字段或方法
        Field jsonValueField = findJsonValueField(clazz);
        Method jsonValueMethod = findJsonValueMethod(clazz);

        try {
            for (Enum<?> constant : constants) {
                String mappedValue = null;

                // 优先使用字段上的 @JsonValue
                if (jsonValueField != null) {
                    jsonValueField.setAccessible(true);
                    mappedValue = String.valueOf(jsonValueField.get(constant));
                }
                // 其次使用方法上的 @JsonValue
                else if (jsonValueMethod != null) {
                    jsonValueMethod.setAccessible(true);
                    mappedValue = String.valueOf(jsonValueMethod.invoke(constant));
                }
                // 最后使用枚举名称
                else {
                    mappedValue = constant.name();
                }

                // 同一个 mappedValue 不应对应多个常量（若有冲突，保留第一个）
                map.putIfAbsent(mappedValue, constant);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to build enum map for " + clazz.getName(), e);
        }

        ENUM_MAP_CACHE.put(clazz, map);
        return map;
    }

    private Field findJsonValueField(Class<?> clazz) {
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(com.fasterxml.jackson.annotation.JsonValue.class)) {
                return field;
            }
        }
        return null;
    }

    private Method findJsonValueMethod(Class<?> clazz) {
        for (Method method : clazz.getDeclaredMethods()) {
            if (method.isAnnotationPresent(com.fasterxml.jackson.annotation.JsonValue.class)) {
                return method;
            }
        }
        return null;
    }

    private Enum<?> findByName(String text) {
        for (Enum<?> constant : enumClass.getEnumConstants()) {
            if (constant.name().equalsIgnoreCase(text)) {
                return constant;
            }
        }
        return null;
    }
}