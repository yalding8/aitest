
import json
import random

# 配置
CITIES = ['TJ', 'BJ', 'ZZ', 'CD']
COUNT_PER_CITY = 50  # 每个城市生成50个，总量200个，不够再加
PREFIX = "UHOMES"

def generate_codes():
    codes_list = []
    generated_set = set()

    # 1. 添加永久生效测试码
    codes_list.append({
        "code": "UHOMES999",
        "type": "PERMANENT",
        "description": "永久测试码",
        "status": "unused",  # 逻辑上它永远显示 unused 或者特殊处理
        "usedAt": None,
        "usedBy": None
    })
    generated_set.add("UHOMES999")

    # 2. 生成城市授权码
    for city in CITIES:
        count = 0
        while count < COUNT_PER_CITY:
            # 生成 3 位随机数字，补零
            rand_num = f"{random.randint(0, 999):03d}"
            code = f"{PREFIX}{city}{rand_num}"
            
            if code not in generated_set:
                generated_set.add(code)
                codes_list.append({
                    "code": code,
                    "city": city,
                    "status": "unused",
                    "usedAt": None,
                    "usedBy": None
                })
                count += 1
    
    # 3. 写入文件
    output_data = {"codes": codes_list}
    file_path = '授权码.json'  # 覆盖原文件
    
    # 随机打乱列表顺序（除了第一个999）
    first = codes_list[0]
    rest = codes_list[1:]
    random.shuffle(rest)
    final_list = [first] + rest
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump({"codes": final_list}, f, indent=2, ensure_ascii=False)
        
    print(f"✅ 已生成 {len(final_list)} 个授权码")
    print(f"覆盖文件: {file_path}")
    print("样例:")
    for c in final_list[:5]:
        print(f" - {c['code']}")

if __name__ == "__main__":
    generate_codes()
