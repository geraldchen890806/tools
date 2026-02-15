#!/usr/bin/env python3
import os
import re

TOOLS_DIR = "/Users/geraldchen/ai/tools/src/app/tools"

# 通用替换规则
REPLACEMENTS = {
    'placeholder="输入文本..."': 'placeholder={t("common.inputPlaceholder")}',
    'placeholder="结果..."': 'placeholder={t("common.resultPlaceholder")}',
    '>复制<': '>{t("common.copy")}<',
    '>复制结果<': '>{t("common.copyResult")}<',
    '>编码<': '>{t("common.encode")}<',
    '>解码<': '>{t("common.decode")}<',
    '>格式化<': '>{t("common.format")}<',
    '>压缩<': '>{t("common.compress")}<',
    '>生成<': '>{t("common.generate")}<',
    '>清空<': '>{t("common.clear")}<',
    '>下载<': '>{t("common.download")}<',
}

# 工具特定替换
TOOL_SPECIFIC = {
    'url-encoder': {
        'placeholder="输入文本或 URL..."': 'placeholder={t("toolPages.url-encoder.inputPlaceholder")}',
    },
    'hash': {
        'placeholder="输入要计算哈希的文本..."': 'placeholder={t("toolPages.hash.inputPlaceholder")}',
    },
    'timestamp': {
        '当前时间': '{t("toolPages.timestamp.currentTime")}',
        '秒:': '{t("toolPages.timestamp.seconds")}:',
        '毫秒:': '{t("toolPages.timestamp.milliseconds")}:',
        '>复制秒<': '>{t("toolPages.timestamp.copySeconds")}<',
        '>复制毫秒<': '>{t("toolPages.timestamp.copyMilliseconds")}<',
    },
    'qrcode': {
        'placeholder="输入文本或 URL..."': 'placeholder={t("toolPages.qrcode.inputPlaceholder")}',
        '尺寸': '{t("toolPages.qrcode.size")}',
    },
    'password-generator': {
        '长度': '{t("toolPages.password-generator.length")}',
        '包含大写': '{t("toolPages.password-generator.includeUppercase")}',
        '包含小写': '{t("toolPages.password-generator.includeLowercase")}',
        '包含数字': '{t("toolPages.password-generator.includeNumbers")}',
        '包含符号': '{t("toolPages.password-generator.includeSymbols")}',
    },
    'uuid-generator': {
        '数量': '{t("toolPages.uuid-generator.count")}',
        '>批量生成<': '>{t("toolPages.uuid-generator.batchGenerate")}<',
        '>复制全部<': '>{t("toolPages.uuid-generator.copyAll")}<',
    },
    'word-counter': {
        '字符': '{t("toolPages.word-counter.characters")}',
        '单词': '{t("toolPages.word-counter.words")}',
        '行数': '{t("toolPages.word-counter.lines")}',
    },
    'case-converter': {
        '>小写<': '>{t("toolPages.case-converter.lower")}<',
        '>大写<': '>{t("toolPages.case-converter.upper")}<',
        '>驼峰<': '>{t("toolPages.case-converter.camel")}<',
        '>下划线<': '>{t("toolPages.case-converter.snake")}<',
    },
    'random-number': {
        '最小值': '{t("toolPages.random-number.min")}',
        '最大值': '{t("toolPages.random-number.max")}',
        '生成数量': '{t("toolPages.random-number.count")}',
    },
}

def process_tool(tool_id, filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 通用替换
    for old, new in REPLACEMENTS.items():
        content = content.replace(old, new)
    
    # 工具特定替换
    if tool_id in TOOL_SPECIFIC:
        for old, new in TOOL_SPECIFIC[tool_id].items():
            content = content.replace(old, new)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    count = 0
    for tool_dir in os.listdir(TOOLS_DIR):
        tool_path = os.path.join(TOOLS_DIR, tool_dir)
        if not os.path.isdir(tool_path):
            continue
        
        page_file = os.path.join(tool_path, "page.tsx")
        if not os.path.exists(page_file):
            continue
        
        if process_tool(tool_dir, page_file):
            print(f"✓ {tool_dir}")
            count += 1
        else:
            print(f"- {tool_dir} (no changes)")
    
    print(f"\n处理了 {count} 个工具")

if __name__ == "__main__":
    main()
