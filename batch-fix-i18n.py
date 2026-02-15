#!/usr/bin/env python3
"""批量修复工具页面的硬编码中文文本"""

import re
import os
from pathlib import Path

# 通用替换规则
COMMON_REPLACEMENTS = [
    # Placeholders
    (r'placeholder="输入文本\.\.\.', 'placeholder={t("common.inputPlaceholder")}'),
    (r'placeholder="输入要转换的文本\.\.\.', 'placeholder={t("common.inputPlaceholder")}'),
    (r'placeholder="结果\.\.\.', 'placeholder={t("common.resultPlaceholder")}'),
    (r'placeholder="输入 URL 或文本\.\.\.', 'placeholder={t("common.inputPlaceholder")}'),
    (r'placeholder="输入文本或 URL', 'placeholder={t("toolPages.qrcode.inputPlaceholder")}'),
    (r'placeholder="搜索状态码或名称\.\.\.', 'placeholder={t("toolPages.http-status.searchPlaceholder")}'),
    (r'placeholder="粘贴 Base64 字符串\.\.\.', 'placeholder={t("toolPages.image-to-base64.base64Placeholder")}'),
    (r'placeholder="Key（16/24/32 字符）', 'placeholder={t("toolPages.aes.keyPlaceholder")}'),
    (r'placeholder="天数', 'placeholder={t("toolPages.date-calculator.daysPlaceholder")}'),
    
    # Buttons and labels (quoted strings only)
    (r'"压缩"', '{t("common.compress")}'),
    (r'"质量:', '{t("toolPages.image-compress.quality")}:'),
    (r'"节省:', '{t("toolPages.image-compress.saved")}:'),
    (r'"下载压缩图片"', '{t("toolPages.image-compress.downloadCompressed")}'),
    (r'"点击或拖拽上传图片"', '{t("toolPages.image-compress.uploadHint")}'),
    (r'"支持 JPG、PNG、WebP"', '{t("toolPages.image-compress.supportFormats")}'),
]

# 工具特定替换（toolId -> 替换列表）
TOOL_SPECIFIC = {
    "qrcode": [
        (r'placeholder="输入文本或 URL', 'placeholder={t("toolPages.qrcode.inputPlaceholder")}'),
    ],
}

def fix_file(filepath):
    """修复单个文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    tool_id = Path(filepath).parent.name
    
    # 应用通用替换
    for pattern, replacement in COMMON_REPLACEMENTS:
        content = re.sub(pattern, replacement, content)
    
    # 应用工具特定替换
    if tool_id in TOOL_SPECIFIC:
        for pattern, replacement in TOOL_SPECIFIC[tool_id]:
            content = re.sub(pattern, replacement, content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    tools_dir = Path("src/app/tools")
    fixed_count = 0
    
    for tool_file in tools_dir.glob("*/page.tsx"):
        if fix_file(tool_file):
            print(f"✅ {tool_file.parent.name}")
            fixed_count += 1
    
    print(f"\n修复了 {fixed_count} 个工具文件")

if __name__ == "__main__":
    main()
