#!/usr/bin/env python3
"""批量修复所有工具的硬编码中文文本"""

import re
from pathlib import Path

# 通用替换（适用于所有工具）
COMMON_REPLACEMENTS = [
    # 按钮
    (r'[">]转换[<"]', lambda m: m.group(0).replace('转换', '{t("common.convert")}' if '{' in m.group(0) else 'convert"')),
    (r'[">]生成[<"]', lambda m: m.group(0).replace('生成', '{t("common.generate")}' if '{' in m.group(0) else 'generate"')),
    (r'[">]解析[<"]', lambda m: m.group(0).replace('解析', '{t("common.parse")}' if '{' in m.group(0) else 'parse"')),
    (r'[">]保存[<"]', lambda m: m.group(0).replace('保存', '{t("common.save")}' if '{' in m.group(0) else 'save"')),
    
    # Placeholder (需要手动处理，这里标记)
    (r'placeholder="([^"]*[\u4e00-\u9fa5][^"]*)"', r'placeholder={t("toolPages.TOOL_ID.PLACEHOLDER_KEY")} /* TODO: 翻译 "\1" */'),
]

# 工具特定替换
TOOL_SPECIFIC = {
    "case-converter": [
        (r'"大写"', '{t("toolPages.case-converter.uppercase")}'),
        (r'"小写"', '{t("toolPages.case-converter.lowercase")}'),
        (r'"首字母大写"', '{t("toolPages.case-converter.capitalize")}'),
        (r'"驼峰"', '{t("toolPages.case-converter.camelCase")}'),
    ],
    "chinese-converter": [
        (r'"繁简转换工具"', '{t("toolPages.chinese-converter.title")}'),
        (r'"转换模式"', '{t("toolPages.chinese-converter.mode")}'),
        (r'"输入"', '{t("common.input")}'),
        (r'"输出"', '{t("common.output")}'),
    ],
    "image-crop": [
        (r'"宽"', '{t("toolPages.image-crop.width")}'),
        (r'"高"', '{t("toolPages.image-crop.height")}'),
    ],
    "password-generator": [
        (r'"弱"', '{t("toolPages.password-generator.weak")}'),
        (r'"中"', '{t("toolPages.password-generator.medium")}'),
        (r'"强"', '{t("toolPages.password-generator.strong")}'),
    ],
}

def fix_tool(tool_path, tool_id):
    """修复单个工具"""
    content = tool_path.read_text(encoding='utf-8')
    original = content
    
    # 应用工具特定替换
    if tool_id in TOOL_SPECIFIC:
        for pattern, replacement in TOOL_SPECIFIC[tool_id]:
            content = re.sub(pattern, replacement, content)
    
    # 应用通用替换
    for pattern, replacement in COMMON_REPLACEMENTS:
        if callable(replacement):
            content = re.sub(pattern, replacement, content)
        else:
            content = re.sub(pattern, replacement.replace('TOOL_ID', tool_id), content)
    
    if content != original:
        tool_path.write_text(content, encoding='utf-8')
        return True
    return False

def main():
    tools_dir = Path("src/app/tools")
    fixed = []
    
    for tool_path in sorted(tools_dir.glob("*/page.tsx")):
        tool_id = tool_path.parent.name
        if fix_tool(tool_path, tool_id):
            fixed.append(tool_id)
            print(f"✅ {tool_id}")
    
    print(f"\n修复了 {len(fixed)} 个工具")
    if fixed:
        print("\n下一步：")
        print("1. 手动检查并修复 TODO 标记的 placeholder")
        print("2. 更新 i18n 配置文件添加缺失的 key")
        print("3. 运行 npm run build 验证")

if __name__ == "__main__":
    main()
