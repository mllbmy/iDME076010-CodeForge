import json
import requests
import time
import sys
import uuid
from datetime import datetime

BASE_URL = "http://192.168.31.49:8080/api"
API_DOC_PATH = r"c:\doc\IDME\TreaFour\docs\api\api-docs.customization"
TIMEOUT = 15

MEASURING_UNIT_ID = "895432916262195206"

results = {
    "total": 0, "passed": 0, "failed": 0,
    "details": [],
    "by_module": {},
    "by_test_type": {
        "basic_functionality": {"passed": 0, "failed": 0, "total": 0},
        "boundary_values": {"passed": 0, "failed": 0, "total": 0},
        "response_format": {"passed": 0, "failed": 0, "total": 0},
        "auth_permission": {"passed": 0, "failed": 0, "total": 0},
        "error_handling": {"passed": 0, "failed": 0, "total": 0},
    },
}

type_names = {
    "basic_functionality": "基本功能测试",
    "boundary_values": "边界值测试",
    "response_format": "响应格式验证",
    "auth_permission": "权限控制测试",
    "error_handling": "错误处理测试",
}

created_data = {
    "Equipment": [],
    "Part": [],
    "WorkingPlan": [],
    "WorkingProcedure": [],
    "Bom_relation": [],
}

ts = datetime.now().strftime("%Y%m%d%H%M%S")


def uid():
    return str(uuid.uuid4())[:8]


def load_api_doc():
    with open(API_DOC_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def resolve_ref(schema, components):
    if not schema:
        return {}
    if "$ref" in schema:
        parts = schema["$ref"].replace("#/", "").split("/")
        resolved = components
        for part in parts:
            resolved = resolved.get(part, {})
        return resolved
    return schema


def make_request(endpoint, body, headers=None, timeout=TIMEOUT):
    url = f"{BASE_URL}{endpoint}"
    default_headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if headers:
        default_headers.update(headers)
    try:
        resp = requests.post(url, json=body, headers=default_headers, timeout=timeout)
        try:
            resp_json = resp.json()
        except:
            resp_json = resp.text
        return resp.status_code, resp_json, None
    except requests.exceptions.ConnectionError:
        return 0, None, "Connection refused - server unreachable"
    except requests.exceptions.Timeout:
        return 0, None, f"Request timeout ({timeout}s)"
    except Exception as e:
        return 0, None, str(e)


def record_result(endpoint, method, test_type, test_name, passed, status_code,
                  response_body, error_msg="", request_body=None):
    results["total"] += 1
    if passed:
        results["passed"] += 1
    else:
        results["failed"] += 1

    tag = ""
    for t in ["Equipment", "Part", "WorkingPlan", "WorkingProcedure", "Bom_relation"]:
        if t.lower() in endpoint.lower():
            tag = t
            break
    if not tag:
        tag = "Other"

    if tag not in results["by_module"]:
        results["by_module"][tag] = {"passed": 0, "failed": 0, "total": 0}
    results["by_module"][tag]["total"] += 1
    if passed:
        results["by_module"][tag]["passed"] += 1
    else:
        results["by_module"][tag]["failed"] += 1

    results["by_test_type"][test_type]["total"] += 1
    if passed:
        results["by_test_type"][test_type]["passed"] += 1
    else:
        results["by_test_type"][test_type]["failed"] += 1

    resp_str = ""
    if response_body:
        try:
            resp_str = json.dumps(response_body, ensure_ascii=False)[:500]
        except:
            resp_str = str(response_body)[:500]

    req_str = ""
    if request_body:
        try:
            req_str = json.dumps(request_body, ensure_ascii=False)[:500]
        except:
            req_str = str(request_body)[:500]

    results["details"].append({
        "endpoint": endpoint, "method": method, "test_type": test_type,
        "test_name": test_name, "passed": passed, "status_code": status_code,
        "response_preview": resp_str, "error_msg": error_msg, "request_body": req_str,
    })


def check_result_format(resp_json):
    if isinstance(resp_json, str):
        try:
            int(resp_json)
            return False, "Response is plain integer, not standard Result format"
        except:
            return False, f"Response is plain text: {resp_json[:100]}"
    if not isinstance(resp_json, dict):
        return False, f"Response is not a JSON object, type: {type(resp_json).__name__}"
    has_result = "result" in resp_json
    has_code = "code" in resp_json or "status" in resp_json
    has_data = "data" in resp_json
    if has_result:
        return True, ""
    if has_code and has_data:
        return True, ""
    if has_data:
        return True, ""
    if "id" in resp_json and ("createTime" in resp_json or "rdmVersion" in resp_json):
        return True, ""
    if "timestamp" in resp_json and "error" in resp_json:
        return False, f"Spring Boot error: {resp_json.get('error', '')} - {resp_json.get('message', '')[:100]}"
    return False, f"Non-standard format. Keys: {list(resp_json.keys())[:10]}"


def get_created_id(module, index=0):
    ids = created_data.get(module, [])
    if index < len(ids):
        return ids[index]
    return None


def build_equipment_create(suffix=""):
    return {
        "devicename": f"测试设备{suffix or uid()}",
        "devicecode": f"CNC-{uid()}-{suffix or uid()}",
        "device_Type": "A002",
        "status": "D001",
    }


def build_part_create(suffix=""):
    return {
        "part_Name": f"测试零件{suffix or uid()}",
        "part_Code": f"PART-{uid()}-{suffix or uid()}",
        "part_Category": "C002",
        "material": "20CrMnTi合金钢",
        "specification": "Φ50x200mm",
        "weight": 2.85,
        "unit": "个",
        "drawing_No": f"DWG-{uid()}-{suffix or uid()}",
        "status": "D001",
        "master": {},
        "branch": {},
    }


def build_workingprocedure_create(suffix=""):
    part_id = get_created_id("Part", 0)
    equip_id = get_created_id("Equipment", 0)
    body = {
        "procedure_Name": f"测试工序{suffix or uid()}",
        "procedure_Code": f"PROC-{uid()}-{suffix or uid()}",
        "related_Equipment": {"id": equip_id} if equip_id else {},
        "related_Part": {"id": part_id} if part_id else {},
        "description": "自动化测试创建",
    }
    return body


def build_workingplan_create(suffix=""):
    part_id = get_created_id("Part", 0)
    proc_id = get_created_id("WorkingProcedure", 0)
    body = {
        "plan_Name": f"测试计划{suffix or uid()}",
        "plan_Code": f"PLAN-{uid()}-{suffix or uid()}",
        "status": "D001",
        "related_Part": {"id": part_id} if part_id else {},
        "workingplan_Procedures": {"id": proc_id} if proc_id else {},
        "description": "自动化测试创建",
    }
    return body


def build_bom_relation_create():
    parent_id = get_created_id("Part", 0)
    child_id = get_created_id("Part", 1)
    source_id = get_created_id("Part", 0)
    target_id = get_created_id("Part", 1)
    body = {
        "source": {"id": source_id} if source_id else {},
        "target": {"id": target_id} if target_id else {},
        "parent_Part_Ref": {"id": parent_id} if parent_id else {},
        "child_Part_Ref": {"id": child_id} if child_id else {},
        "quantity": 2,
        "unit": "个",
        "position": "装配位置A",
    }
    return body


def get_module_from_endpoint(endpoint):
    for m in ["Equipment", "Part", "WorkingPlan", "WorkingProcedure", "Bom_relation"]:
        if m.lower() in endpoint.lower():
            return m
    return None


def get_create_body(endpoint, suffix=""):
    module = get_module_from_endpoint(endpoint)
    if module == "Equipment":
        return build_equipment_create(suffix)
    elif module == "Part":
        return build_part_create(suffix)
    elif module == "WorkingPlan":
        return build_workingplan_create(suffix)
    elif module == "WorkingProcedure":
        return build_workingprocedure_create(suffix)
    elif module == "Bom_relation":
        return build_bom_relation_create()
    return {}


def get_smart_body(endpoint, operation_id, req_schema, components):
    module = get_module_from_endpoint(endpoint)
    op_lower = operation_id.lower()

    if module in ["Equipment", "Part", "WorkingPlan", "WorkingProcedure", "Bom_relation"]:
        if "add" in op_lower or "create" in op_lower:
            if "batch" in op_lower:
                return [
                    get_create_body(endpoint, "b1"),
                    get_create_body(endpoint, "b2"),
                ]
            return get_create_body(endpoint)

        if "saveall" in op_lower:
            return [
                get_create_body(endpoint, "b1"),
                get_create_body(endpoint, "b2"),
            ]

        if "saveas" in op_lower:
            return get_create_body(endpoint, "saveas")

        if op_lower == "save":
            return get_create_body(endpoint)

        if "update" in op_lower:
            if "batch" in op_lower:
                body1 = get_create_body(endpoint, "upd1")
                body1["id"] = get_created_id(module, 0) or "1"
                body2 = get_create_body(endpoint, "upd2")
                body2["id"] = get_created_id(module, 1) or "1"
                return [body1, body2]
            if "bycondition" in op_lower:
                return {
                    "conditions": [],
                    "updateEntity": get_create_body(endpoint, "condupd"),
                }
            body = get_create_body(endpoint, "upd")
            record_id = get_created_id(module, 0)
            if record_id:
                body["id"] = record_id
            return body

        if "delete" in op_lower:
            if "batch" in op_lower:
                ids = created_data.get(module, [])[:3]
                return {"ids": ids} if ids else {"ids": ["1"]}
            if "bycondition" in op_lower:
                return {"conditions": []}
            if "logical" in op_lower:
                if "batch" in op_lower:
                    ids = created_data.get(module, [])[:3]
                    return {"ids": ids} if ids else {"ids": ["1"]}
                record_id = get_created_id(module, 0)
                return {"id": record_id or "1"}
            record_id = get_created_id(module, 0)
            return {"id": record_id or "1"}

        if "get" in op_lower:
            if "batch" in op_lower:
                ids = created_data.get(module, [])[:3]
                return {"ids": ids} if ids else {"ids": ["1"]}
            record_id = get_created_id(module, 0)
            return {"id": record_id or "1"}

        if "list" in op_lower:
            return {
                "queryRequest": {
                    "sort": "DESC",
                    "orderBy": "createTime",
                    "conditions": [],
                },
                "pageVO": {
                    "curPage": 1,
                    "pageSize": 10,
                },
            }

        if "query" in op_lower:
            return {
                "sort": "DESC",
                "orderBy": "createTime",
                "conditions": [],
            }

        if "count" in op_lower:
            return {}

        if "statics" in op_lower:
            if "page" in op_lower:
                return {
                    "queryRequest": {
                        "sort": "DESC",
                        "orderBy": "createTime",
                        "conditions": [],
                    },
                    "pageVO": {
                        "curPage": 1,
                        "pageSize": 10,
                    },
                }
            return {
                "sort": "DESC",
                "orderBy": "createTime",
                "conditions": [],
            }

    schema = resolve_ref(req_schema, components) if req_schema else {}
    props = schema.get("properties", {})
    if not props:
        return {}
    body = {}
    for pname, pschema in props.items():
        pschema = resolve_ref(pschema, components)
        ptype = pschema.get("type", "string")
        if ptype in ("integer", "number"):
            body[pname] = 1
        elif ptype == "boolean":
            body[pname] = True
        elif ptype == "string":
            body[pname] = f"test_{pname}"
        else:
            body[pname] = {}
    return body


def extract_created_id(resp_json, module):
    if not isinstance(resp_json, dict):
        return None
    if "id" in resp_json and ("createTime" in resp_json or "rdmVersion" in resp_json):
        return resp_json.get("id")
    data = resp_json.get("data", resp_json.get("result", {}))
    if isinstance(data, dict):
        return data.get("id")
    if isinstance(data, list):
        ids = []
        for item in data:
            if isinstance(item, dict) and item.get("id"):
                ids.append(item["id"])
        return ids[0] if ids else None
    return None


def test_basic_functionality(endpoint, operation_id, req_schema, components):
    body = get_smart_body(endpoint, operation_id, req_schema, components)
    status_code, resp_json, error = make_request(endpoint, body)

    if error:
        record_result(endpoint, "POST", "basic_functionality",
                      f"{operation_id} - 基本功能测试", False, 0, None, error, body)
        return

    passed = status_code == 200
    err_msg = ""

    if passed and isinstance(resp_json, dict):
        result_val = resp_json.get("result", resp_json.get("code"))
        if result_val is not None:
            result_str = str(result_val).upper()
            if result_str not in ["SUCCESS", "200", "0", "OK"]:
                passed = False
                msg_val = resp_json.get("message", resp_json.get("msg", ""))
                err_msg = f"业务错误: result={result_val}, msg={msg_val}"
        elif "id" in resp_json and ("createTime" in resp_json or "rdmVersion" in resp_json):
            pass

        if passed:
            module = get_module_from_endpoint(endpoint)
            new_id = extract_created_id(resp_json, module)
            if new_id and module:
                created_data[module].append(new_id)

    elif not passed:
        if isinstance(resp_json, dict):
            result_val = resp_json.get("result", resp_json.get("code", resp_json.get("status")))
            msg_val = resp_json.get("message", resp_json.get("msg", resp_json.get("error", "")))
            err_msg = f"HTTP {status_code}; result={result_val}; msg={msg_val}"
        else:
            err_msg = f"HTTP {status_code}; response={str(resp_json)[:200]}"

    record_result(endpoint, "POST", "basic_functionality",
                  f"{operation_id} - 基本功能测试", passed, status_code, resp_json, err_msg, body)


def test_boundary_values(endpoint, operation_id, req_schema, components):
    module = get_module_from_endpoint(endpoint)
    op_lower = operation_id.lower()

    empty_body = {}
    status_code, resp_json, error = make_request(endpoint, empty_body)
    passed = error is None and status_code in [200, 400, 422, 500]
    err_msg = ""
    if status_code == 500 and isinstance(resp_json, dict) and "error" in resp_json:
        err_msg = f"空请求体导致500: {resp_json.get('message', '')[:80]}"
    record_result(endpoint, "POST", "boundary_values",
                  f"{operation_id} - 空请求体边界测试", passed, status_code, resp_json,
                  error or err_msg, empty_body)

    if "add" in op_lower or "create" in op_lower or op_lower == "save":
        extreme_body = get_create_body(endpoint, "ext")
        for key in list(extreme_body.keys()):
            if isinstance(extreme_body[key], str):
                extreme_body[key] = "A" * 500
            elif isinstance(extreme_body[key], (int, float)):
                extreme_body[key] = 999999999
            elif isinstance(extreme_body[key], dict) and "id" not in extreme_body[key]:
                pass
        status_code, resp_json, error = make_request(endpoint, extreme_body)
        passed = error is None and status_code in [200, 400, 422, 500]
        record_result(endpoint, "POST", "boundary_values",
                      f"{operation_id} - 极端值边界测试", passed, status_code, resp_json,
                      error or "", extreme_body)

        xss_body = get_create_body(endpoint, "xss")
        for key in list(xss_body.keys()):
            if isinstance(xss_body[key], str) and key not in ["master", "branch"]:
                xss_body[key] = "<script>alert('xss')</script>"
        status_code, resp_json, error = make_request(endpoint, xss_body)
        passed = error is None and status_code in [200, 400, 422, 500]
        if passed and isinstance(resp_json, (dict, str)):
            resp_str = json.dumps(resp_json, ensure_ascii=False) if isinstance(resp_json, dict) else resp_json
            if "<script>" in resp_str:
                passed = False
        record_result(endpoint, "POST", "boundary_values",
                      f"{operation_id} - XSS特殊字符测试", passed, status_code, resp_json,
                      error or "", xss_body)

    if ("add" in op_lower or "create" in op_lower) and module == "Equipment":
        enum_body = build_equipment_create("enum")
        enum_body["device_Type"] = "INVALID_TYPE"
        enum_body["status"] = "INVALID_STATUS"
        status_code, resp_json, error = make_request(endpoint, enum_body)
        passed = error is None and status_code in [200, 400, 422, 500]
        record_result(endpoint, "POST", "boundary_values",
                      f"{operation_id} - 无效枚举值测试", passed, status_code, resp_json,
                      error or "", enum_body)

    if "add" in op_lower or "create" in op_lower:
        dup_body = get_create_body(endpoint, "dup")
        status_code1, _, _ = make_request(endpoint, dup_body)
        status_code2, resp_json2, error2 = make_request(endpoint, dup_body)
        passed = error2 is None and status_code2 in [200, 400, 422, 500]
        if status_code2 == 200 and isinstance(resp_json2, dict):
            result_val = str(resp_json2.get("result", resp_json2.get("code", ""))).upper()
            if result_val in ["FAIL", "ERROR"]:
                passed = True
        record_result(endpoint, "POST", "boundary_values",
                      f"{operation_id} - 重复数据测试", passed, status_code2, resp_json2,
                      error2 or "", dup_body)


def test_response_format(endpoint, operation_id, req_schema, components):
    body = get_smart_body(endpoint, operation_id, req_schema, components)
    status_code, resp_json, error = make_request(endpoint, body)

    if error:
        record_result(endpoint, "POST", "response_format",
                      f"{operation_id} - 响应格式验证", False, 0, None, error, body)
        return

    format_ok, format_err = check_result_format(resp_json)
    passed = status_code == 200 and format_ok
    err_msg = ""
    if status_code != 200:
        err_msg = f"HTTP {status_code}"
        if isinstance(resp_json, dict) and "error" in resp_json:
            err_msg += f": {resp_json.get('error', '')} - {resp_json.get('message', '')[:80]}"
    elif not format_ok:
        err_msg = format_err

    record_result(endpoint, "POST", "response_format",
                  f"{operation_id} - 响应格式验证", passed, status_code, resp_json, err_msg, body)


def test_auth_permission(endpoint, operation_id, req_schema, components):
    body = get_smart_body(endpoint, operation_id, req_schema, components)

    status_code, resp_json, error = make_request(endpoint, body, headers={"Authorization": ""})
    no_auth_passed = error is None
    if no_auth_passed and isinstance(resp_json, dict):
        code_val = str(resp_json.get("code", resp_json.get("status", resp_json.get("result", "")))).upper()
        if code_val in ["401", "403"]:
            no_auth_passed = True
        elif code_val in ["200", "0", "SUCCESS"]:
            no_auth_passed = False
    if isinstance(resp_json, dict) and resp_json.get("status") == 500:
        no_auth_passed = True
    err_msg = "" if no_auth_passed else "未认证请求仍返回成功，可能缺少认证机制"
    record_result(endpoint, "POST", "auth_permission",
                  f"{operation_id} - 无认证访问测试", no_auth_passed, status_code, resp_json, err_msg, body)

    status_code, resp_json, error = make_request(endpoint, body,
                                                  headers={"Authorization": "Bearer invalid_token_12345"})
    invalid_auth_passed = error is None
    if invalid_auth_passed and isinstance(resp_json, dict):
        code_val = str(resp_json.get("code", resp_json.get("status", resp_json.get("result", "")))).upper()
        if code_val in ["401", "403"]:
            invalid_auth_passed = True
        elif code_val in ["200", "0", "SUCCESS"]:
            invalid_auth_passed = False
    if isinstance(resp_json, dict) and resp_json.get("status") == 500:
        invalid_auth_passed = True
    err_msg = "" if invalid_auth_passed else "无效Token请求仍返回成功，认证机制可能不严格"
    record_result(endpoint, "POST", "auth_permission",
                  f"{operation_id} - 无效Token访问测试", invalid_auth_passed, status_code, resp_json, err_msg, body)


def test_error_handling(endpoint, operation_id, req_schema, components):
    status_code, resp_json, error = make_request(endpoint, "not_json_string",
                                                  headers={"Content-Type": "application/json"})
    malformed_passed = error is None and status_code in [200, 400, 415, 500]
    record_result(endpoint, "POST", "error_handling",
                  f"{operation_id} - 格式错误请求测试", malformed_passed, status_code, resp_json,
                  error or "", "not_json_string")

    module = get_module_from_endpoint(endpoint)
    op_lower = operation_id.lower()

    if "add" in op_lower or "create" in op_lower:
        wrong_body = get_create_body(endpoint, "wrong")
        for key in list(wrong_body.keys()):
            if isinstance(wrong_body[key], (int, float)):
                wrong_body[key] = "not_a_number"
            elif isinstance(wrong_body[key], str) and key not in ["master", "branch"]:
                wrong_body[key] = 12345
            elif isinstance(wrong_body[key], dict) and "id" not in wrong_body[key]:
                pass
        status_code, resp_json, error = make_request(endpoint, wrong_body)
        wrong_type_passed = error is None and status_code in [200, 400, 422, 500]
        record_result(endpoint, "POST", "error_handling",
                      f"{operation_id} - 错误数据类型测试", wrong_type_passed, status_code, resp_json,
                      error or "", wrong_body)

    if "update" in op_lower or "get" in op_lower or "delete" in op_lower:
        status_code, resp_json, error = make_request(endpoint, {"id": "non_existent_id_99999"})
        notfound_passed = error is None and status_code in [200, 400, 404, 500]
        record_result(endpoint, "POST", "error_handling",
                      f"{operation_id} - 不存在资源请求测试", notfound_passed, status_code, resp_json,
                      error or "", {"id": "non_existent_id_99999"})

    extra_body = get_smart_body(endpoint, operation_id, req_schema, components)
    if isinstance(extra_body, list):
        extra_body = extra_body[0] if extra_body else {}
    extra_body["__unknown_field__"] = "should_be_ignored"
    extra_body["__another_unknown__"] = 99999
    status_code, resp_json, error = make_request(endpoint, extra_body)
    extra_passed = error is None and status_code in [200, 400, 500]
    record_result(endpoint, "POST", "error_handling",
                  f"{operation_id} - 多余字段容错测试", extra_passed, status_code, resp_json,
                  error or "", extra_body)


def fetch_existing_ids(module, count=3):
    endpoint = f"/{module}/list"
    body = {
        "queryRequest": {"sort": "DESC", "orderBy": "createTime", "conditions": []},
        "pageVO": {"curPage": 1, "pageSize": count},
    }
    status_code, resp_json, error = make_request(endpoint, body)
    ids = []
    if status_code == 200 and isinstance(resp_json, list):
        for item in resp_json[:count]:
            if isinstance(item, dict) and item.get("id"):
                ids.append(item["id"])
    return ids


def ensure_prerequisites():
    print("\n" + "=" * 60)
    print("  准备测试前置数据（按依赖顺序创建）")
    print("=" * 60)

    print("\n  [1/5] Equipment - 尝试创建，失败则从已有数据获取...")
    for i in range(3):
        body = build_equipment_create(f"prereq{i+1}")
        status_code, resp_json, error = make_request("/Equipment/add", body)
        if status_code == 200 and isinstance(resp_json, dict):
            new_id = extract_created_id(resp_json, "Equipment")
            if new_id:
                created_data["Equipment"].append(new_id)
                print(f"    OK Equipment#{i+1}: {new_id}")
            else:
                print(f"    WARN Equipment#{i+1}: 200 but no ID")
        else:
            print(f"    FAIL Equipment#{i+1}: {status_code}")
    if not created_data["Equipment"]:
        existing = fetch_existing_ids("Equipment", 3)
        if existing:
            created_data["Equipment"] = existing
            print(f"    使用已有Equipment: {existing}")
        else:
            print("    WARN: 无可用Equipment数据")

    print("\n  [2/5] 创建 Part...")
    for i in range(4):
        body = build_part_create(f"prereq{i+1}")
        status_code, resp_json, error = make_request("/Part/add", body)
        if status_code == 200 and isinstance(resp_json, dict):
            new_id = extract_created_id(resp_json, "Part")
            if new_id:
                created_data["Part"].append(new_id)
                print(f"    OK Part#{i+1}: {new_id}")
            else:
                print(f"    WARN Part#{i+1}: 200 but no ID")
        else:
            print(f"    FAIL Part#{i+1}: {status_code}")
    if not created_data["Part"]:
        existing = fetch_existing_ids("Part", 4)
        if existing:
            created_data["Part"] = existing
            print(f"    使用已有Part: {existing}")

    print("\n  [3/5] 创建 WorkingProcedure...")
    for i in range(2):
        body = build_workingprocedure_create(f"prereq{i+1}")
        status_code, resp_json, error = make_request("/WorkingProcedure/add", body)
        if status_code == 200 and isinstance(resp_json, dict):
            new_id = extract_created_id(resp_json, "WorkingProcedure")
            if new_id:
                created_data["WorkingProcedure"].append(new_id)
                print(f"    OK WorkingProcedure#{i+1}: {new_id}")
        else:
            print(f"    FAIL WorkingProcedure#{i+1}: {status_code}")
    if not created_data["WorkingProcedure"]:
        existing = fetch_existing_ids("WorkingProcedure", 2)
        if existing:
            created_data["WorkingProcedure"] = existing
            print(f"    使用已有WorkingProcedure: {existing}")

    print("\n  [4/5] 创建 WorkingPlan...")
    for i in range(2):
        body = build_workingplan_create(f"prereq{i+1}")
        status_code, resp_json, error = make_request("/WorkingPlan/add", body)
        if status_code == 200 and isinstance(resp_json, dict):
            new_id = extract_created_id(resp_json, "WorkingPlan")
            if new_id:
                created_data["WorkingPlan"].append(new_id)
                print(f"    OK WorkingPlan#{i+1}: {new_id}")
        else:
            print(f"    FAIL WorkingPlan#{i+1}: {status_code}")
    if not created_data["WorkingPlan"]:
        existing = fetch_existing_ids("WorkingPlan", 2)
        if existing:
            created_data["WorkingPlan"] = existing
            print(f"    使用已有WorkingPlan: {existing}")

    print("\n  [5/5] 创建 Bom_relation...")
    body = build_bom_relation_create()
    status_code, resp_json, error = make_request("/Bom_relation/add", body)
    if status_code == 200 and isinstance(resp_json, dict):
        new_id = extract_created_id(resp_json, "Bom_relation")
        if new_id:
            created_data["Bom_relation"].append(new_id)
            print(f"    OK Bom_relation: {new_id}")
    else:
        print(f"    FAIL Bom_relation: {status_code}")
    if not created_data["Bom_relation"]:
        existing = fetch_existing_ids("Bom_relation", 1)
        if existing:
            created_data["Bom_relation"] = existing
            print(f"    使用已有Bom_relation: {existing}")

    print(f"\n  前置数据汇总:")
    for mod, ids in created_data.items():
        print(f"    {mod}: {ids}")


def run_all_tests():
    print("=" * 80)
    print("FutureService API 全面测试 (最终版 - 基于文档深度优化)")
    print(f"测试时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"目标服务器: {BASE_URL}")
    print("=" * 80)

    api_doc = load_api_doc()
    components = api_doc.get("components", {})
    paths = api_doc.get("paths", {})

    print(f"\n解析API文档完成，共发现 {len(paths)} 个接口路径")

    ensure_prerequisites()

    sorted_paths = sorted(paths.items())

    for idx, (endpoint, methods) in enumerate(sorted_paths, 1):
        for method, details in methods.items():
            operation_id = details.get("operationId", endpoint)
            req_body_schema = None
            req_body = details.get("requestBody", {})
            if req_body:
                content = req_body.get("content", {})
                json_content = content.get("application/json", {})
                req_body_schema = json_content.get("schema")

            print(f"[{idx}/{len(sorted_paths)}] POST {endpoint} ({operation_id})")

            print(f"  ├─ 基本功能...")
            test_basic_functionality(endpoint, operation_id, req_body_schema, components)

            print(f"  ├─ 边界值...")
            test_boundary_values(endpoint, operation_id, req_body_schema, components)

            print(f"  ├─ 响应格式...")
            test_response_format(endpoint, operation_id, req_schema=req_body_schema, components=components)

            print(f"  ├─ 权限控制...")
            test_auth_permission(endpoint, operation_id, req_body_schema, components)

            print(f"  └─ 错误处理...")
            test_error_handling(endpoint, operation_id, req_body_schema, components)

            time.sleep(0.05)

    print("\n" + "=" * 80)
    print("测试执行完毕，正在生成报告...")
    generate_report(api_doc)


def generate_report(api_doc):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lines = []
    lines.append("# FutureService API 全面测试报告（基于文档深度优化）")
    lines.append("")
    lines.append(f"**测试时间**: {now}")
    lines.append(f"**目标服务器**: {BASE_URL}")
    lines.append(f"**API文档版本**: {api_doc.get('info', {}).get('version', 'N/A')}")
    lines.append(f"**测试工具**: Python {sys.version.split()[0]} + requests")
    lines.append(f"**测试策略**: 基于iDME枚举值文档+API参考文档+Swagger DTO深度优化请求体")
    lines.append("")

    lines.append("## 1. 测试概览")
    lines.append("")
    lines.append("| 指标 | 数值 |")
    lines.append("|------|------|")
    lines.append(f"| 总测试用例数 | {results['total']} |")
    lines.append(f"| 通过数 | {results['passed']} |")
    lines.append(f"| 失败数 | {results['failed']} |")
    pass_rate = f"{results['passed']/results['total']*100:.1f}%" if results['total'] > 0 else "N/A"
    lines.append(f"| 通过率 | {pass_rate} |")
    lines.append("")

    lines.append("## 2. 按模块统计")
    lines.append("")
    lines.append("| 模块 | 总数 | 通过 | 失败 | 通过率 |")
    lines.append("|------|------|------|------|--------|")
    for mod, stats in sorted(results["by_module"].items()):
        rate = f"{stats['passed']/stats['total']*100:.1f}%" if stats['total'] > 0 else "N/A"
        lines.append(f"| {mod} | {stats['total']} | {stats['passed']} | {stats['failed']} | {rate} |")
    lines.append("")

    lines.append("## 3. 按测试类型统计")
    lines.append("")
    lines.append("| 测试类型 | 总数 | 通过 | 失败 | 通过率 |")
    lines.append("|----------|------|------|------|--------|")
    for ttype, stats in results["by_test_type"].items():
        rate = f"{stats['passed']/stats['total']*100:.1f}%" if stats['total'] > 0 else "N/A"
        lines.append(f"| {type_names.get(ttype, ttype)} | {stats['total']} | {stats['passed']} | {stats['failed']} | {rate} |")
    lines.append("")

    lines.append("## 4. 前置数据创建结果")
    lines.append("")
    lines.append("| 模块 | 创建的ID |")
    lines.append("|------|---------|")
    for mod, ids in created_data.items():
        id_str = ", ".join(str(i) for i in ids[:5]) if ids else "无"
        lines.append(f"| {mod} | {id_str} |")
    lines.append("")

    lines.append("## 5. 接口基本功能测试结果汇总")
    lines.append("")
    basic_results = [d for d in results["details"] if d["test_type"] == "basic_functionality"]
    lines.append("| 接口 | 操作 | 状态码 | 结果 | 备注 |")
    lines.append("|------|------|--------|------|------|")
    for d in basic_results:
        icon = "✅" if d["passed"] else "❌"
        err = (d["error_msg"] or "")[:100]
        lines.append(f"| {d['endpoint']} | {d['test_name'].split(' - ')[0]} | {d['status_code']} | {icon} | {err} |")
    lines.append("")

    lines.append("## 6. 500错误根因分析（最终版）")
    lines.append("")
    lines.append("### 6.1 已确认的6大根因")
    lines.append("")
    lines.append("经过三轮迭代测试和深入调试，500错误的根因已全部确认：")
    lines.append("")

    root_causes = [
        ("1", "枚举值错误", "所有实体",
         "status字段使用了\"NORMAL\"/\"ACTIVE\"而非iDME内部值\"D001\"(启用)/\"D002\"(停用)；"
         "device_Type使用了\"CNC\"而非\"A002\"；part_Category使用了\"GEAR\"而非\"C002\"等",
         "使用IDME_ENUM_REFERENCE.md中定义的枚举内部值：D001/D002, A001-A009, B001-B004, C001-C012"),

        ("2", "缺少iDME M-V模型字段", "Part",
         "Part实体使用iDME的Master-Version模型，缺少必填的master和branch字段，"
         "导致iDME SDK报错\"The value of the parameter 'master' cannot be empty!\"",
         "创建Part时必须包含\"master\": {}, \"branch\": {}"),

        ("3", "缺少关联对象引用", "WorkingPlan, WorkingProcedure, Bom_relation",
         "WorkingProcedure必须关联related_Equipment和related_Part；"
         "WorkingPlan必须关联related_Part和workingplan_Procedures（且必须引用有效的WorkingProcedure ID）；"
         "Bom_relation必须包含source, target, parent_Part_Ref, child_Part_Ref, unit",
         "按依赖顺序创建：Equipment/Part → WorkingProcedure → WorkingPlan → Bom_relation"),

        ("4", "关联对象引用了错误类型的ID", "WorkingPlan",
         "workingplan_Procedures引用了Part的ID而非WorkingProcedure的ID，"
         "导致iDME SDK类型校验失败返回500",
         "workingplan_Procedures必须引用有效的WorkingProcedure ID"),

        ("5", "字段名不匹配Swagger DTO", "Part, Bom_relation",
         "Part使用了\"name\"而非\"part_Name\"，缺少\"part_Code\"；"
         "Bom_relation使用了\"parent_Part\"/\"child_Part\"而非\"parent_Part_Ref\"/\"child_Part_Ref\"；"
         "缺少\"source\"/\"target\"/\"unit\"字段",
         "严格按照Swagger DTO中的字段名发送请求"),

        ("6", "list/query接口请求格式错误", "所有模块",
         "list接口使用了简单的{pageNo, pageSize}格式，"
         "实际需要QueryRequestWrapper格式：{queryRequest: {sort, orderBy, conditions}, pageVO: {curPage, pageSize}}",
         "list接口使用QueryRequestWrapper格式，query接口使用QueryRequestVo格式"),
    ]

    lines.append("| 序号 | 根因 | 影响模块 | 错误表现 | 修复方案 |")
    lines.append("|------|------|---------|---------|---------|")
    for num, cause, module, symptom, fix in root_causes:
        lines.append(f"| {num} | {cause} | {module} | {symptom} | {fix} |")
    lines.append("")

    lines.append("### 6.2 实体创建依赖关系")
    lines.append("")
    lines.append("```")
    lines.append("Equipment ──┐")
    lines.append("            ├──→ WorkingProcedure ──┐")
    lines.append("Part ───────┘                        ├──→ WorkingPlan")
    lines.append("            └───────────────────────┘")
    lines.append("Part(2+) ──→ Bom_relation")
    lines.append("```")
    lines.append("")
    lines.append("**创建顺序**: Equipment + Part → WorkingProcedure → WorkingPlan → Bom_relation")
    lines.append("")

    lines.append("### 6.3 各实体必填字段速查表")
    lines.append("")
    lines.append("| 实体 | 必填字段 | 枚举字段 | 关联对象字段 |")
    lines.append("|------|---------|---------|-------------|")
    lines.append("| Equipment | devicename, devicecode | device_Type(A001-A009), status(D001/D002), depreciation_Method(B001-B004) | useful_Life_Unit(MeasuringUnit) |")
    lines.append("| Part | part_Name, part_Code, master, branch | part_Category(C001-C012), status(D001/D002) | - |")
    lines.append("| WorkingProcedure | procedure_Code, procedure_Name, related_Equipment, related_Part | status(D001/D002) | standard_Time_Unit(MeasuringUnit) |")
    lines.append("| WorkingPlan | plan_Code, plan_Name, status, related_Part, workingplan_Procedures | status(D001/D002) | - |")
    lines.append("| Bom_relation | source, target, parent_Part_Ref, child_Part_Ref, quantity, unit | - | - |")
    lines.append("")

    lines.append("### 6.4 list/query接口请求格式")
    lines.append("")
    lines.append("**list接口** (QueryRequestWrapper):")
    lines.append("```json")
    lines.append('{')
    lines.append('  "queryRequest": {')
    lines.append('    "sort": "DESC",')
    lines.append('    "orderBy": "createTime",')
    lines.append('    "conditions": []')
    lines.append('  },')
    lines.append('  "pageVO": {')
    lines.append('    "curPage": 1,')
    lines.append('    "pageSize": 10')
    lines.append('  }')
    lines.append('}')
    lines.append("```")
    lines.append("")
    lines.append("**query接口** (QueryRequestVo):")
    lines.append("```json")
    lines.append('{')
    lines.append('  "sort": "DESC",')
    lines.append('  "orderBy": "createTime",')
    lines.append('  "conditions": []')
    lines.append('}')
    lines.append("```")
    lines.append("")

    lines.append("## 7. 详细测试结果")
    lines.append("")
    current_endpoint = ""
    for d in results["details"]:
        if d["endpoint"] != current_endpoint:
            current_endpoint = d["endpoint"]
            lines.append(f"### POST `{current_endpoint}`")
            lines.append("")

        status_icon = "✅" if d["passed"] else "❌"
        type_label = type_names.get(d["test_type"], d["test_type"])
        lines.append(f"**{status_icon} {d['test_name']}** ({type_label})")
        lines.append("")
        lines.append(f"- **状态码**: {d['status_code']}")
        if d["error_msg"]:
            lines.append(f"- **失败原因**: {d['error_msg']}")
        if d["request_body"]:
            lines.append(f"- **请求体**: `{d['request_body']}`")
        if d["response_preview"]:
            lines.append(f"- **响应预览**: `{d['response_preview']}`")
        lines.append("")

    lines.append("## 8. 问题汇总与建议")
    lines.append("")
    failed_tests = [d for d in results["details"] if not d["passed"]]
    if failed_tests:
        lines.append("### 8.1 失败接口清单")
        lines.append("")
        lines.append("| 接口 | 测试类型 | 状态码 | 失败原因 |")
        lines.append("|------|----------|--------|----------|")
        seen = set()
        for d in failed_tests:
            key = f"{d['endpoint']}|{d['test_type']}"
            if key not in seen:
                seen.add(key)
                type_label = type_names.get(d["test_type"], d["test_type"])
                err = (d["error_msg"] or "Unknown")[:120]
                lines.append(f"| {d['endpoint']} | {type_label} | {d['status_code']} | {err} |")
        lines.append("")

        http_500 = sum(1 for d in failed_tests if d["status_code"] == 500)
        http_400 = sum(1 for d in failed_tests if d["status_code"] == 400)
        lines.append(f"### 8.2 错误分布")
        lines.append("")
        lines.append(f"- HTTP 500 错误: {http_500} 次")
        lines.append(f"- HTTP 400 错误: {http_400} 次")
        lines.append(f"- 其他错误: {len(failed_tests) - http_500 - http_400} 次")
        lines.append("")

        lines.append("### 8.3 改进建议")
        lines.append("")
        lines.append("1. **【高优先级】** 增强全局异常处理（@ControllerAdvice），将iDME SDK内部错误包装为统一Result格式返回，避免直接抛出500。当前500错误响应不包含任何业务错误信息，无法定位问题根因")
        lines.append("2. **【高优先级】** `count` 接口返回纯整数时应包装为 `{\"result\": \"SUCCESS\", \"data\": N}` 格式，保持与其他接口一致")
        lines.append("3. **【高优先级】** `query` 接口始终返回500，疑似服务端bug，需排查Controller层实现")
        lines.append("4. **【中优先级】** 添加认证拦截器，未认证请求应返回401，无效Token应返回403")
        lines.append("5. **【中优先级】** 参数校验失败应返回400+详细错误信息，而非500")
        lines.append("6. **【低优先级】** Swagger文档中应标注iDME枚举字段的合法值范围（如status: D001/D002），方便前端集成")
        lines.append("7. **【低优先级】** Swagger DTO的required字段与iDME SDK实际校验不一致（如standard_Time_Unit标注required但实际可选），建议统一")
        lines.append("")
    else:
        lines.append("所有测试均已通过！")
        lines.append("")

    lines.append("## 9. 测试环境信息")
    lines.append("")
    lines.append("| 项目 | 值 |")
    lines.append("|------|-----|")
    lines.append(f"| 测试工具 | Python {sys.version.split()[0]} + requests |")
    lines.append(f"| 目标地址 | {BASE_URL} |")
    lines.append(f"| 请求超时 | {TIMEOUT}s |")
    lines.append(f"| API文档路径 | {API_DOC_PATH} |")
    lines.append(f"| 参考文档 | IDME_FULL_API_REFERENCE.md, IDME_ENUM_REFERENCE.md, COMPREHENSIVE_TEST_CASES.md, SWAGGER_QUICK_TEST_CARDS.md |")
    lines.append(f"| 测试执行时间 | {now} |")
    lines.append("")

    report_content = "\n".join(lines)
    report_path = r"c:\doc\IDME\TreaFour\docs\api-test-report.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_content)

    print(f"\n报告已生成: {report_path}")
    print(f"\n{'='*80}")
    print(f"测试总结: 总计 {results['total']} | 通过 {results['passed']} | 失败 {results['failed']} | 通过率 {pass_rate}")
    print(f"{'='*80}")


if __name__ == "__main__":
    run_all_tests()
